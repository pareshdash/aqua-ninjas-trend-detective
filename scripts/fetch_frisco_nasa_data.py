"""Fetch 2001-2025 NASA POWER daily data for Frisco, TX and compute Earth-system trends."""

import json
import math
import urllib.request
from collections import defaultdict
from pathlib import Path

FRISCO_LAT = 33.1507
FRISCO_LON = -96.8236
START_DATE = "20010101"
END_DATE = "20251231"

POWER_URL = (
    "https://power.larc.nasa.gov/api/temporal/daily/point"
    f"?parameters=PRECTOTCORR,TS,T2M,GWETTOP"
    f"&community=AG"
    f"&longitude={FRISCO_LON}"
    f"&latitude={FRISCO_LAT}"
    f"&start={START_DATE}"
    f"&end={END_DATE}"
    "&format=JSON"
)

OUT_DIR = Path(__file__).resolve().parent.parent / "data"
RAW_PATH = OUT_DIR / "frisco_nasa_power_raw.json"
TRENDS_PATH = OUT_DIR / "frisco_trends.json"


def linear_trend(xs: list[float], ys: list[float]) -> dict:
    """Compute ordinary least-squares slope, intercept, and two-sided t-test p-value."""
    n = len(xs)
    if n < 3:
        return {"slope_per_year": 0.0, "slope_per_decade": 0.0, "r_squared": 0.0, "p_value": 1.0}

    mean_x = sum(xs) / n
    mean_y = sum(ys) / n
    sxx = sum((x - mean_x) ** 2 for x in xs)
    syy = sum((y - mean_y) ** 2 for y in ys)
    sxy = sum((x - mean_x) * (y - mean_y) for x, y in zip(xs, ys))

    if sxx == 0:
        return {"slope_per_year": 0.0, "slope_per_decade": 0.0, "r_squared": 0.0, "p_value": 1.0}

    slope = sxy / sxx
    intercept = mean_y - slope * mean_x
    r_sq = (sxy ** 2) / (sxx * syy) if syy > 0 else 0.0

    # Residual standard error & t-statistic
    residuals = [y - (intercept + slope * x) for x, y in zip(xs, ys)]
    sse = sum(r ** 2 for r in residuals)
    df = n - 2
    se_slope = math.sqrt((sse / df) / sxx) if df > 0 and sxx > 0 else 0.0
    t_stat = abs(slope / se_slope) if se_slope > 0 else 0.0

    # Approximate two-sided p-value via normal/Student-t survival (accurate enough for df >= 20, or use scipy if installed)
    try:
        from scipy import stats
        p_val = float(2.0 * stats.t.sf(t_stat, df))
    except ImportError:
        # Fallback: standard normal approximation
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


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Fetching NASA POWER daily data ({START_DATE} to {END_DATE}) for Frisco, TX...")
    req = urllib.request.Request(POWER_URL, headers={"User-Agent": "AquaNinjas-SpaceApps2026/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        raw = json.loads(resp.read().decode("utf-8"))

    RAW_PATH.write_text(json.dumps(raw), encoding="utf-8")
    params = raw["properties"]["parameter"]
    precip = params["PRECTOTCORR"]
    ts_skin = params["TS"]
    t2m = params["T2M"]
    gwettop = params["GWETTOP"]

    yearly = defaultdict(lambda: {
        "precip_vals": [],
        "heavy_rain_days": 0,
        "extreme_rain_days": 0,
        "summer_ts": [],
        "summer_t2m": [],
        "gwettop_vals": [],
    })

    for date_str, p_val in precip.items():
        year = int(date_str[:4])
        month = int(date_str[4:6])
        if p_val is not None and p_val > -900:
            yearly[year]["precip_vals"].append(p_val)
            if p_val >= 25.0:
                yearly[year]["heavy_rain_days"] += 1
            if p_val >= 50.0:
                yearly[year]["extreme_rain_days"] += 1
        if month in (6, 7, 8):
            s_val = ts_skin.get(date_str)
            a_val = t2m.get(date_str)
            if s_val is not None and s_val > -900:
                yearly[year]["summer_ts"].append(s_val)
            if a_val is not None and a_val > -900:
                yearly[year]["summer_t2m"].append(a_val)
        w_val = gwettop.get(date_str)
        if w_val is not None and w_val > -900:
            yearly[year]["gwettop_vals"].append(w_val)

    series = []
    for year in sorted(yearly.keys()):
        d = yearly[year]
        if len(d["precip_vals"]) < 300:
            continue
        series.append({
            "year": year,
            "total_precip_mm": round(sum(d["precip_vals"]), 1),
            "heavy_rain_days_gt25mm": d["heavy_rain_days"],
            "extreme_rain_days_gt50mm": d["extreme_rain_days"],
            "summer_surface_temp_c": round(sum(d["summer_ts"]) / len(d["summer_ts"]), 2) if d["summer_ts"] else None,
            "summer_air_temp_c": round(sum(d["summer_t2m"]) / len(d["summer_t2m"]), 2) if d["summer_t2m"] else None,
            "mean_soil_wetness": round(sum(d["gwettop_vals"]) / len(d["gwettop_vals"]), 3) if d["gwettop_vals"] else None,
        })

    years = [float(r["year"]) for r in series]
    stats_out = {
        "total_precip_mm": linear_trend(years, [r["total_precip_mm"] for r in series]),
        "heavy_rain_days_gt25mm": linear_trend(years, [float(r["heavy_rain_days_gt25mm"]) for r in series]),
        "extreme_rain_days_gt50mm": linear_trend(years, [float(r["extreme_rain_days_gt50mm"]) for r in series]),
        "summer_surface_temp_c": linear_trend(years, [r["summer_surface_temp_c"] for r in series if r["summer_surface_temp_c"] is not None]),
        "mean_soil_wetness": linear_trend(years, [r["mean_soil_wetness"] for r in series if r["mean_soil_wetness"] is not None]),
    }

    output = {
        "location": "Frisco / Collin-Denton County, TX",
        "coordinates": {"lat": FRISCO_LAT, "lon": FRISCO_LON},
        "source": "NASA POWER API (MERRA-2 / GPM-derived, 2001-2025)",
        "url": POWER_URL,
        "years_covered": f"{series[0]['year']}-{series[-1]['year']}",
        "series": series,
        "trends": stats_out,
    }

    TRENDS_PATH.write_text(json.dumps(output, indent=2), encoding="utf-8")
    print(f"Saved {len(series)} years of Frisco trends to {TRENDS_PATH}")
    print("\nTrend Summary (2001-2025):")
    for k, v in stats_out.items():
        print(f"  - {k}: {v['direction']} ({v['slope_per_decade']}/decade, p={v['p_value']}, R²={v['r_squared']})")


if __name__ == "__main__":
    main()
