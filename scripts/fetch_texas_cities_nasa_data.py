"""Fetch 2001-2025 NASA POWER daily precipitation for 25 major Texas cities and compute Extreme Rain Days (>50 mm) trends."""

import json
import math
import urllib.request
from collections import defaultdict
from pathlib import Path

START_DATE = "20010101"
END_DATE = "20251231"
DATA_DIR = Path(__file__).resolve().parent.parent / "data"
OUT_PATH = DATA_DIR / "texas_cities_trends.json"

CITIES = [
    {
        "id": "frisco", "name": "Frisco, TX (Aqua Ninjas)", "lat": 33.1507, "lon": -96.8236,
        "basin": "Trinity River Basin", "color": "#38bdf8",
        "routeText": "Frisco storm drains -> Stewart Creek / Lake Lewisville -> Elm Fork Trinity -> Trinity River -> Galveston Bay -> Gulf of Mexico",
        "coords": [[33.1507, -96.8236], [33.07, -96.95], [32.7767, -96.797], [32.15, -96.15], [30.72, -95.15], [29.75, -94.75], [29.35, -94.78], [28.95, -94.45]],
    },
    {
        "id": "mckinney", "name": "McKinney, TX (Aqua Ninjas)", "lat": 33.1972, "lon": -96.6398,
        "basin": "Trinity River Basin", "color": "#10b981",
        "routeText": "McKinney storm drains -> Wilson Creek / Lake Lavon -> East Fork Trinity -> Trinity River -> Galveston Bay -> Gulf of Mexico",
        "coords": [[33.1972, -96.6398], [33.04, -96.48], [32.62, -96.48], [32.15, -96.15], [30.72, -95.15], [29.75, -94.75], [29.35, -94.78], [28.95, -94.45]],
    },
    {
        "id": "plano", "name": "Plano, TX", "lat": 33.0198, "lon": -96.6989,
        "basin": "Trinity River Basin", "color": "#22d3ee",
        "routeText": "Plano storm drains -> Rowlett / White Rock Creek -> East Fork Trinity -> Trinity River -> Galveston Bay -> Gulf of Mexico",
        "coords": [[33.0198, -96.6989], [32.86, -96.56], [32.62, -96.48], [32.15, -96.15], [30.72, -95.15], [29.75, -94.75], [29.35, -94.78], [28.95, -94.45]],
    },
    {
        "id": "dallas", "name": "Dallas, TX", "lat": 32.7767, "lon": -96.7970,
        "basin": "Trinity River Basin", "color": "#60a5fa",
        "routeText": "Dallas storm drains -> Trinity River -> Lake Livingston -> Galveston Bay -> Gulf of Mexico",
        "coords": [[32.7767, -96.797], [32.15, -96.15], [30.72, -95.15], [29.75, -94.75], [29.35, -94.78], [28.95, -94.45]],
    },
    {
        "id": "fortworth", "name": "Fort Worth, TX", "lat": 32.7555, "lon": -97.3308,
        "basin": "Trinity River Basin", "color": "#818cf8",
        "routeText": "Fort Worth storm drains -> West Fork Trinity -> Trinity River (Dallas) -> Galveston Bay -> Gulf of Mexico",
        "coords": [[32.7555, -97.3308], [32.77, -97.02], [32.7767, -96.797], [32.15, -96.15], [30.72, -95.15], [29.75, -94.75], [29.35, -94.78], [28.95, -94.45]],
    },
    {
        "id": "arlington", "name": "Arlington, TX", "lat": 32.7357, "lon": -97.1081,
        "basin": "Trinity River Basin", "color": "#3b82f6",
        "routeText": "Arlington storm drains -> Johnson Creek / West Fork Trinity -> Trinity River -> Galveston Bay -> Gulf of Mexico",
        "coords": [[32.7357, -97.1081], [32.77, -96.95], [32.7767, -96.797], [32.15, -96.15], [30.72, -95.15], [29.75, -94.75], [29.35, -94.78], [28.95, -94.45]],
    },
    {
        "id": "denton", "name": "Denton, TX", "lat": 33.2148, "lon": -97.1331,
        "basin": "Trinity River Basin", "color": "#06b6d4",
        "routeText": "Denton storm drains -> Hickory Creek / Lake Lewisville -> Elm Fork Trinity -> Galveston Bay -> Gulf of Mexico",
        "coords": [[33.2148, -97.1331], [33.07, -96.95], [32.7767, -96.797], [32.15, -96.15], [30.72, -95.15], [29.75, -94.75], [29.35, -94.78], [28.95, -94.45]],
    },
    {
        "id": "tyler", "name": "Tyler, TX", "lat": 32.3513, "lon": -95.3011,
        "basin": "Neches River Basin", "color": "#2dd4bf",
        "routeText": "Tyler storm drains -> Lake Palestine / Neches River -> Sabine Lake -> Gulf of Mexico",
        "coords": [[32.3513, -95.3011], [31.95, -95.35], [30.85, -94.55], [30.0802, -94.1266], [29.72, -93.86], [29.45, -93.78]],
    },
    {
        "id": "longview", "name": "Longview, TX", "lat": 32.5007, "lon": -94.7405,
        "basin": "Sabine River Basin", "color": "#14b8a6",
        "routeText": "Longview storm drains -> Sabine River -> Toledo Bend -> Sabine Lake -> Gulf of Mexico",
        "coords": [[32.5007, -94.7405], [31.95, -94.15], [31.15, -93.58], [30.05, -93.72], [29.72, -93.86], [29.45, -93.78]],
    },
    {
        "id": "waco", "name": "Waco, TX", "lat": 31.5493, "lon": -97.1467,
        "basin": "Brazos River Basin", "color": "#f59e0b",
        "routeText": "Waco storm drains -> Brazos River -> Freeport Estuary -> Gulf of Mexico",
        "coords": [[31.5493, -97.1467], [30.65, -96.55], [29.62, -95.88], [28.88, -95.38], [28.62, -95.15]],
    },
    {
        "id": "killeen", "name": "Killeen, TX", "lat": 31.1171, "lon": -97.7278,
        "basin": "Brazos River Basin", "color": "#eab308",
        "routeText": "Killeen storm drains -> Lampasas / Little River -> Brazos River -> Freeport -> Gulf of Mexico",
        "coords": [[31.1171, -97.7278], [30.85, -97.12], [30.65, -96.55], [29.62, -95.88], [28.88, -95.38], [28.62, -95.15]],
    },
    {
        "id": "collegestation", "name": "College Station, TX", "lat": 30.6280, "lon": -96.3344,
        "basin": "Brazos River Basin", "color": "#fbbf24",
        "routeText": "College Station storm drains -> Carter Creek / Navasota & Brazos Rivers -> Freeport -> Gulf of Mexico",
        "coords": [[30.6280, -96.3344], [30.35, -96.15], [29.62, -95.88], [28.88, -95.38], [28.62, -95.15]],
    },
    {
        "id": "austin", "name": "Austin, TX", "lat": 30.2672, "lon": -97.7431,
        "basin": "Colorado River Basin (TX)", "color": "#a78bfa",
        "routeText": "Austin storm drains -> Lady Bird Lake / Colorado River -> Matagorda Bay -> Gulf of Mexico",
        "coords": [[30.2672, -97.7431], [29.71, -96.98], [29.05, -96.15], [28.65, -95.98], [28.38, -95.75]],
    },
    {
        "id": "sanmarcos", "name": "San Marcos, TX", "lat": 29.8833, "lon": -97.9414,
        "basin": "Guadalupe River Basin", "color": "#c084fc",
        "routeText": "San Marcos storm drains -> San Marcos River -> Guadalupe River -> San Antonio Bay -> Gulf of Mexico",
        "coords": [[29.8833, -97.9414], [29.52, -97.58], [28.8053, -97.0036], [28.32, -96.75], [28.08, -96.52]],
    },
    {
        "id": "sanantonio", "name": "San Antonio, TX", "lat": 29.4241, "lon": -98.4936,
        "basin": "San Antonio River Basin", "color": "#fb7185",
        "routeText": "San Antonio storm drains -> San Antonio River -> San Antonio Bay -> Gulf of Mexico",
        "coords": [[29.4241, -98.4936], [28.88, -97.85], [28.45, -96.95], [28.32, -96.75], [28.08, -96.52]],
    },
    {
        "id": "victoria", "name": "Victoria, TX", "lat": 28.8053, "lon": -97.0036,
        "basin": "Guadalupe River Basin", "color": "#facc15",
        "routeText": "Victoria storm drains -> Guadalupe River -> San Antonio Bay -> Gulf of Mexico",
        "coords": [[28.8053, -97.0036], [28.55, -96.88], [28.32, -96.75], [28.08, -96.52]],
    },
    {
        "id": "houston", "name": "Houston, TX", "lat": 29.7604, "lon": -95.3698,
        "basin": "San Jacinto / Buffalo Bayou", "color": "#f97316",
        "routeText": "Houston storm drains -> Buffalo Bayou / Ship Channel -> Galveston Bay -> Gulf of Mexico",
        "coords": [[29.7604, -95.3698], [29.72, -95.02], [29.35, -94.78], [28.95, -94.45]],
    },
    {
        "id": "galveston", "name": "Galveston, TX", "lat": 29.3013, "lon": -94.7977,
        "basin": "Galveston Bay Coastal Basin", "color": "#fb923c",
        "routeText": "Galveston storm drains -> Galveston Bay / Bolivar Roads -> Gulf of Mexico",
        "coords": [[29.3013, -94.7977], [29.35, -94.72], [28.95, -94.45]],
    },
    {
        "id": "beaumont", "name": "Beaumont, TX", "lat": 30.0802, "lon": -94.1266,
        "basin": "Neches / Sabine Basin", "color": "#34d399",
        "routeText": "Beaumont storm drains -> Neches River -> Sabine Lake -> Sabine Pass -> Gulf of Mexico",
        "coords": [[30.0802, -94.1266], [29.92, -93.92], [29.72, -93.86], [29.45, -93.78]],
    },
    {
        "id": "corpuschristi", "name": "Corpus Christi, TX", "lat": 27.8006, "lon": -97.3964,
        "basin": "Nueces / Coastal Bend Basin", "color": "#f472b6",
        "routeText": "Corpus Christi storm drains -> Nueces / Corpus Christi Bay -> Aransas Pass -> Gulf of Mexico",
        "coords": [[27.8006, -97.3964], [27.82, -97.22], [27.83, -97.05], [27.68, -96.82]],
    },
    {
        "id": "laredo", "name": "Laredo, TX", "lat": 27.5306, "lon": -99.4803,
        "basin": "Rio Grande Basin", "color": "#e879f9",
        "routeText": "Laredo storm drains -> Rio Grande -> Falcon Lake -> Brownsville -> Gulf of Mexico",
        "coords": [[27.5306, -99.4803], [26.85, -99.15], [26.18, -98.23], [25.9017, -97.4975], [25.95, -97.14], [25.95, -96.85]],
    },
    {
        "id": "mcallen", "name": "McAllen, TX", "lat": 26.2034, "lon": -98.2300,
        "basin": "Rio Grande Basin", "color": "#d946ef",
        "routeText": "McAllen storm drains -> Arroyo Colorado / Rio Grande -> Laguna Madre -> Gulf of Mexico",
        "coords": [[26.2034, -98.2300], [26.12, -97.65], [25.95, -97.14], [25.95, -96.85]],
    },
    {
        "id": "brownsville", "name": "Brownsville, TX", "lat": 25.9017, "lon": -97.4975,
        "basin": "Rio Grande Basin", "color": "#f43f5e",
        "routeText": "Brownsville storm drains -> Rio Grande / Brownsville Ship Channel -> Gulf of Mexico",
        "coords": [[25.9017, -97.4975], [25.95, -97.14], [25.95, -96.85]],
    },
    {
        "id": "abilene", "name": "Abilene, TX", "lat": 32.4487, "lon": -99.7331,
        "basin": "Brazos River Basin", "color": "#fcd34d",
        "routeText": "Abilene storm drains -> Clear Fork Brazos -> Brazos River (Waco) -> Freeport -> Gulf of Mexico",
        "coords": [[32.4487, -99.7331], [32.65, -98.85], [31.5493, -97.1467], [30.65, -96.55], [29.62, -95.88], [28.88, -95.38], [28.62, -95.15]],
    },
    {
        "id": "lubbock", "name": "Lubbock, TX", "lat": 33.5779, "lon": -101.8552,
        "basin": "Brazos River Basin", "color": "#fde047",
        "routeText": "Lubbock storm drains -> Double Mountain Fork Brazos -> Brazos River -> Freeport -> Gulf of Mexico",
        "coords": [[33.5779, -101.8552], [33.15, -100.45], [32.65, -98.85], [31.5493, -97.1467], [30.65, -96.55], [29.62, -95.88], [28.88, -95.38], [28.62, -95.15]],
    },
]


