const DEMOS = {
  frisco: {
    file: "data/frisco_trends.json",
    variables: [
      { key: "extreme_rain_days_gt50mm", label: "Extreme Rain Days (>50 mm)", unit: "days/yr" }
    ]
  }
};

const state = {
  city: "frisco",
  variable: "extreme_rain_days_gt50mm",
  showProjection: true,
  cache: {},
  selectMapCity: null
};

async function loadJson(path) {
  if (state.cache[path]) return state.cache[path];
  const res = await fetch(path);
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  const data = await res.json();
  state.cache[path] = data;
  return data;
}

function computeRegressionLine(series, key) {
  const pts = series
    .map((d) => ({ x: d.year, y: d[key] }))
    .filter((p) => p.y !== null && p.y !== undefined);
  const n = pts.length;
  const meanX = pts.reduce((a, p) => a + p.x, 0) / n;
  const meanY = pts.reduce((a, p) => a + p.y, 0) / n;
  const sxx = pts.reduce((a, p) => a + (p.x - meanX) ** 2, 0);
  const sxy = pts.reduce((a, p) => a + (p.x - meanX) * (p.y - meanY), 0);
  const slope = sxx ? sxy / sxx : 0;
  const intercept = meanY - slope * meanX;
  return { pts, slope, intercept };
}

