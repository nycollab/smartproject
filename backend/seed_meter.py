import random
from datetime import datetime, timedelta, date

from app.database import SessionLocal, engine, Base
from app import models  # noqa: F401
from app.models.user import User
from app.models.meter import MeterProfile, MeterReading


METER_CONFIG = [
    {
        "email": "test@example.com",
        "meter_number": "SM-2024-001",
        "sanctioned_load": 5.0,
        "tariff_rate": 6.50,
        "connection_type": "single_phase",
    },
]


def get_consumption(hour, is_weekend):
    if hour >= 23 or hour < 5:
        base = random.uniform(0.2, 0.5)
    elif 5 <= hour < 9:
        base = random.uniform(0.8, 1.5)
    elif 9 <= hour < 17:
        base = random.uniform(0.3, 0.8)
        if is_weekend:
            base *= random.uniform(1.3, 1.5)
    else:
        base = random.uniform(1.2, 2.5)

    # +/- 20% random variation
    base *= random.uniform(0.8, 1.2)
    return round(base, 3)


def is_peak(hour):
    return (6 <= hour < 10) or (18 <= hour < 22)


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    for cfg in METER_CONFIG:
        user = db.query(User).filter(User.email == cfg["email"]).first()
        if not user:
            print(f"User {cfg['email']} not found, skipping.")
            continue

        existing = (
            db.query(MeterProfile)
            .filter(MeterProfile.user_id == user.user_id)
            .first()
        )
        if existing:
            print(f"Meter profile for {cfg['email']} already exists, skipping.")
            continue

        profile = MeterProfile(
            user_id=user.user_id,
            meter_number=cfg["meter_number"],
            sanctioned_load=cfg["sanctioned_load"],
            tariff_rate=cfg["tariff_rate"],
            connection_type=cfg["connection_type"],
            installed_date=date(2024, 1, 1),
        )
        db.add(profile)
        db.flush()

        now = datetime.now().replace(minute=0, second=0, microsecond=0)
        start = now - timedelta(days=120)

        readings = []
        ts = start
        while ts <= now:
            is_weekend = ts.weekday() >= 5
            readings.append(MeterReading(
                meter_id=profile.meter_id,
                timestamp=ts,
                kwh_consumed=get_consumption(ts.hour, is_weekend),
                voltage=round(random.uniform(218, 242), 1),
                is_peak_hour=is_peak(ts.hour),
            ))
            ts += timedelta(hours=1)

        db.bulk_save_objects(readings)
        db.commit()
        print(f"Generated {len(readings)} readings for {cfg['email']}.")

    db.close()


if __name__ == "__main__":
    main()
