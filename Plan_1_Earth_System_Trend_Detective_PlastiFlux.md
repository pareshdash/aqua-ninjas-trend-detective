# Project Execution Plan: Earth System Trend Detective — Aqua Ninjas Case Study (Frisco / North Texas)

**Official 2026 Challenge:** *Be An Earth System Trend Detective!*  
**Real-World Use Case:** **Aqua Ninjas** (Frisco, McKinney, Collin & Denton County, TX — waste oil collection drives, door-to-door awareness, and pool/water-park/boat plastic capture)  
**Target Global Awards:** *Local Impact*, *Galactic Impact*, *Best Use of Data*, *Best Use of Science*  
**Submission Deadline:** November 15, 2026, 11:59 PM Local Time  

---

## 1. Executive Summary & Value Proposition

**Core Framing:**  
Build **Earth System Trend Detective** as an accessible tool that students and community groups can use to ask: *"Are environmental conditions getting worse for our local water?"* **Aqua Ninjas** is the real-world use case demonstrating how NASA Earth-system trends justify and guide local prevention.

**The Pathway ("Why Now" Behind Aqua Ninjas):**
1. **Heavier or more frequent rain** increases stormwater runoff.
2. **Runoff washes waste oil, grease, and plastic fragments** off streets and neighborhoods into storm drains.
3. **Storm drains empty into local creeks**, then **Texas lakes**, and ultimately the **Gulf of Mexico**.
4. Therefore, if **precipitation, runoff, or summer heat** in North Texas (Frisco / Collin & Denton County) is trending upward, **local prevention**—waste oil collection drives, door-to-door awareness, and pool/water-park/boat capture—matters more each year.

---

## 2. Scientific Integrity & NASA Open Datasets

> **Crucial Rule for NASA Judges (Honest Science):**
> - **Do NOT claim** NASA satellites can see microplastics in a Frisco creek.
> - **DO use** NASA Earth-system variables to test the *upstream drivers* (rainfall, surface runoff, land surface temperature) and *downstream marine endpoint* (Gulf of Mexico).
> - **Local Field Data Honesty:** Two waste oil drives (gallons collected) and a handful of creek microscope counts are **too few points for a statistical trend test yet**. Chart them clearly as **"Local Baseline & Action Tracker"**—seeding a multi-month dataset for future trend testing.

