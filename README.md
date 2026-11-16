# Earth System Trend Detective — Aqua Ninjas (NASA Space Apps 2026)

**Live Demo:** [aqua-ninjas.netlify.app](https://aqua-ninjas.netlify.app/)  
**Challenge:** *Be An Earth System Trend Detective!*  
**Theme:** *The Next Frontier*  
**Real-World Case Study:** **Aqua Ninjas** (Frisco & McKinney, Collin/Denton County, TX)

---

## What This App Does

1. **Interactive Water & Runoff Trend Detective (25 Texas Cities, 2001–2025)**
   - Analyzes 25 years of daily **NASA POWER** precipitation (`PRECTOTCORR`) across **25 Gulf-draining Texas cities** to count **Extreme Rain Days (`>50 mm/day`)**.
   - Reports honest linear regression metrics (`slope/decade`, `p-value`, `R²`), a clickable **25-City Trend Detective Leaderboard** ranked by lowest `p-value`, and a toggleable **Illustrative Linear Slope Continuation (2026–2050, Not a Climate Forecast)**.

2. **Why Now? Dynamic City-to-Gulf Runoff Pathway & Live NASA Satellite Map**
   - Dynamically maps the selected city's stormwater pathway from neighborhood storm drains through its Texas river basin to coastal bays and the Gulf of Mexico.
   - Overlays live **NASA GIBS** satellite imagery layers (**MODIS Terra `2017-09-02`** storm plumes and **VIIRS NOAA-20 `2024-05-06`** flood plumes) on an interactive Leaflet watershed map, paired with **NASA CYGNSS** and **PACE** coastal context.

3. **Local Action Response (Aqua Ninjas Use Case): Waste Oil Potential & Pilot Stats**
   - Estimates city-level monthly residential used cooking oil collection potential using cited **U.S. Census**, **U.S. EPA** (`47%` of sewer blockages from FOG), **NREL**, and **Defend Your Drains North Texas** benchmarks.
   - Displays **Aqua Ninjas** real-world Frisco pilot drive statistics (`N=2 drives`, `1.0 gal` collected, `113` households reached) as a baseline dataset for ongoing monthly tracking.

4. **City Action & Target-Gap Simulator**
   - Interactive sliders let users test how scaling neighborhood collection drives and drop-off sites closes the gap toward the selected city's monthly target.

---

## Quick Start (Run Locally)

Because the app loads local JSON files via `fetch()`, serve it with any static HTTP server:

```powershell
cd d:\src\nasa-app\aqua-ninjas-trend-detective
python -m http.server 8080
```

Then open `http://localhost:8080` in your browser.

---

## Refreshing NASA & Local Data

- **Refresh 25-City NASA POWER Trends (2001–2025):**
  ```powershell
  python scripts/fetch_texas_cities_nasa_data.py
  ```
- **Update Aqua Ninjas Field Logs:**
  Edit `data/aqua_ninjas_baseline.json` with new drive dates, locations, gallons collected, and households reached.

---

## Project Structure

```text
aqua-ninjas-trend-detective/
├── index.html                           # Single-page app layout
├── styles.css                           # Dark-theme responsive styling
├── app.js                               # SVG trend charts, leaderboard, Leaflet + NASA GIBS map, simulator
├── data/
│   ├── texas_cities_trends.json         # 25 Texas cities NASA POWER (2001–2025) + Census households
│   └── aqua_ninjas_baseline.json        # Aqua Ninjas pilot drives & cited EPA/NREL/Census sources
└── scripts/
    └── fetch_texas_cities_nasa_data.py  # NASA POWER API fetcher & linear trend calculator
```

---

## Deployment

Static site with zero build step—deploy `index.html`, `styles.css`, `app.js`, and `data/` to **Netlify**, **Vercel**, or **GitHub Pages**.