def linear_trend(xs: list[float], ys: list[float]) -> dict:
    """Compute ordinary least-squares slope, R², and two-sided p-value."""
    n = len(xs)
    mean_x = sum(xs) / n
    mean_y = sum(ys) / n
    sxx = sum((x - mean_x) ** 2 for x in xs)
    syy = sum((y - mean_y) ** 2 for y in ys)
    sxy = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))

    slope = sxy / sxx if sxx else 0.0
    intercept = mean_y - slope * mean_x
    r_sq = (sxy ** 2) / (sxx * syy) if syy > 0 and sxx > 0 else 0.0

    residuals = [y - (intercept + slope * x) for x, y in zip(xs, ys)]
    sse = sum(r ** 2 for r in residuals)
    df = n - 2
    se_slope = math.sqrt((sse / df) / sxx) if df > 0 and sxx > 0 else 0.0
    t_stat = abs(slope / se_slope) if se_slope > 0 else 0.0

    try:
        from scipy import stats
        p_val = float(2.0 * stats.t.sf(t_stat, df))
    except ImportError:
        p_val = math.erfc(t_stat / math.sqrt(2.0))

    direction = "increasing" if slope > 0 else "decreasing" if slope < 0 else "flat"
    return {
        "slope_per_year": round(slope, 4),
        "slope_per_decade": round(slope * 10.0, 3),
        "r_squared": round(r_sq, 4),
        "p_value": round(p_val, 4),
        "significant_0_05": p_val < 0.05,
        "direction": direction,
    }


