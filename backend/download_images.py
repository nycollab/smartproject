"""Download product images from Unsplash into the frontend's public folder.

Run once after cloning. Re-running is safe; existing files are skipped.
"""
import os
import re
import urllib.request


PRODUCT_IMAGES = [
    # Solar Panels
    ("Mono PERC 400W Solar Panel",     "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&q=80&auto=format&fit=crop"),
    ("Poly 330W Solar Panel",          "https://images.unsplash.com/photo-1521618755572-156ae0cdd74d?w=600&q=80&auto=format&fit=crop"),
    ("Flexible 100W Solar Panel",      "https://images.unsplash.com/photo-1558449028-b53a39d100fc?w=600&q=80&auto=format&fit=crop"),
    ("Bifacial 450W Solar Panel",      "https://images.unsplash.com/photo-1583345237708-add35a664d77?w=600&q=80&auto=format&fit=crop"),
    ("Mono 540W Solar Panel",          "https://images.unsplash.com/photo-1694248407533-d74c41fb5b68?w=600&q=80&auto=format&fit=crop"),

    # Inverters
    ("3kW Hybrid Solar Inverter",      "https://images.unsplash.com/photo-1662601633290-6bd726c7d6c5?w=600&q=80&auto=format&fit=crop"),
    ("5kW On-Grid Solar Inverter",     "https://images.unsplash.com/photo-1662601316968-af7e0fb73b34?w=600&q=80&auto=format&fit=crop"),
    ("1kW Off-Grid Inverter",          "https://images.unsplash.com/photo-1680050957267-083780de20c1?w=600&q=80&auto=format&fit=crop"),
    ("10kW String Inverter",           "https://images.unsplash.com/photo-1558054665-fbe00cd7d920?w=600&q=80&auto=format&fit=crop"),
    ("Micro Inverter 300W",            "https://images.unsplash.com/photo-1680050957240-11720ecccb2f?w=600&q=80&auto=format&fit=crop"),

    # Batteries
    ("150Ah Tall Tubular Battery",     "https://images.unsplash.com/photo-1742899273038-67ff67477663?w=600&q=80&auto=format&fit=crop"),
    ("5kWh Lithium-Ion Battery",       "https://images.unsplash.com/photo-1676337167629-d896b3ed5724?w=600&q=80&auto=format&fit=crop"),
    ("200Ah Lead Acid Battery",        "https://images.unsplash.com/photo-1676337167752-2062c6ca7366?w=600&q=80&auto=format&fit=crop"),
    ("10kWh Home Storage Battery",     "https://images.unsplash.com/photo-1581244249923-172ef5029576?w=600&q=80&auto=format&fit=crop"),
    ("100Ah Gel Battery",              "https://images.unsplash.com/photo-1676337167498-ceac1d6dafba?w=600&q=80&auto=format&fit=crop"),

    # Smart Meters
    ("Single Phase Smart Meter",       "https://images.unsplash.com/photo-1604177420682-0c840feb01de?w=600&q=80&auto=format&fit=crop"),
    ("Three Phase Smart Meter",        "https://images.unsplash.com/photo-1555009784-ae7e7d1b97aa?w=600&q=80&auto=format&fit=crop"),
    ("Prepaid Energy Meter",           "https://images.unsplash.com/photo-1517590130192-8c675e1acf92?w=600&q=80&auto=format&fit=crop"),
    ("Net Meter (Bidirectional)",      "https://images.unsplash.com/photo-1684684383508-261dd0e8f467?w=600&q=80&auto=format&fit=crop"),

    # LED Lighting
    ("12W LED Bulb Pack of 6",         "https://images.unsplash.com/photo-1505410807948-88c1d8ac0e4a?w=600&q=80&auto=format&fit=crop"),
    ("18W LED Panel Light",            "https://images.unsplash.com/photo-1778231374649-9eddfb65dda1?w=600&q=80&auto=format&fit=crop"),
    ("Solar Garden Light Set (4 pcs)", "https://images.unsplash.com/photo-1763091637367-bcd33b348884?w=600&q=80&auto=format&fit=crop"),
    ("36W LED Tube Light",             "https://images.unsplash.com/photo-1623900578828-b4fb9c01c1e7?w=600&q=80&auto=format&fit=crop"),
    ("Motion Sensor LED Flood Light",  "https://images.unsplash.com/photo-1605872223371-0790b8b67dae?w=600&q=80&auto=format&fit=crop"),

    # Energy Appliances
    ("5-Star BLDC Ceiling Fan",        "https://images.unsplash.com/photo-1609519479841-5fd3b2884e17?w=600&q=80&auto=format&fit=crop"),
    ("Solar Water Heater 200L",        "https://images.unsplash.com/photo-1707249907742-4d4984281f3a?w=600&q=80&auto=format&fit=crop"),
    ("Energy Efficient Geyser 15L",    "https://images.unsplash.com/photo-1594233078955-e1f73a02ebb2?w=600&q=80&auto=format&fit=crop"),
    ("Solar Air Cooler",               "https://images.unsplash.com/photo-1665826254141-bfa10685e002?w=600&q=80&auto=format&fit=crop"),
    ("Smart LED Ceiling Fan",          "https://images.unsplash.com/photo-1581153691064-8d0ec09725b9?w=600&q=80&auto=format&fit=crop"),
]


def slugify(name):
    s = name.lower()
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def main():
    out_dir = os.path.join(
        os.path.dirname(__file__), "..", "frontend", "public", "images", "products"
    )
    out_dir = os.path.abspath(out_dir)
    os.makedirs(out_dir, exist_ok=True)

    for name, url in PRODUCT_IMAGES:
        filename = slugify(name) + ".jpg"
        path = os.path.join(out_dir, filename)
        if os.path.exists(path):
            print(f"skip  {filename}")
            continue
        print(f"fetch {filename}")
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp, open(path, "wb") as f:
            f.write(resp.read())

    print(f"\nDone. Images in {out_dir}")


if __name__ == "__main__":
    main()
