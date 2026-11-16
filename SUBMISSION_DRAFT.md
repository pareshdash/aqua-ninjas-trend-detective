# Space Apps 2026 Submission Draft (For Person 3)

## Project Title
**Earth System Trend Detective: Aqua Ninjas Stormwater & Microplastic Prevention**

## High-Concept Summary (1–2 Sentences)
A student-friendly Earth System Trend Detective that tests whether extreme rainfall events are increasing stormwater runoff risk for local water—featuring **Aqua Ninjas** (Frisco & McKinney, TX) as a real-world community use case connecting NASA data to waste-oil collection drives and microplastic prevention.

## Project Description (Copy & Edit for Space Apps Portal)
### The Problem
Local creeks and lakes in fast-growing North Texas (Frisco, McKinney, Collin & Denton County) face growing pressure from stormwater runoff carrying waste oil, grease, and broken-down plastics through storm drains into creeks, Texas lakes, and ultimately the Gulf of Mexico. Students and community groups need a simple, scientifically honest way to ask: *"Are extreme storm events increasing stormwater runoff risk for our local water?"*

### Our Solution
We built **Earth System Trend Detective**, an interactive water & stormwater runoff trend tool focused on **Frisco, TX (2001–2025)**:
* Uses 25 years of daily NASA POWER precipitation data (`PRECTOTCORR`) to track **Extreme Rain Days (`>50 mm/day`)** and compute linear trends, `p-values`, and `R²`.
* Maps how Texas cities connect through river basins (such as the Trinity River $\rightarrow$ Galveston Bay) to the Gulf of Mexico.
* Pairs Frisco trend analysis with the **Aqua Ninjas** real-world prevention program—waste oil collection drives, door-to-door neighborhood outreach, creek microscope sampling, and pool/water-park plastic capture.

### Scientific Integrity & Findings
* **Honest Satellite Scale:** NASA satellites cannot directly see microplastics inside a narrow neighborhood creek. Instead, Trend Detective tests the *upstream extreme-rainfall driver* of the runoff pathway (`Extreme Rain -> Runoff -> Storm Drains/Creeks -> Texas Lakes -> Gulf`).
* **Honest Trend Results:** Across 2001–2025 in Frisco, extreme rain days (`>50 mm/day`) show an upward slope (`+0.446 days/decade`), while `p = 0.3063` (`R² = 0.0454`) remains above `0.05` due to sharp Texas drought-to-flood swings. Even without a locked-in `p < 0.05` linear trend, extreme storm years still flush oil and plastic into creeks—proving prevention matters every season.
* **Honest Local Baseline:** Our 2 waste-oil drives and creek microscope samples are presented as **Baseline Data** (too few points for trend testing yet), seeding a monthly citizen-science dataset for future trend analysis.

### NASA Data & Tools Used
* **NASA POWER API** (MERRA-2 / GPM-derived daily precipitation `PRECTOTCORR`, 2001–2025)
* **NASA Earth Observatory (MODIS / Landsat)** (Downstream Trinity River $\rightarrow$ Galveston Bay $\rightarrow$ Gulf of Mexico post-storm runoff & sediment plumes)
* **NASA CYGNSS (Level 3 Ocean Microplastics) & PACE / VIIRS** (Coastal river-mouth surfactant/microplastic plume & turbidity context)
* **Aqua Ninjas Field Logs** (Frisco & McKinney waste-oil collection drives & creek microscope counts)

---

## 30-Second Video Script
* **[0:00–0:08] Hook + Real-World Action:** *(Show Aqua Ninjas oil drive / door-to-door photos)*  
  "In Frisco and McKinney, Texas, heavy rain turns into stormwater runoff—washing waste oil and broken-down plastics from our streets into storm drains, creeks, and the Gulf."
* **[0:08–0:20] Live Demo:** *(Screen-record the Frisco Extreme Rain Days (>50 mm) chart and the Texas City-to-Gulf Watershed Map)*  
  "We built **Earth System Trend Detective** using 25 years of NASA POWER data so students can test if extreme storm events are increasing runoff risk. While Texas swings sharply between drought and flood years, extreme rain days are sloping upward—meaning every big storm flushes more pollution."
* **[0:20–0:30] Prevention Impact:** *(Show Aqua Ninjas Baseline + Prevention Simulator sliders)*  
  "That’s why our **Aqua Ninjas** team runs waste-oil collection drives, door-to-door awareness, and creek baseline sampling—turning NASA data into local water protection."
