import re

from app.database import SessionLocal, engine, Base
from app import models  # noqa: F401
from app.models.product import Product


PRODUCTS = [
    # Solar Panels
    {"name": "Mono PERC 400W Solar Panel", "brand": "Loom Solar", "category": "Solar Panels", "price": 15999, "mrp": 18999, "wattage": "400W", "warranty_years": 25, "stock": 50, "description": "High-efficiency monocrystalline PERC solar panel with 400W output. Ideal for rooftop installations."},
    {"name": "Poly 330W Solar Panel", "brand": "Vikram Solar", "category": "Solar Panels", "price": 11499, "mrp": 13999, "wattage": "330W", "warranty_years": 25, "stock": 35, "description": "Polycrystalline 330W panel suitable for residential and small commercial setups."},
    {"name": "Flexible 100W Solar Panel", "brand": "Luminous", "category": "Solar Panels", "price": 5999, "mrp": 7499, "wattage": "100W", "warranty_years": 10, "stock": 80, "description": "Lightweight flexible panel perfect for RVs, boats, and portable setups."},
    {"name": "Bifacial 450W Solar Panel", "brand": "Tata Power Solar", "category": "Solar Panels", "price": 19999, "mrp": 23999, "wattage": "450W", "warranty_years": 30, "stock": 25, "description": "Bifacial module that captures sunlight from both sides for up to 30% extra generation."},
    {"name": "Mono 540W Solar Panel", "brand": "Adani Solar", "category": "Solar Panels", "price": 22999, "mrp": 26999, "wattage": "540W", "warranty_years": 25, "stock": 20, "description": "Large format 540W panel for utility-scale and large rooftop projects."},

    # Inverters
    {"name": "3kW Hybrid Solar Inverter", "brand": "Growatt", "category": "Inverters", "price": 42999, "mrp": 49999, "wattage": "3kW", "warranty_years": 5, "stock": 30, "description": "Hybrid inverter supporting both on-grid and off-grid modes with battery backup."},
    {"name": "5kW On-Grid Solar Inverter", "brand": "Fronius", "category": "Inverters", "price": 65999, "mrp": 74999, "wattage": "5kW", "warranty_years": 5, "stock": 20, "description": "Premium on-grid string inverter with WiFi monitoring and high efficiency."},
    {"name": "1kW Off-Grid Inverter", "brand": "Luminous", "category": "Inverters", "price": 8999, "mrp": 10999, "wattage": "1kW", "warranty_years": 2, "stock": 60, "description": "Compact off-grid inverter for small solar home systems."},
    {"name": "10kW String Inverter", "brand": "Huawei", "category": "Inverters", "price": 89999, "mrp": 99999, "wattage": "10kW", "warranty_years": 10, "stock": 10, "description": "High-capacity string inverter for commercial solar installations."},
    {"name": "Micro Inverter 300W", "brand": "Enphase", "category": "Inverters", "price": 12999, "mrp": 14999, "wattage": "300W", "warranty_years": 25, "stock": 45, "description": "Panel-level micro inverter for maximum energy harvest and monitoring."},

    # Batteries
    {"name": "150Ah Tall Tubular Battery", "brand": "Exide", "category": "Batteries", "price": 13999, "mrp": 15999, "wattage": None, "warranty_years": 5, "stock": 40, "description": "Deep cycle tall tubular battery designed for solar and inverter applications."},
    {"name": "5kWh Lithium-Ion Battery", "brand": "Amaron", "category": "Batteries", "price": 149999, "mrp": 174999, "wattage": "5kWh", "warranty_years": 10, "stock": 15, "description": "Wall-mounted lithium battery pack for home energy storage systems."},
    {"name": "200Ah Lead Acid Battery", "brand": "Luminous", "category": "Batteries", "price": 16999, "mrp": 19999, "wattage": None, "warranty_years": 3, "stock": 30, "description": "Heavy duty lead acid battery for off-grid solar backup."},
    {"name": "10kWh Home Storage Battery", "brand": "Tesla", "category": "Batteries", "price": 549999, "mrp": 599999, "wattage": "10kWh", "warranty_years": 10, "stock": 5, "description": "Premium whole-home battery storage with smart energy management."},
    {"name": "100Ah Gel Battery", "brand": "Microtek", "category": "Batteries", "price": 10999, "mrp": 12999, "wattage": None, "warranty_years": 3, "stock": 55, "description": "Maintenance-free gel battery suitable for solar charge controllers."},

    # Smart Meters
    {"name": "Single Phase Smart Meter", "brand": "Genus", "category": "Smart Meters", "price": 3499, "mrp": 4299, "wattage": None, "warranty_years": 5, "stock": 100, "description": "IoT-enabled single phase smart energy meter with real-time monitoring via SIM."},
    {"name": "Three Phase Smart Meter", "brand": "HPL Electric", "category": "Smart Meters", "price": 6999, "mrp": 8499, "wattage": None, "warranty_years": 5, "stock": 60, "description": "Three phase smart meter for commercial and industrial connections."},
    {"name": "Prepaid Energy Meter", "brand": "Secure Meters", "category": "Smart Meters", "price": 2999, "mrp": 3699, "wattage": None, "warranty_years": 3, "stock": 75, "description": "Prepaid meter with recharge capability and tamper detection."},
    {"name": "Net Meter (Bidirectional)", "brand": "L&T", "category": "Smart Meters", "price": 4999, "mrp": 5999, "wattage": None, "warranty_years": 5, "stock": 40, "description": "Bidirectional net meter for solar rooftop export/import measurement."},

    # LED Lighting
    {"name": "12W LED Bulb Pack of 6", "brand": "Philips", "category": "LED Lighting", "price": 599, "mrp": 799, "wattage": "12W", "warranty_years": 2, "stock": 200, "description": "Energy saving 12W LED bulbs with warm white light. Pack of 6."},
    {"name": "18W LED Panel Light", "brand": "Havells", "category": "LED Lighting", "price": 449, "mrp": 599, "wattage": "18W", "warranty_years": 2, "stock": 150, "description": "Slim LED panel light for false ceiling installation."},
    {"name": "Solar Garden Light Set (4 pcs)", "brand": "Syska", "category": "LED Lighting", "price": 1299, "mrp": 1699, "wattage": "2W each", "warranty_years": 1, "stock": 90, "description": "Solar powered garden stake lights. Auto on at dusk. Set of 4."},
    {"name": "36W LED Tube Light", "brand": "Bajaj", "category": "LED Lighting", "price": 349, "mrp": 449, "wattage": "36W", "warranty_years": 2, "stock": 120, "description": "Direct replacement for old fluorescent tube lights. 4ft length."},
    {"name": "Motion Sensor LED Flood Light", "brand": "Wipro", "category": "LED Lighting", "price": 1899, "mrp": 2399, "wattage": "50W", "warranty_years": 2, "stock": 65, "description": "50W LED flood light with built-in PIR motion sensor for security."},

    # Energy Appliances
    {"name": "5-Star BLDC Ceiling Fan", "brand": "Atomberg", "category": "Energy Appliances", "price": 3299, "mrp": 3999, "wattage": "28W", "warranty_years": 3, "stock": 70, "description": "Energy efficient BLDC motor ceiling fan consuming only 28W with remote control."},
    {"name": "Solar Water Heater 200L", "brand": "V-Guard", "category": "Energy Appliances", "price": 24999, "mrp": 29999, "wattage": None, "warranty_years": 5, "stock": 15, "description": "200 litre evacuated tube solar water heater for households."},
    {"name": "Energy Efficient Geyser 15L", "brand": "Bajaj", "category": "Energy Appliances", "price": 7999, "mrp": 9499, "wattage": "2000W", "warranty_years": 5, "stock": 40, "description": "5-star rated 15 litre storage water heater with thick insulation."},
    {"name": "Solar Air Cooler", "brand": "Kenstar", "category": "Energy Appliances", "price": 12999, "mrp": 15999, "wattage": "65W", "warranty_years": 2, "stock": 20, "description": "Solar compatible desert cooler with inverter-friendly low power motor."},
    {"name": "Smart LED Ceiling Fan", "brand": "Orient", "category": "Energy Appliances", "price": 4999, "mrp": 5999, "wattage": "35W", "warranty_years": 2, "stock": 50, "description": "IoT enabled ceiling fan with app control and energy monitoring."},
]


def make_image_url(name):
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return f"/images/products/{slug}.jpg"


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    inserted = 0
    updated = 0
    for p in PRODUCTS:
        existing = db.query(Product).filter(Product.name == p["name"]).first()
        if existing:
            existing.brand = p["brand"]
            existing.category = p["category"]
            existing.price = p["price"]
            existing.mrp = p["mrp"]
            existing.description = p["description"]
            existing.wattage = p.get("wattage")
            existing.warranty_years = p["warranty_years"]
            existing.stock = p["stock"]
            existing.image_url = make_image_url(p["name"])
            updated += 1
        else:
            db.add(Product(
                name=p["name"],
                brand=p["brand"],
                category=p["category"],
                price=p["price"],
                mrp=p["mrp"],
                description=p["description"],
                wattage=p.get("wattage"),
                warranty_years=p["warranty_years"],
                stock=p["stock"],
                image_url=make_image_url(p["name"]),
            ))
            inserted += 1

    db.commit()
    print(f"Seeded products: {inserted} inserted, {updated} updated.")
    db.close()


if __name__ == "__main__":
    main()
