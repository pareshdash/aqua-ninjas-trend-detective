# Project Summary: Earth System Trend Detective — Aqua Ninjas

**Event:** 2026 NASA International Space Apps Challenge  
**Theme:** *The Next Frontier*  
**Official Challenge:** *Be An Earth System Trend Detective!*  
**Real-World Case Study:** **Aqua Ninjas** (Frisco & McKinney, Collin/Denton County, TX)

---

## 1. Core Project Idea
**Earth System Trend Detective** is a 100% water- and stormwater-focused web application that lets students and communities test whether extreme rainfall conditions are worsening local water pollution risk—featuring **Aqua Ninjas** as the real-world community prevention case study.

Instead of claiming NASA satellites can directly see microplastics inside a narrow neighborhood creek, the project connects **upstream extreme-rain drivers** to **downstream watershed pathways** and **local community action**:
1. **Extreme Rain $\rightarrow$ Urban Runoff:** Intense downpours (`>50 mm/day`) overwhelm soil absorption and wash waste oil, grease, and heat-weakened plastic fragments off streets into storm drains.
2. **Storm Drains $\rightarrow$ Creeks & Lakes $\rightarrow$ Gulf:** Runoff flows untreated through Texas river basins (such as the Trinity River $\rightarrow$ Galveston Bay) into the Gulf of Mexico.
3. **Local Prevention:** Because extreme storm events drive this pathway, **Aqua Ninjas** runs **waste-oil collection drives**, **door-to-door awareness campaigns**, **creek microscope baseline sampling**, and **pool/water-park plastic capture**.

---

## 2. Key Features on the Web App
1. **Focused Extreme Rain Days Trend Chart (Frisco, TX, 2001–2025):**
   * Built from 25 years of real daily **NASA POWER** precipitation data (`PRECTOTCORR`), tracking **Extreme Rain Days (`>50 mm/day`)** with an interactive SVG chart, hover tooltips, regression trendline, `p-value`, and `R²`.
   * **Honest Scientific Finding:** Extreme rain days in Frisco show an upward slope (`+0.446 days/decade`), while `p = 0.3063` (`R² = 0.0454`) remains above `0.05` due to sharp Texas drought-to-flood swings—proving why episodic extreme storms still demand year-round stormwater prevention.
2. **North Texas Runoff Pathway & Downstream NASA Evidence:**
   * Explains the 4-step `Extreme Rain -> Urban Runoff -> Creeks & Lakes -> Gulf of Mexico` pathway.
   * Cites **NASA Earth Observatory (MODIS & Landsat)** post-storm Trinity River $\rightarrow$ Galveston Bay plumes, **NASA CYGNSS (Level 3 Microplastics)** river-mouth surfactant plumes, and **NASA MODIS / VIIRS / PACE** coastal turbidity tracking.
3. **Interactive Texas City-to-Gulf Watershed Map:**
   * Powered by **Leaflet** (with **Esri World Dark Gray** tiles, requiring no API key), allowing users to click **Frisco**, **McKinney**, **Waco**, **Austin**, **San Antonio**, or **Houston** to highlight their schematic river-basin pathways to the Gulf of Mexico.
4. **Aqua Ninjas Local Baseline & Prevention Simulator:**
   * Displays the team's **2 waste-oil collection drives** and **creek microscope counts** honestly as **Baseline Data** (`N=2 drives`, too few points for trend testing yet).
   * Includes an interactive **Prevention & Awareness Simulator** estimating annual oil diverted and plastic captured.

---

## 3. Repository Structure
* **Web App:** `index.html`, `styles.css`, `app.js` (zero external build dependencies)
* **Data & Pipeline:** `scripts/fetch_frisco_nasa_data.py`, `data/frisco_trends.json`, `data/aqua_ninjas_baseline.json`
* **Documentation & Pitch:** `README.md`, `SUBMISSION_DRAFT.md`, `Plan_1_Earth_System_Trend_Detective_PlastiFlux.md`, `PROJECT_SUMMARY.md`