function renderSvgChart(series, key, unit) {
  const container = document.getElementById("chart-container");
  const tooltip = document.getElementById("chart-tooltip");
  const { pts, slope, intercept } = computeRegressionLine(series, key);

  const width = 860;
  const height = 310;
  const pad = { top: 20, right: 24, bottom: 38, left: 56 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const lastObservedYear = pts[pts.length - 1].x;
  const projPts = [];
  if (state.showProjection) {
    for (let yr = lastObservedYear + 1; yr <= lastObservedYear + 25; yr++) {
      const rawVal = intercept + slope * yr;
      projPts.push({ x: yr, y: Number(Math.max(0, rawVal).toFixed(2)) });
    }
  }

  const minX = pts[0].x;
  const maxX = state.showProjection ? projPts[projPts.length - 1].x : lastObservedYear;
  const ys = pts.map((p) => p.y);
  const projYs = projPts.map((p) => p.y);
  const trendYs = pts.map((p) => intercept + slope * p.x);
  const rawMinY = Math.min(...ys, ...trendYs, ...projYs);
  const rawMaxY = Math.max(...ys, ...trendYs, ...projYs);
  const yPad = (rawMaxY - rawMinY) * 0.14 || 1;
  const minY = Math.max(0, rawMinY - yPad);
  const maxY = rawMaxY + yPad;

  const sx = (x) => pad.left + ((x - minX) / (maxX - minX || 1)) * innerW;
  const sy = (y) => pad.top + innerH - ((y - minY) / (maxY - minY || 1)) * innerH;

  const pathD = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
    .join(" ");

  const projPathD = state.showProjection
    ? [{ x: lastObservedYear, y: Math.max(0, intercept + slope * lastObservedYear) }, ...projPts]
        .map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
        .join(" ")
    : "";

  const x1 = sx(minX).toFixed(1);
  const y1 = sy(Math.max(0, intercept + slope * minX)).toFixed(1);
  const x2 = sx(lastObservedYear).toFixed(1);
  const y2 = sy(Math.max(0, intercept + slope * lastObservedYear)).toFixed(1);
  const splitX = sx(lastObservedYear + 0.5).toFixed(1);

  const yTicks = 4;
  let gridHtml = "";
  for (let i = 0; i <= yTicks; i++) {
    const val = minY + ((maxY - minY) * i) / yTicks;
    const py = sy(val).toFixed(1);
    gridHtml += `<line x1="${pad.left}" y1="${py}" x2="${width - pad.right}" y2="${py}" stroke="#1f345d" stroke-dasharray="3 3" />`;
    gridHtml += `<text x="${pad.left - 8}" y="${Number(py) + 4}" text-anchor="end" fill="#9eb3d6" font-size="11">${val.toFixed(1)}</text>`;
  }

  const allYears = [...pts.map((p) => p.x), ...projPts.map((p) => p.x)];
  const xStep = Math.max(1, Math.ceil(allYears.length / 10));
  let xLabelsHtml = "";
  allYears.forEach((yr, idx) => {
    if (idx % xStep === 0 || yr === lastObservedYear || idx === allYears.length - 1) {
      xLabelsHtml += `<text x="${sx(yr).toFixed(1)}" y="${height - 12}" text-anchor="middle" fill="#9eb3d6" font-size="11">${yr}</text>`;
    }
  });

  const circlesHtml = pts
    .map(
      (p) =>
        `<circle class="data-pt" cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="4" fill="#38bdf8" stroke="#071124" stroke-width="1.4" data-year="${p.x}" data-val="${p.y}" data-kind="Observed" />`
    )
    .join("");

  const projCirclesHtml = state.showProjection
    ? projPts
        .map(
          (p) =>
            `<circle class="data-pt" cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="3.5" fill="#071124" stroke="#c084fc" stroke-width="1.8" data-year="${p.x}" data-val="${p.y}" data-kind="Illustrative Slope Continuation" />`
        )
        .join("")
    : "";

  const projOverlayHtml = state.showProjection
    ? `
      <rect x="${splitX}" y="${pad.top}" width="${Math.max(0, width - pad.right - Number(splitX)).toFixed(1)}" height="${innerH}" fill="rgba(192, 132, 252, 0.06)" />
      <line x1="${splitX}" y1="${pad.top}" x2="${splitX}" y2="${pad.top + innerH}" stroke="#64748b" stroke-dasharray="4 4" />
      <text x="${Number(splitX) + 6}" y="${pad.top + 12}" fill="#c084fc" font-size="9.5" font-weight="600">Illustrative Slope Continuation (Not a Forecast)</text>
    `
    : "";

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Extreme rain days trend chart">
      ${projOverlayHtml}
      ${gridHtml}
      ${xLabelsHtml}
      <path d="${pathD}" fill="none" stroke="#38bdf8" stroke-width="2.2" />
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f97316" stroke-width="2.2" stroke-dasharray="6 4" />
      ${state.showProjection ? `<path d="${projPathD}" fill="none" stroke="#c084fc" stroke-width="2.2" stroke-dasharray="5 4" />` : ""}
      ${circlesHtml}
      ${projCirclesHtml}
    </svg>
  `;

  container.querySelectorAll(".data-pt").forEach((el) => {
    el.addEventListener("mouseenter", (e) => {
      const yr = e.target.getAttribute("data-year");
      const val = e.target.getAttribute("data-val");
      const kind = e.target.getAttribute("data-kind");
      tooltip.textContent = `${yr} (${kind}): ${val} ${unit}`;
      tooltip.hidden = false;
    });
    el.addEventListener("mousemove", (e) => {
      const rect = container.getBoundingClientRect();
      tooltip.style.left = `${e.clientX - rect.left + 12}px`;
      tooltip.style.top = `${e.clientY - rect.top + 36}px`;
    });
    el.addEventListener("mouseleave", () => {
      tooltip.hidden = true;
    });
  });
}

async function renderExplorer() {
  const allData = await loadJson("data/texas_cities_trends.json");
  const data = allData.cities[state.city] || allData.cities.frisco;
  const varCfg = { key: "extreme_rain_days_gt50mm", label: "Extreme Rain Days (>50 mm)", unit: "days/yr" };

  const controls = document.getElementById("variable-controls");
  controls.innerHTML = "";
  controls.style.display = "none";

  const trend = data.trends[varCfg.key];
  const sigText = trend.significant_0_05 ? "Statistically Significant (p < 0.05)" : "Not Significant (p >= 0.05)";
  const sign = trend.slope_per_decade > 0 ? "+" : "";

  document.getElementById("kpi-grid").innerHTML = `
    <div class="kpi-card">
      <div class="kpi-label">Selected City</div>
      <div class="kpi-value" style="font-size:1.05rem">${data.location}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Trend Direction</div>
      <div class="kpi-value" style="text-transform:capitalize;color:${trend.direction === "increasing" ? "#f97316" : "#38bdf8"}">${trend.direction}</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Rate per Decade</div>
      <div class="kpi-value">${sign}${trend.slope_per_decade} <span style="font-size:0.8rem;color:#9eb3d6">${varCfg.unit}</span></div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">p-value / R²</div>
      <div class="kpi-value" style="font-size:1.05rem">p = ${trend.p_value} • R² = ${trend.r_squared}</div>
    </div>
  `;

  document.getElementById("chart-title").textContent = state.showProjection
    ? `${data.location} — ${varCfg.label} (${data.years_covered} + Illustrative Slope Continuation)`
    : `${data.location} — ${varCfg.label} (${data.years_covered})`;
  document.getElementById("chart-source").textContent = `Source: ${data.source}`;
  renderSvgChart(data.series, varCfg.key, varCfg.unit);

  const insight = document.getElementById("insight-box");
  insight.innerHTML = `
    <strong>Trend Detective Verdict (${sigText}):</strong>
    Over ${data.years_covered} in <strong>${data.location}</strong>, <strong>${varCfg.label}</strong> shows a
    <strong>${trend.direction}</strong> slope (${sign}${trend.slope_per_decade} ${varCfg.unit} per decade, p = ${trend.p_value}).
    Because Texas cities swing sharply between drought and flood years, a 25-year linear trend does not lock in p &lt; 0.05—any 2026–2050 line shown is an <em>illustrative linear slope continuation, not a climate forecast</em>.
    Even without statistical certainty, <strong>extreme rain spikes still wash waste oil directly into storm drains and rivers</strong>, making local prevention essential every season.
  `;

  renderTrendLeaderboard(allData);
  updatePathwayForCity(data);
  updatePotentialForSelectedCity();
}

function renderTrendLeaderboard(allData) {
  const wrap = document.getElementById("trend-leaderboard");
  if (!wrap) return;
  const key = state.variable;
  const sorted = Object.values(allData.cities).sort(
    (a, b) => a.trends[key].p_value - b.trends[key].p_value
  );

  wrap.innerHTML = `
    <div class="leaderboard-head">
      <h3>25-City Texas Trend Detective Leaderboard (Ranked by Lowest p-value)</h3>
      <span class="muted" style="font-size:0.8rem">Click any city to inspect its NASA POWER trend, watershed path, and local action target</span>
    </div>
    <div class="leaderboard-grid">
      ${sorted
        .map((c, idx) => {
          const t = c.trends[key];
          const sign = t.slope_per_decade > 0 ? "+" : "";
          const color = t.slope_per_decade >= 0 ? "#f97316" : "#38bdf8";
          const active = c.id === state.city ? "active" : "";
          const shortLoc = c.location.replace(" (Aqua Ninjas)", "");
          return `
            <button type="button" class="leaderboard-row ${active}" data-city="${c.id}">
              <span class="leaderboard-city">${idx + 1}. ${shortLoc}</span>
              <span class="leaderboard-meta" style="color:${color}">${sign}${t.slope_per_decade}/dec • p=${t.p_value}</span>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  wrap.querySelectorAll(".leaderboard-row").forEach((btn) => {
    btn.addEventListener("click", () => {
      const cid = btn.getAttribute("data-city");
      if (!cid) return;
      state.city = cid;
      const sel = document.getElementById("city-select");
      if (sel) sel.value = cid;
      renderExplorer();
      if (state.selectMapCity) state.selectMapCity(cid, false);
    });
  });
}

function updatePathwayForCity(cityData) {
  const shortName = cityData.location.replace(" (Aqua Ninjas)", "");
  const basin = cityData.basin || "Texas River Basin";
  const route = cityData.routeText || "";

  const h2 = document.getElementById("pathway-heading");
  if (h2) h2.textContent = `2. Why Now? ${shortName} Runoff Pathway (${basin})`;

  const s1 = document.getElementById("pathway-step-1");
  if (s1) s1.textContent = `Intense rainstorms (>50 mm/day) in ${shortName} generate sudden urban stormwater runoff.`;

  const s3Title = document.getElementById("pathway-step-3-title");
  if (s3Title) s3Title.textContent = basin;

  const s3 = document.getElementById("pathway-step-3");
  if (s3) s3.textContent = `Storm drains empty untreated into ${shortName} creeks and the ${basin} on the way to coastal bays.`;

  const evHead = document.getElementById("evidence-heading");
  if (evHead) evHead.textContent = `Downstream NASA Satellite Evidence (${shortName} → ${basin} → Gulf)`;

  const evIntro = document.getElementById("evidence-intro");
  if (evIntro) {
    evIntro.innerHTML = `<strong>Active Pathway:</strong> ${route}. While no satellite can track a single drop of oil from a ${shortName} street, NASA observations document downstream post-storm impacts:`;
  }
}

async function renderBaseline() {
  const base = await loadJson("data/aqua_ninjas_baseline.json");
  state.baselineData = base;
  document.getElementById("baseline-note").textContent = base.status_note;

  document.getElementById("outreach-list").innerHTML = base.outreach_highlights
    .map((item) => `<li>${item}</li>`)
    .join("");

  if (base.frisco_potential) {
    state.potentialConfig = base.frisco_potential;
    document.getElementById("potential-sources").innerHTML = base.frisco_potential.sources
      .map((s) => `<li>${s}</li>`)
      .join("");
    updatePotentialForSelectedCity();
    const partSlider = document.getElementById("sim-participation");
    if (partSlider) {
      partSlider.addEventListener("input", updatePotentialForSelectedCity);
    }
  }
}

function renderPotentialBarChart(rows) {
  const container = document.getElementById("potential-chart");
  if (!container) return;

  const width = 520;
  const rowH = 34;
  const pad = { top: 8, right: 78, bottom: 8, left: 165 };
  const height = pad.top + pad.bottom + rows.length * rowH;
  const barAreaW = width - pad.left - pad.right;
  const maxVal = Math.max(...rows.map((r) => r.value), 1);

  const barsHtml = rows
    .map((r, i) => {
      const y = pad.top + i * rowH + 6;
      const bw = Math.max(4, (r.value / maxVal) * barAreaW);
      return `
        <text x="${pad.left - 8}" y="${y + 14}" text-anchor="end" fill="#cbd5e1" font-size="11" font-weight="600">${r.label}</text>
        <rect x="${pad.left}" y="${y}" width="${bw.toFixed(1)}" height="18" rx="4" fill="${r.color}" />
        <text x="${(pad.left + bw + 6).toFixed(1)}" y="${y + 13}" fill="#eef4ff" font-size="11" font-weight="700">${r.display}</text>
      `;
    })
    .join("");

  container.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Monthly oil collection statistical comparison">
      ${barsHtml}
    </svg>
  `;
}

async function updatePotentialForSelectedCity() {
  const pot = state.potentialConfig;
  const base = state.baselineData;
  const pctEl = document.getElementById("sim-participation");
  const statsEl = document.getElementById("potential-stats");
  if (!pot || !base || !pctEl || !statsEl) return;

  const allData = await loadJson("data/texas_cities_trends.json");
  const cityData = allData.cities[state.city] || allData.cities.frisco;
  const cityShort = cityData.location.split(",")[0].trim().toLowerCase();
  const households = cityData.households || pot.households;
  const pph = cityData.persons_per_household || 2.7;
  const estPop = Math.round(households * pph);

  const titleEl = document.getElementById("potential-title");
  if (titleEl) {
    titleEl.textContent = `${cityData.location} — Monthly Collection Potential`;
  }
  const hhEl = document.getElementById("val-city-households");
  if (hhEl) hhEl.textContent = households.toLocaleString();

  const pct = Number(pctEl.value);
  document.getElementById("val-participation").textContent = pct;

  const participatingHomes = Math.round(households * (pct / 100));
  const monthlyGal = Math.round(participatingHomes * pot.conservative_gal_per_household_month);
  const annualGal = monthlyGal * 12;
  const onePctGal = Math.round(households * 0.01 * pot.conservative_gal_per_household_month);
  const metroBenchmarkGal = Math.round(
    ((estPop * pot.nrel_uco_lbs_per_person_year) / pot.lbs_per_gallon) / 12
  );

  // Filter pilot drives for the selected city
  const cityDrives = base.oil_collection_drives.filter((d) =>
    d.location.toLowerCase().includes(cityShort)
  );
  const pilotGal = cityDrives.reduce((s, d) => s + d.gallons_collected, 0);
  const pilotHomes = cityDrives.reduce((s, d) => s + d.households_reached, 0);
  const avgPerDrive = cityDrives.length ? (pilotGal / cityDrives.length).toFixed(2) : "0.00";
  const pctOfTarget = monthlyGal > 0 ? ((pilotGal / monthlyGal) * 100).toFixed(2) : "0.00";

  statsEl.innerHTML = `
    <div class="kpi-card"><div class="kpi-label">Participating Homes (${pct}%)</div><div class="kpi-value">${participatingHomes.toLocaleString()}</div></div>
    <div class="kpi-card"><div class="kpi-label">Monthly Potential</div><div class="kpi-value" style="color:#10b981">${monthlyGal.toLocaleString()} gal/mo</div></div>
    <div class="kpi-card"><div class="kpi-label">Annual Potential</div><div class="kpi-value" style="color:#38bdf8">${annualGal.toLocaleString()} gal/yr</div></div>
    <div class="kpi-card"><div class="kpi-label">NREL Metro Benchmark</div><div class="kpi-value" style="font-size:1.05rem">${metroBenchmarkGal.toLocaleString()} gal/mo</div></div>
  `;

  renderPotentialBarChart([
    { label: `Pilot Collected (${cityShort})`, value: pilotGal, display: `${pilotGal} gal`, color: "#f59e0b" },
    { label: "1% Participation Target", value: onePctGal, display: `${onePctGal.toLocaleString()} gal/mo`, color: "#38bdf8" },
    { label: `${pct}% Selected Target`, value: monthlyGal, display: `${monthlyGal.toLocaleString()} gal/mo`, color: "#10b981" },
    { label: "NREL Metro Benchmark", value: metroBenchmarkGal, display: `${metroBenchmarkGal.toLocaleString()} gal/mo`, color: "#a78bfa" }
  ]);

  const pilotHeading = document.getElementById("pilot-city-heading");
  if (pilotHeading) {
    pilotHeading.textContent = `Aqua Ninjas Pilot Drive Statistics — ${cityData.location}`;
  }
  const pilotBadge = document.getElementById("pilot-badge");
  if (pilotBadge) {
    pilotBadge.textContent = `Pilot (${cityData.location.split(",")[0]}): N=${cityDrives.length} Drives`;
  }

  document.getElementById("baseline-stats").innerHTML = `
    <div class="kpi-card"><div class="kpi-label">Pilot Drives Completed</div><div class="kpi-value">${cityDrives.length}</div></div>
    <div class="kpi-card"><div class="kpi-label">Total Oil Collected</div><div class="kpi-value" style="color:#f59e0b">${pilotGal} gal</div></div>
    <div class="kpi-card"><div class="kpi-label">Avg per Drive</div><div class="kpi-value">${avgPerDrive} gal</div></div>
    <div class="kpi-card"><div class="kpi-label">Share of ${pct}% Target</div><div class="kpi-value">${pctOfTarget}%</div></div>
  `;

  const tbody = document.getElementById("drives-tbody");
  if (cityDrives.length) {
    tbody.innerHTML = cityDrives
      .map(
        (d) =>
          `<tr><td>${d.drive_id}</td><td>${d.date}</td><td>${d.location}</td><td><strong>${d.gallons_collected}</strong></td><td>${d.households_reached}</td></tr>`
      )
      .join("");
  } else {
    tbody.innerHTML = `<tr><td colspan="5" class="muted">0 pilot drives logged in ${cityData.location} yet (${pilotHomes} reached) — ready for expansion.</td></tr>`;
  }

  state.currentCityTarget = {
    location: cityData.location,
    monthlyGal,
    pct
  };
  updateSimulator();
}

function updateSimulator() {
  const drivesPerMonth = Number(document.getElementById("sim-drives").value);
  const gallonsPerSite = Number(document.getElementById("sim-gallons").value);

  document.getElementById("val-drives").textContent = drivesPerMonth;
  document.getElementById("val-gallons").textContent = gallonsPerSite;

  const monthlyCapturedGal = drivesPerMonth * gallonsPerSite;
  const annualOilGal = monthlyCapturedGal * 12;

  const target = state.currentCityTarget || { location: "Frisco, TX", monthlyGal: 530, pct: 5 };
  const targetPct = target.monthlyGal > 0 ? Math.min(100, (monthlyCapturedGal / target.monthlyGal) * 100) : 0;
  const rawPct = target.monthlyGal > 0 ? ((monthlyCapturedGal / target.monthlyGal) * 100).toFixed(1) : "0.0";
  const sitesNeeded = Math.max(1, Math.ceil(target.monthlyGal / gallonsPerSite));

  const subEl = document.getElementById("sim-subtitle");
  if (subEl) {
    subEl.textContent = `Simulate how scaling drives and drop-off sites closes the gap toward ${target.location}'s ${target.pct}% target (${target.monthlyGal.toLocaleString()} gal/mo in Section 3):`;
  }
  const progLabel = document.getElementById("target-progress-label");
  if (progLabel) progLabel.textContent = `${rawPct}% of ${target.monthlyGal.toLocaleString()} gal/mo`;
  const progFill = document.getElementById("target-progress-fill");
  if (progFill) progFill.style.width = `${targetPct.toFixed(1)}%`;

  const gapNote = document.getElementById("target-gap-note");
  if (gapNote) {
    gapNote.textContent =
      monthlyCapturedGal >= target.monthlyGal
        ? `Goal met! ${drivesPerMonth} sites/mo at ${gallonsPerSite} gal/site meets 100% of ${target.location}'s ${target.pct}% monthly target.`
        : `To reach 100% of ${target.location}'s ${target.pct}% target (${target.monthlyGal.toLocaleString()} gal/mo) at ${gallonsPerSite} gal/site, you need ~${sitesNeeded} sites/drives per month.`;
  }

  document.getElementById("sim-results").innerHTML = `
    <div class="kpi-card"><div class="kpi-label">Simulated Monthly Oil</div><div class="kpi-value" style="color:#10b981">${monthlyCapturedGal.toLocaleString()} gal/mo</div></div>
    <div class="kpi-card"><div class="kpi-label">Annual Oil Diverted</div><div class="kpi-value" style="color:#38bdf8">${annualOilGal.toLocaleString()} gal/yr</div></div>
    <div class="kpi-card"><div class="kpi-label">EPA FOG Prevention</div><div class="kpi-value" style="font-size:0.9rem;line-height:1.25">Helps stop 47% of sewer clogs</div></div>
  `;
}

async function init() {
  const allData = await loadJson("data/texas_cities_trends.json");
  const citiesList = Object.values(allData.cities);

  const citySelect = document.getElementById("city-select");
  if (citySelect) {
    citySelect.innerHTML = citiesList
      .map((c) => `<option value="${c.id}">${c.location}</option>`)
      .join("");
    citySelect.value = state.city;
    citySelect.addEventListener("change", (e) => {
      state.city = e.target.value;
      renderExplorer();
      if (state.selectMapCity) state.selectMapCity(state.city, false);
    });
  }

  const projToggle = document.getElementById("toggle-projection");
  if (projToggle) {
    projToggle.checked = state.showProjection;
    projToggle.addEventListener("change", (e) => {
      state.showProjection = e.target.checked;
      renderExplorer();
    });
  }

  ["sim-drives", "sim-gallons"].forEach((id) => {
    document.getElementById(id).addEventListener("input", updateSimulator);
  });

  renderExplorer();
  renderBaseline();
  updateSimulator();
  initTexasMap(citiesList);
}

function initTexasMap(citiesList) {
  const mapEl = document.getElementById("texas-map");
  const pillsEl = document.getElementById("city-pills");
  const infoEl = document.getElementById("map-route-info");
  if (!mapEl || typeof L === "undefined") {
    if (infoEl) infoEl.textContent = "Map library unavailable offline; watershed routes remain documented above.";
    return;
  }

  const map = L.map("texas-map", { scrollWheelZoom: false }).setView([29.8, -97.2], 6);
  const esriDarkBase = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ",
    maxZoom: 16
  });
  const esriDarkRef = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 16
  });
  const modis2017 = L.tileLayer(
    "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2017-09-02/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
    {
      attribution: "Imagery &copy; NASA EOSDIS GIBS (MODIS Terra, 2017-09-02)",
      maxZoom: 9
    }
  );
  const viirs2024 = L.tileLayer(
    "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_NOAA20_CorrectedReflectance_TrueColor/default/2024-05-06/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg",
    {
      attribution: "Imagery &copy; NASA EOSDIS GIBS (VIIRS NOAA-20, 2024-05-06)",
      maxZoom: 9
    }
  );

  esriDarkBase.addTo(map);
  esriDarkRef.addTo(map);

  function setMapLayer(layerKey) {
    [esriDarkBase, esriDarkRef, modis2017, viirs2024].forEach((l) => {
      if (map.hasLayer(l)) map.removeLayer(l);
    });
    if (layerKey === "modis2017") {
      modis2017.addTo(map);
      esriDarkRef.addTo(map);
    } else if (layerKey === "viirs2024") {
      viirs2024.addTo(map);
      esriDarkRef.addTo(map);
    } else {
      esriDarkBase.addTo(map);
      esriDarkRef.addTo(map);
    }
    document.querySelectorAll("#layer-pills .city-pill").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-layer") === layerKey);
    });
    document.querySelectorAll("[data-map-layer]").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-map-layer") === layerKey);
    });
  }

  document.querySelectorAll("#layer-pills .city-pill").forEach((btn) => {
    btn.addEventListener("click", () => setMapLayer(btn.getAttribute("data-layer")));
  });
  document.querySelectorAll("[data-map-layer]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setMapLayer(btn.getAttribute("data-map-layer"));
      map.flyTo([29.35, -94.85], 8, { duration: 1.0 });
    });
  });
  const zoomGulfBtn = document.getElementById("btn-zoom-gulf");
  if (zoomGulfBtn) {
    zoomGulfBtn.addEventListener("click", () => {
      setMapLayer("modis2017");
      map.flyTo([29.35, -94.85], 8, { duration: 1.0 });
    });
  }

  const layersById = {};
  let activeId = "frisco";

  function selectCity(id, syncChart = true) {
    activeId = id;
    citiesList.forEach((w) => {
      const isSelected = w.id === id;
      layersById[w.id].line.setStyle({
        weight: isSelected ? 5 : 2.0,
        opacity: isSelected ? 0.95 : 0.35,
        dashArray: isSelected ? null : "5 5"
      });
      layersById[w.id].marker.setStyle({
        radius: isSelected ? 9 : 5.5,
        fillOpacity: isSelected ? 1 : 0.75
      });
      if (isSelected) {
        layersById[w.id].line.bringToFront();
        layersById[w.id].marker.openPopup();
        infoEl.innerHTML = `<strong>${w.location} (${w.basin}):</strong> ${w.routeText}`;
      }
    });
    pillsEl.querySelectorAll(".city-pill").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-city") === id);
    });
    if (syncChart && state.city !== id) {
      state.city = id;
      const citySelect = document.getElementById("city-select");
      if (citySelect) citySelect.value = id;
      renderExplorer();
    }
  }
  state.selectMapCity = selectCity;

  citiesList.forEach((w) => {
    const line = L.polyline(w.coords, {
      color: w.color,
      weight: 2.0,
      opacity: 0.45
    }).addTo(map);

    const marker = L.circleMarker(w.coords[0], {
      radius: 6,
      color: "#ffffff",
      weight: 1.5,
      fillColor: w.color,
      fillOpacity: 0.9
    })
      .addTo(map)
      .bindPopup(`<strong>${w.location}</strong><br/>${w.basin}<br/><small>${w.routeText}</small>`);

    marker.on("click", () => selectCity(w.id));
    line.on("click", () => selectCity(w.id));
    layersById[w.id] = { line, marker };
  });

  // Gulf of Mexico endpoint marker
  L.circleMarker([28.75, -94.6], {
    radius: 10,
    color: "#38bdf8",
    weight: 2,
    fillColor: "#0ea5e9",
    fillOpacity: 0.5
  })
    .addTo(map)
    .bindPopup("<strong>Gulf of Mexico</strong><br/><small>Endpoint of Texas river-basin stormwater outflows</small>");

  pillsEl.innerHTML = citiesList.map(
    (w) => `<button class="city-pill" data-city="${w.id}">${w.location.replace(", TX", "")}</button>`
  ).join("");
  pillsEl.querySelectorAll(".city-pill").forEach((btn) => {
    btn.addEventListener("click", () => selectCity(btn.getAttribute("data-city")));
  });

  selectCity(activeId);
}

document.addEventListener("DOMContentLoaded", init);
