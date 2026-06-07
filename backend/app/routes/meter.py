from datetime import datetime, timedelta
from decimal import Decimal
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, cast, Date
from sqlalchemy.orm import Session

from app.utils.deps import get_db, get_current_user
from app.models.user import User
from app.models.meter import MeterProfile, MeterReading
from app.schemas.meter import (
    MeterProfileResponse, MeterReadingResponse,
    MeterStatsResponse, MeterComparisonResponse, MonthSummary,
)

router = APIRouter(prefix="/meter", tags=["meter"])

CARBON_PER_KWH = Decimal("0.82")  # kg CO2 per kWh, India grid avg


def _get_profile_or_404(db, user):
    profile = db.query(MeterProfile).filter(MeterProfile.user_id == user.user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Meter profile not found")
    return profile


@router.get("/profile", response_model=MeterProfileResponse)
def get_profile(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return _get_profile_or_404(db, user)


@router.get("/readings", response_model=List[MeterReadingResponse])
def get_readings(
    range_: str = Query("daily", alias="range"),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    profile = _get_profile_or_404(db, user)
    now = datetime.now()

    if range_ == "daily":
        cutoff = now - timedelta(hours=24)
        rows = (
            db.query(MeterReading)
            .filter(
                MeterReading.meter_id == profile.meter_id,
                MeterReading.timestamp >= cutoff,
            )
            .order_by(MeterReading.timestamp)
            .all()
        )
        return [
            MeterReadingResponse(
                timestamp=r.timestamp,
                kwh_consumed=r.kwh_consumed,
                voltage=r.voltage,
                is_peak_hour=r.is_peak_hour,
            )
            for r in rows
        ]

    if range_ == "weekly":
        cutoff = now - timedelta(days=7)
    elif range_ == "monthly":
        cutoff = now - timedelta(days=30)
    else:
        raise HTTPException(status_code=400, detail="Invalid range")

    rows = (
        db.query(
            cast(MeterReading.timestamp, Date).label("day"),
            func.sum(MeterReading.kwh_consumed).label("kwh"),
            func.avg(MeterReading.voltage).label("voltage"),
        )
        .filter(
            MeterReading.meter_id == profile.meter_id,
            MeterReading.timestamp >= cutoff,
        )
        .group_by("day")
        .order_by("day")
        .all()
    )

    return [
        MeterReadingResponse(
            timestamp=datetime.combine(r.day, datetime.min.time()),
            kwh_consumed=r.kwh,
            voltage=r.voltage,
            is_peak_hour=False,
        )
        for r in rows
    ]


@router.get("/stats", response_model=MeterStatsResponse)
def get_stats(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = _get_profile_or_404(db, user)

    now = datetime.now()
    month_start = datetime(now.year, now.month, 1)

    total = db.query(func.sum(MeterReading.kwh_consumed)).filter(
        MeterReading.meter_id == profile.meter_id,
        MeterReading.timestamp >= month_start,
    ).scalar() or Decimal("0")

    days_so_far = max((now - month_start).days, 1)
    avg_daily = total / days_so_far

    peak = db.query(func.sum(MeterReading.kwh_consumed)).filter(
        MeterReading.meter_id == profile.meter_id,
        MeterReading.timestamp >= month_start,
        MeterReading.is_peak_hour == True,
    ).scalar() or Decimal("0")

    off_peak = total - peak
    cost = total * profile.tariff_rate
    carbon = total * CARBON_PER_KWH

    return MeterStatsResponse(
        total_kwh_this_month=total,
        avg_daily_kwh=avg_daily,
        peak_usage_kwh=peak,
        off_peak_usage_kwh=off_peak,
        estimated_cost=cost,
        carbon_footprint_kg=carbon,
    )


@router.get("/comparison", response_model=MeterComparisonResponse)
def get_comparison(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = _get_profile_or_404(db, user)

    now = datetime.now()
    current_start = datetime(now.year, now.month, 1)
    if now.month == 1:
        prev_start = datetime(now.year - 1, 12, 1)
    else:
        prev_start = datetime(now.year, now.month - 1, 1)

    current_total = db.query(func.sum(MeterReading.kwh_consumed)).filter(
        MeterReading.meter_id == profile.meter_id,
        MeterReading.timestamp >= current_start,
    ).scalar() or Decimal("0")

    prev_total = db.query(func.sum(MeterReading.kwh_consumed)).filter(
        MeterReading.meter_id == profile.meter_id,
        MeterReading.timestamp >= prev_start,
        MeterReading.timestamp < current_start,
    ).scalar() or Decimal("0")

    change = Decimal("0")
    if prev_total > 0:
        change = ((current_total - prev_total) / prev_total * 100).quantize(Decimal("0.01"))

    return MeterComparisonResponse(
        current_month=MonthSummary(
            total_kwh=current_total,
            cost=current_total * profile.tariff_rate,
        ),
        previous_month=MonthSummary(
            total_kwh=prev_total,
            cost=prev_total * profile.tariff_rate,
        ),
        change_percent=change,
    )
