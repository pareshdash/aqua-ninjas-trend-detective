# Space Apps 2026 Submission Draft

## Project Title
**Earth System Trend Detective: Aqua Ninjas Stormwater & Waste-Oil Prevention**

## Live Demo Link
`https://aqua-ninjas.netlify.app/`

## High-Concept Summary (1–2 Sentences)
An interactive Earth System Trend Detective web app that tests 25 years of NASA precipitation data (`2001–2025`) across **25 Texas cities** to track extreme-rainfall stormwater runoff risk—paired with **Aqua Ninjas** (Frisco & McKinney, TX) as a real-world community waste-oil prevention case study.

---

## Project Description (Copy & Paste for Space Apps Portal)

### The Problem
Across fast-growing Texas cities, intense rainstorms generate sudden urban stormwater runoff that flushes improperly disposed cooking oil, grease, and street pollutants through storm drains into local creeks, river basins, coastal bays, and the Gulf of Mexico. Students and communities need a clear, scientifically honest way to ask: *"Are extreme storm events increasing stormwater runoff risk across Texas, and how much local action does it take to stop waste oil at the source?"*

### Our Solution
We built **Earth System Trend Detective**, a 4-part interactive web application powered by real NASA Earth observation datasets:
1. **Interactive Water & Runoff Trend Detective (25 Texas Cities, 2001–2025):**
   - Uses 25 years of daily **NASA POWER** precipitation data (`PRECTOTCORR`) to count **Extreme Rain Days (`>50 mm/day`)** across 25 Gulf-draining Texas cities.
   - Computes linear slopes (`days/decade`), `p-values`, and `R²`, ranks all 25 cities in a clickable **Trend Detective Leaderboard** (highlighting near-significant coastal upward trends like **Brownsville, TX** at `+0.377/dec, p = 0.0524` and **Corpus Christi, TX** at `+0.346/dec, p = 0.079`), and includes a toggleable **Illustrative Linear Slope Continuation (2026–2050, Not a Climate Forecast)**.
2. **Dynamic City-to-Gulf Runoff Pathway & Live NASA Satellite Map:**
   - Dynamically maps the selected city's stormwater route through its Texas river basin to the Gulf of Mexico.
   - Overlays live **NASA GIBS** satellite imagery (**MODIS Terra `2017-09-02`** storm plumes and **VIIRS NOAA-20 `2024-05-06`** flood plumes) on an interactive Leaflet watershed map, paired with **NASA CYGNSS** and **PACE** coastal plume context.
3. **Local Action Response (Aqua Ninjas Use Case) — Waste Oil Potential & Pilot Stats:**
   - Combines **U.S. Census** household counts, **U.S. EPA** (`47%` of municipal sewer blockages caused by Fats, Oils, and Grease), **NREL** (`~9 lbs/person/yr` used cooking oil), and **Defend Your Drains North Texas** (`8,500+ gal/season`) data to estimate each city's monthly collection potential.
   - Tracks **Aqua Ninjas** real-world Frisco pilot drives (`N=2 drives`, `1.0 gal` collected, `113` households reached) as an honest baseline for ongoing monthly citizen-science tracking.
4. **City Action & Target-Gap Simulator:**
   - Interactive sliders let communities test how scaling neighborhood collection drives and drop-off sites closes the gap toward their city's monthly target and helps prevent EPA FOG sewer overflows.

### Scientific Integrity & Findings
* **Honest Trend Testing:** Texas cities swing sharply between drought and flood years, so most 25-year linear slopes remain above `p = 0.05` (e.g., Frisco `+0.446 days/decade`, `p = 0.3063`; Brownsville `+0.377 days/decade`, `p = 0.0524`). We report exact `p-values` and `R²` and explicitly label any 2026–2050 continuation as illustrative rather than a climate forecast.
* **Honest Satellite Scale:** Rather than claiming satellites can see individual storm drains, we connect local NASA POWER rainfall triggers to downstream **MODIS / VIIRS / CYGNSS / PACE** coastal runoff plumes.
* **Why Prevention Still Matters:** Even without `p < 0.05` certainty everywhere, extreme storm spikes still flush waste oil into storm drains and waterways—making neighborhood prevention essential every season.

### NASA & Public Data Sources Used
* **NASA POWER API** (MERRA-2 / GPM-derived daily `PRECTOTCORR`, `2001–2025` across 25 Texas cities)
* **NASA GIBS WMTS** (**MODIS Terra `2017-09-02`** & **VIIRS NOAA-20 `2024-05-06`** Corrected Reflectance imagery)
* **NASA CYGNSS (Level 3 Microplastics) & PACE** (Coastal surfactant/microplastic plume & turbidity context)
* **U.S. Census Bureau, U.S. EPA, NREL, Defend Your Drains North Texas & Aqua Ninjas Field Logs**

---

## 30-Second Video Script (Matches `aqua_ninjas_30s_demo.mp4`)
* **[0:00–0:07] Section 1 — Frisco & Trend Detective Leaderboard:**  
  *"Hi, we’re Aqua Ninjas! We built Earth System Trend Detective using 25 years of NASA POWER rainfall data across 25 Texas cities."*
* **[0:07–0:15] Brownsville & Honest Trend Testing:**  
  *"Texas swings between droughts and floods, and cities like Brownsville and Frisco show upward extreme-rain slopes—washing oil and waste down storm drains."*
* **[0:15–0:23] Section 2 — Live NASA MODIS & VIIRS Map:**  
  *"Our watershed map traces every city to the Gulf of Mexico using real NASA MODIS and VIIRS flood-plume satellite imagery."*
* **[0:23–0:30] Sections 3 & 4 — Local Action & Target-Gap Simulator:**  
  *"That’s why we run waste-oil collection drives in Frisco—turning NASA Earth data into real local water protection!"*
