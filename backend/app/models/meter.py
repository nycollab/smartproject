from sqlalchemy import (
    Column, Integer, String, DECIMAL, Date, DateTime, Boolean, Enum,
    ForeignKey, Index,
)

from app.database import Base


class MeterProfile(Base):
    __tablename__ = "meter_profiles"

    meter_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), unique=True, nullable=False)
    meter_number = Column(String(20), unique=True, nullable=False)
    sanctioned_load = Column(DECIMAL(5, 2), nullable=False)
    tariff_rate = Column(DECIMAL(6, 2), nullable=False)
    connection_type = Column(
        Enum("single_phase", "three_phase"), default="single_phase"
    )
    installed_date = Column(Date, nullable=False)


class MeterReading(Base):
    __tablename__ = "meter_readings"

    reading_id = Column(Integer, primary_key=True, autoincrement=True)
    meter_id = Column(Integer, ForeignKey("meter_profiles.meter_id"), nullable=False)
    timestamp = Column(DateTime, nullable=False)
    kwh_consumed = Column(DECIMAL(8, 3), nullable=False)
    voltage = Column(DECIMAL(5, 1), nullable=True)
    is_peak_hour = Column(Boolean, default=False)

    # speeds up dashboard range queries
    __table_args__ = (
        Index("ix_meter_readings_meter_timestamp", "meter_id", "timestamp"),
    )
