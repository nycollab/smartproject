from datetime import datetime, date
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel


class MeterProfileResponse(BaseModel):
    meter_id: int
    meter_number: str
    sanctioned_load: Decimal
    tariff_rate: Decimal
    connection_type: str
    installed_date: date

    class Config:
        from_attributes = True


class MeterReadingResponse(BaseModel):
    timestamp: datetime
    kwh_consumed: Decimal
    voltage: Optional[Decimal] = None
    is_peak_hour: bool


class MeterStatsResponse(BaseModel):
    total_kwh_this_month: Decimal
    avg_daily_kwh: Decimal
    peak_usage_kwh: Decimal
    off_peak_usage_kwh: Decimal
    estimated_cost: Decimal
    carbon_footprint_kg: Decimal


class MonthSummary(BaseModel):
    total_kwh: Decimal
    cost: Decimal


class MeterComparisonResponse(BaseModel):
    current_month: MonthSummary
    previous_month: MonthSummary
    change_percent: Decimal