### Variables & Datasets for Frisco / Collin & Denton County
| Variable | NASA Dataset / Mission | Access Portal | Question It Answers |
| :--- | :--- | :--- | :--- |
| **Precipitation** *(Primary Frisco Demo)* | **GPM IMERG** (Integrated Multi-satellitE Retrievals) | [NASA Giovanni](https://giovanni.gsfc.nasa.gov/) / Earthdata | Is rainfall intensity or heavy-rain frequency increasing in Frisco / Collin-Denton? |
| **Surface Runoff** | **GLDAS** (Global Land Data Assimilation System) | [NASA Giovanni](https://giovanni.gsfc.nasa.gov/) / Earthdata | Is more water running off land surfaces into storm drains and creeks? |
| **Land Surface Temperature** | **MODIS / VIIRS LST** | NASA AppEEARS / Giovanni | Are hotter summers driving more water-park/pool/floaty/tube use and faster plastic breakdown? |
| **Gulf of Mexico Endpoint** *(Optional)* | **CYGNSS** (Level 3 Microplastics) / **PACE** | [NASA PO.DAAC](https://podaac.jpl.nasa.gov/) | What are the downstream marine trends at the end of the Texas watershed pathway? |
| **Local Baseline Data** | **Aqua Ninjas Field Logs** | Local CSV / JSON | Gallons of waste oil collected (2 drives) & creek microscope baseline counts |

---

## 3. MVP Feature Scope (Dual-Demo + Aqua Ninjas Case Study)

1. **Demo 1: Wisconsin Smoke Example** *(Existing/Reference Demo)*
   * Shows the Trend Detective works across different Earth-system domains (air quality/smoke).
2. **Demo 2: Frisco / Collin-Denton Water Risk** *(New Primary Demo for Tonight)*
   * **GPM IMERG Precipitation** trend chart (plus **GLDAS Runoff** and **LST** toggles if time permits).
   * Clear statistical trend readout (slope / direction / "getting worse or stable?").
3. **Aqua Ninjas "Why Now" Pathway & Baseline Panel:**
   * Visual 4-step pathway diagram: `Rain -> Runoff -> Storm Drains & Creeks -> Texas Lakes -> Gulf`.
   * **Baseline Community Impact Chart:** Bar/point chart of **gallons of waste oil collected across 2 drives** + **creek microscope sample counts**, explicitly labeled: *"Baseline Data (N=2 drives) — collecting monthly to enable future trend testing."*
   * Photos/highlights from door-to-door campaigning and oil collection drives in Frisco & McKinney.

---

## 4. Hour-by-Hour Sprint Plan to Submission (Today: Nov 15, 2026)

* **10:45 AM – 12:15 PM | Pull Frisco / Collin-Denton NASA Data**
  * Open **NASA Giovanni** (`giovanni.gsfc.nasa.gov`) and export time-series CSVs for the Frisco / Collin-Denton bounding box (`~33.0°N–33.3°N, 96.9°W–96.5°W`):
    * **GPM IMERG** precipitation (multi-year monthly/seasonal series).
    * *(Optional if fast)* **GLDAS** surface runoff & **MODIS LST**.
  * Format the **Aqua Ninjas** 2-drive oil collection numbers and creek microscope counts into a clean JSON/CSV.
* **12:15 PM – 3:00 PM | Add Frisco Demo to Trend Detective Tool**
  * Wire the Frisco GPM IMERG dataset as **Demo 2** alongside the **Wisconsin Smoke** demo.
  * Ensure the trend test runs cleanly on the Frisco time-series and displays clear units, slope, and interpretation.
* **3:00 PM – 5:30 PM | Build Aqua Ninjas Pathway & Baseline Section**
  * Add the 4-step pathway graphic (`Rain -> Runoff -> Creeks/Lakes -> Gulf`).
  * Add the **Baseline Data** chart (2 oil drives + microscope counts) with the honest scientific note explaining why it is baseline-only for now.
* **5:30 PM – 7:00 PM | Test & Deploy**
  * Verify both **Wisconsin Smoke** and **Frisco Precipitation** demos load fast and reliably.
  * Deploy to a public URL (Vercel / Netlify / Streamlit Cloud / GitHub Pages).
* **7:00 PM – 10:00 PM | Pitch Assets (30-Sec Video + Project Page + GitHub)**
  * **30-Second Video Script:**
    * *0–10s:* Show Aqua Ninjas in Frisco/McKinney (oil drives & door-to-door awareness) + explain the pathway (*"Rain turns into runoff, washing waste oil and broken-down plastic into storm drains, creeks, and the Gulf"*).
    * *10–22s:* Demo the **Trend Detective** tool switching from Wisconsin Smoke to **Frisco Precipitation/Runoff**, showing how students test whether local water conditions are worsening.
    * *22–30s:* Show the **Aqua Ninjas Baseline Tracker** (gallons of oil diverted) + call to action for monthly citizen monitoring.
  * Make the GitHub repo public with a clear `README.md`.
* **10:00 PM – 11:30 PM | Final Submission & Buffer**
  * Submit on `spaceappschallenge.org` under **Be An Earth System Trend Detective!** at least 30 minutes before **11:59 PM local time**.

---

## 5. Submission Checklist (Space Apps Requirements)

- [ ] **Challenge Selected:** *Be An Earth System Trend Detective!*
- [ ] **Project Title & Summary:** Clearly positions the tool as a student-friendly Earth System Trend Detective with **Aqua Ninjas (Frisco/McKinney, TX)** as the real-world prevention case study.
- [ ] **Dual Demos Working:** Wisconsin Smoke + Frisco Precipitation (GPM IMERG).
- [ ] **Scientific Integrity:** Explicitly notes satellites don't see creek microplastics and that 2 oil drives / creek counts are baseline data (not yet trend-tested).
- [ ] **30-Second Video + Public Repo/Demo Link:** Accessible without login walls.
- [ ] **NASA Data Citations:** GPM IMERG (Giovanni), GLDAS, MODIS/VIIRS LST, CYGNSS/PACE (if included), plus Aqua Ninjas field logs.

---

## 6. 3-Person Parallel Execution Plan (Fast-Pace Sprint)

With 3 people working in parallel, you can finish the core build by **5:30 PM** and focus the evening on video recording and submission polish.

### Person 1: Data & Science Lead *(NASA Datasets + Trend Stats)*
* **11:05 AM – 12:30 PM:**
  * Pull 20+ years of **Frisco, TX (`33.1507, -96.8236`)** daily/monthly data from **NASA POWER API** (`PRECTOTCORR` precipitation, `TS`/`T2M` surface/air temp, `GWETTOP` soil wetness).
  * *(Bonus if fast)* Pull **GLDAS surface runoff** or **CYGNSS Gulf of Mexico** summary stats via Giovanni/PO.DAAC.
  * Package **Demo 1 (Wisconsin Smoke)** and **Demo 2 (Frisco Water Risk)** as clean static JSON files.
* **12:30 PM – 2:30 PM:**
  * Run trend tests (linear slope + Mann-Kendall `p-value`) on **Monthly Precipitation**, **Heavy-Rain Days (`> 25 mm/day`)**, and **Summer Land Surface Temp**.
  * Hand off `frisco_trends.json` and `wisconsin_smoke.json` to Person 2.
* **2:30 PM – 5:00 PM:**
  * Verify all chart units, write the **Scientific Validity & Scale Note** (watershed-to-ocean scale + why `N=2` oil drives are baseline-only), and compile exact **NASA Data Citations** for Person 3.

### Person 2: App & Deployment Lead *(UI + Charts + Live Hosting)*
* **11:05 AM – 12:30 PM:**
  * Scaffold the web app (React/Vite or Python/Streamlit) in `d:\src\nasa-app\aqua-ninjas-trend-detective`.
  * Build the layout skeleton with mock JSON: **Demo Switcher (Wisconsin Smoke / Frisco Water Risk)**, **Trend Chart Area**, and **Aqua Ninjas Pathway & Baseline Tab**.
* **12:30 PM – 4:00 PM:**
  * Plug in Person 1's `frisco_trends.json` and `wisconsin_smoke.json`.
  * Plug in Person 3's `aqua_ninjas_baseline.json` (2 oil drives + microscope counts) and 2–4 field photos.
  * Build the visual **4-step pathway** (`Rain -> Runoff -> Storm Drains & Creeks -> Texas Lakes -> Gulf`).
* **4:00 PM – 5:30 PM:**
  * Polish responsive UI, test all interactive toggles, deploy to a **public URL** (Vercel / Netlify / Streamlit Cloud), and push a clean public **GitHub repo + `README.md`**.

### Person 3: Aqua Ninjas Storytelling & Submission Lead *(Field Data + Video + Portal)*
* **11:05 AM – 12:30 PM:**
  * Compile `aqua_ninjas_baseline.json` with exact numbers from your **2 oil collection drives** (dates, Frisco/McKinney locations, gallons collected) and **creek microscope counts**.
  * Select **2–4 high-impact photos** from your oil drives and door-to-door campaigning; hand both to Person 2.
* **12:30 PM – 4:30 PM:**
  * Draft all **Space Apps submission fields** (Title, High-Concept Summary, Problem/Solution, Local Impact, NASA Data Used).
  * Write the **30-second video script** (and optional 4-slide pitch deck).
* **5:30 PM – 8:30 PM:**
  * Record the **30-second demo video** using Person 2's live deployed app + Aqua Ninjas photos.
  * Upload video, finalize the Space Apps project page, and **submit by 9:30–10:00 PM** (2 hours before the 11:59 PM cutoff).

### Sync Checkpoints
* **12:30 PM:** Person 1 & Person 3 drop their JSONs/photos into the repo for Person 2.
* **3:00 PM:** 5-minute check that Frisco trend numbers match the video script.
* **5:30 PM:** **Code Freeze & Live URL Ready** $\rightarrow$ Person 3 records the final video.