def fetch_city(city: dict) -> dict:
    url = (
        "https://power.larc.nasa.gov/api/temporal/daily/point"
        f"?parameters=PRECTOTCORR&community=AG"
        f"&longitude={city['lon']}&latitude={city['lat']}"
        f"&start={START_DATE}&end={END_DATE}&format=JSON"
    )
    print(f"Fetching {city['name']}...")
    req = urllib.request.Request(url, headers={"User-Agent": "AquaNinjas-SpaceApps2026/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = json.loads(resp.read().decode("utf-8"))

    precip = raw["properties"]["parameter"]["PRECTOTCORR"]
    yearly = defaultdict(lambda: {"days": 0, "extreme": 0})
    for date_str, val in precip.items():
        if val is not None and val > -900:
            yr = int(date_str[:4])
            yearly[yr]["days"] += 1
            if val >= 50.0:
                yearly[yr]["extreme"] += 1

    series = [
        {"year": yr, "extreme_rain_days_gt50mm": yearly[yr]["extreme"]}
        for yr in sorted(yearly.keys())
        if yearly[yr]["days"] >= 300
    ]
    xs = [float(r["year"]) for r in series]
    ys = [float(r["extreme_rain_days_gt50mm"]) for r in series]
    trend = linear_trend(xs, ys)
    print(f"  -> {city['name']}: {trend['direction']} ({trend['slope_per_decade']}/decade, p={trend['p_value']})")
    return {
        "id": city["id"],
        "location": city["name"],
        "basin": city["basin"],
        "color": city["color"],
        "routeText": city["routeText"],
        "coords": city["coords"],
        "coordinates": {"lat": city["lat"], "lon": city["lon"]},
        "source": "NASA POWER API (MERRA-2 / GPM-derived, 2001-2025)",
        "years_covered": f"{series[0]['year']}-{series[-1]['year']}",
        "series": series,
        "trends": {"extreme_rain_days_gt50mm": trend},
    }


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    cities_out = {}
    for city in CITIES:
        cities_out[city["id"]] = fetch_city(city)

    OUT_PATH.write_text(json.dumps({"cities": cities_out}, indent=2), encoding="utf-8")
    print(f"\nSaved all {len(cities_out)} Texas cities to {OUT_PATH}")


if __name__ == "__main__":
    main()
