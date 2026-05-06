/* ============================================================
   Sentinel Mesh — Dashboard pages (set 2)
   Risk, Blast, Compliance, CVE, Threat, Custody
   ============================================================ */

const { useState: useS2, useMemo: useM2, useContext: useC2 } = React;

// Data loading boundary with error handling
function DataBoundary({ dashboardId, children, fallback }) {
  const ctx = useC2(AppCtx);
  const rawData = ctx.getDashboardData(dashboardId);
  const loading = ctx.getDashboardLoading(dashboardId);
  const error = ctx.getDashboardError(dashboardId);
  const retry = () => ctx.retryDashboard(dashboardId);
  const data = rawData?.data || rawData;

  if (loading && !data) {
    return (
      <Page>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 14, color: "var(--fg-2)" }}>
            Loading dashboard...
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Fetching from /data/{dashboardId}.json
          </div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 16,
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          <div style={{ fontSize: 14, color: "var(--red)" }}>
            Error loading dashboard
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
              textAlign: "center",
            }}
          >
            {error.message}
          </div>
          <div style={{ fontSize: 10, color: "var(--fg-4)" }}>
            Last updated: {new Date(error.timestamp).toLocaleTimeString()}
          </div>
          <button
            className="btn btn--primary"
            onClick={retry}
            style={{ marginTop: 8 }}
          >
            Retry
          </button>
        </div>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 14, color: "var(--fg-2)" }}>
            No data available
          </div>
          <button className="btn btn--primary" onClick={retry}>
            Load data
          </button>
        </div>
      </Page>
    );
  }

  return children(data);
}

// =================================================================
// 7. IMPACT & BUSINESS RISK
// =================================================================
function RiskPage() {
  return (
    <DataBoundary dashboardId="risk">
      {(D) => <RiskPageContent D={D} />}
    </DataBoundary>
  );
}

function RiskPageContent({ D }) {
  return (
    <Page>
      <PageHeader
        title="Impact & Business Risk"
        subtitle="Quantitative cyber risk for board reporting — Annualized Loss Expectancy, Value-at-Risk, exposure by business unit, and crown-jewel propagation map."
        audience={["board", "exec"]}
        owner="CISO Office"
      />

      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Annualized Loss Expectancy" subtitle="USD · 95% CI">
          <div className="kpi">
            <div className="kpi__value kpi__value--red">
              ${D.kpis.aleUSD}
              <span className="kpi__value-suffix">M</span>
            </div>
            <div className="kpi__delta kpi__delta--up">▲ −34.6% YoY</div>
          </div>
        </Card>
        <Card title="Value at Risk (1y · p95)" subtitle="USD">
          <div className="kpi">
            <div className="kpi__value kpi__value--amber">
              ${D.kpis.valueAtRisk}
              <span className="kpi__value-suffix">M</span>
            </div>
            <div className="kpi__delta">
              ±{D.kpis.quantitativeUncertainty}% uncertainty
            </div>
          </div>
        </Card>
        <Card title="Loss Prevented (TTM)" subtitle="USD">
          <div className="kpi">
            <div className="kpi__value kpi__value--green">
              ${D.kpis.estimatedLossPrevented}
              <span className="kpi__value-suffix">M</span>
            </div>
            <div className="kpi__delta">
              {D.kpis.incidentsPrevented} incidents averted
            </div>
          </div>
        </Card>
        <Card title="Insurance Premium Δ" subtitle="USD">
          <div className="kpi">
            <div className="kpi__value kpi__value--green">
              −${D.kpis.cyberInsurancePremium}
              <span className="kpi__value-suffix">M</span>
            </div>
            <div className="kpi__delta">renewal savings</div>
          </div>
        </Card>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "1.4fr 1fr",
          marginBottom: "var(--pad-3)",
        }}
      >
        <Card title="Crown-Jewel Risk Flow" subtitle="DEPENDENCIES">
          <div
            style={{
              color: "var(--fg-2)",
              fontSize: 11.5,
              marginBottom: 6,
              maxWidth: 480,
            }}
          >
            The Payments tier maintains{" "}
            <span className="mono" style={{ color: "var(--fg-0)" }}>
              9 critical external dependencies
            </span>
            . Edge weight = inferred risk; node accent = current exposure score.
          </div>
          <NetworkGraph
            center={D.flow.center}
            edges={D.flow.edges}
            height={460}
          />
        </Card>
        <Card title="Risk Heatmap" subtitle="LIKELIHOOD × IMPACT">
          <HeatmapGrid
            rows={D.heatmap.cats}
            cols={D.heatmap.ll}
            values={D.heatmap.cats.map((c) =>
              D.heatmap.ll.map(
                (l) =>
                  D.heatmap.cells.find((x) => x.cat === c && x.like === l).heat,
              ),
            )}
            color="oklch(70% 0.16 25)"
            scaleMax={5}
            cellH={32}
            labelRow="Category"
            labelCol="Likelihood"
          />
          <div
            style={{
              marginTop: 12,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 10,
              color: "var(--fg-3)",
              fontFamily: "var(--font-mono)",
            }}
          >
            <span>LOW</span>
            <div
              style={{
                flex: 1,
                height: 6,
                margin: "0 8px",
                borderRadius: 3,
                background:
                  "linear-gradient(90deg, oklch(30% 0.05 25), oklch(70% 0.18 25))",
              }}
            />
            <span>CRITICAL</span>
          </div>
        </Card>
      </div>

      <Card title="Exposure by Business Unit" subtitle="USD MILLIONS">
        <table className="tbl">
          <thead>
            <tr>
              <th>Business Unit</th>
              <th>Tier</th>
              <th className="num">Revenue $M</th>
              <th className="num">Criticality</th>
              <th className="num">Exposure $M</th>
              <th>Profile</th>
            </tr>
          </thead>
          <tbody>
            {D.businessUnits.map((b) => (
              <tr key={b.name}>
                <td>{b.name}</td>
                <td>
                  <span
                    className="mono"
                    style={{
                      color:
                        b.riskTier === "T0"
                          ? "var(--red)"
                          : b.riskTier === "T1"
                            ? "var(--amber)"
                            : b.riskTier === "T2"
                              ? "var(--signal)"
                              : "var(--fg-2)",
                    }}
                  >
                    {b.riskTier}
                  </span>
                </td>
                <td className="num">${b.revenue.toLocaleString()}</td>
                <td className="num">
                  {"●".repeat(b.criticality)}
                  <span style={{ color: "var(--bg-4)" }}>
                    {"●".repeat(5 - b.criticality)}
                  </span>
                </td>
                <td className="num">${b.exposureUSD.toFixed(1)}</td>
                <td>
                  <div className="bar" style={{ width: 140 }}>
                    <div
                      className="bar__fill"
                      style={{
                        width: `${(b.exposureUSD / 22) * 100}%`,
                        background: "var(--red)",
                      }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

// =================================================================
// 8. BLAST RADIUS
// =================================================================
function BlastPage() {
  return (
    <DataBoundary dashboardId="blast">
      {(D) => <BlastPageContent D={D} />}
    </DataBoundary>
  );
}

function BlastPageContent({ D }) {
  return (
    <Page>
      <PageHeader
        title="Blast Radius"
        subtitle="Propagation containment analysis — what would be touched if a candidate compromise played out without containment, and what policy boundaries would stop it."
        audience={["exec", "secops"]}
        owner="Threat-Modeling"
      />
      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Epicenter">
          <div className="kpi">
            <div className="kpi__value kpi__value--fg" style={{ fontSize: 22 }}>
              {D.epicenter.label}
            </div>
            <div className="kpi__delta">{D.epicenter.note}</div>
          </div>
        </Card>
        <Card title="Contained by Policy">
          <div className="kpi">
            <div className="kpi__value kpi__value--green">
              {D.contained}
              <span className="kpi__value-suffix">%</span>
            </div>
            <div className="kpi__delta">would be auto-isolated</div>
          </div>
        </Card>
        <Card title="Total Reach">
          <div className="kpi">
            <div className="kpi__value kpi__value--amber">
              {D.rings.reduce((s, r) => s + r.count, 0)}
            </div>
            <div className="kpi__delta">assets across 4 rings</div>
          </div>
        </Card>
        <Card title="Policy Boundaries">
          <div className="kpi">
            <div className="kpi__value kpi__value--violet">
              {D.boundedByPolicy}
            </div>
            <div className="kpi__delta">stop propagation</div>
          </div>
        </Card>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "1.3fr 1fr",
          marginBottom: "var(--pad-3)",
        }}
      >
        <Card title="Propagation Map" subtitle="CONCENTRIC">
          <BlastRings epicenter={D.epicenter} rings={D.rings} height={500} />
        </Card>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--pad-3)",
          }}
        >
          {D.rings.map((r, i) => (
            <Card
              key={i}
              title={`Ring ${r.r} · ${r.label}`}
              subtitle={`${r.count} assets`}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {r.examples.map((ex, ei) => (
                  <div
                    key={ei}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11.5,
                    }}
                  >
                    <span
                      className="dot"
                      style={{
                        background: [
                          "var(--red)",
                          "var(--amber)",
                          "var(--signal)",
                          "var(--green)",
                        ][i],
                      }}
                    />
                    <span className="mono" style={{ color: "var(--fg-1)" }}>
                      {ex}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Page>
  );
}

// =================================================================
// 9. COMPLIANCE MATRIX
// =================================================================
function CompliancePage() {
  return (
    <DataBoundary dashboardId="compliance">
      {(D) => <CompliancePageContent D={D} />}
    </DataBoundary>
  );
}

function CompliancePageContent({ D }) {
  const passed = D.matrix.filter((c) => c.status === "pass").length;
  const warn = D.matrix.filter((c) => c.status === "warn").length;
  const fail = D.matrix.filter((c) => c.status === "fail").length;

  return (
    <Page>
      <PageHeader
        title="Compliance Matrix"
        subtitle="Continuous control attestation across 8 frameworks. Every cell maps to evidence in the chain of custody."
        audience={["board", "exec"]}
        owner="GRC"
      />
      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Frameworks Tracked">
          <div className="kpi">
            <div className="kpi__value kpi__value--fg">
              {D.frameworks.length}
            </div>
            <div className="kpi__delta">
              {D.controls.length} control families × {D.frameworks.length}{" "}
              frameworks
            </div>
          </div>
        </Card>
        <Card title="Passing">
          <div className="kpi">
            <div className="kpi__value kpi__value--green">{passed}</div>
            <div className="kpi__delta">
              {Math.round((passed / D.matrix.length) * 100)}% of cells
            </div>
          </div>
        </Card>
        <Card title="Warning">
          <div className="kpi">
            <div className="kpi__value kpi__value--amber">{warn}</div>
            <div className="kpi__delta">remediation in flight</div>
          </div>
        </Card>
        <Card title="Failing">
          <div className="kpi">
            <div className="kpi__value kpi__value--red">{fail}</div>
            <div className="kpi__delta">requires attention</div>
          </div>
        </Card>
      </div>

      <Card
        title="Framework × Control Family"
        subtitle="ATTESTATION GRID"
        style={{ marginBottom: "var(--pad-3)" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `200px repeat(${D.controls.length}, 1fr)`,
            gap: 4,
          }}
        >
          <div></div>
          {D.controls.map((c) => (
            <div
              key={c.id}
              style={{
                fontSize: 9.5,
                color: "var(--fg-3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                textAlign: "center",
                fontFamily: "var(--font-mono)",
                padding: "4px 0",
              }}
            >
              {c.label}
            </div>
          ))}
          {D.frameworks.map((fw) => (
            <React.Fragment key={fw}>
              <div
                style={{
                  fontSize: 11.5,
                  color: "var(--fg-1)",
                  padding: "8px 6px 8px 0",
                  textAlign: "right",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {fw}
              </div>
              {D.controls.map((c) => {
                const cell = D.matrix.find((m) => m.fw === fw && m.ct === c.id);
                const bg =
                  cell.status === "pass"
                    ? "oklch(40% 0.12 155)"
                    : cell.status === "warn"
                      ? "oklch(45% 0.14 75)"
                      : "oklch(40% 0.16 25)";
                return (
                  <div
                    key={c.id}
                    style={{
                      background: bg,
                      borderRadius: 4,
                      padding: "10px 6px",
                      textAlign: "center",
                      color: "oklch(96% 0.04 250)",
                      fontSize: 11,
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>
                      {cell.passed}/{cell.total}
                    </div>
                    <div style={{ fontSize: 9, opacity: 0.8, marginTop: 2 }}>
                      {Math.round((cell.passed / cell.total) * 100)}%
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </Card>

      <div className="grid grid--2">
        <Card title="Evidence Freshness" subtitle="DAYS SINCE COLLECTION">
          <BarRow
            data={D.evidence_freshness.map((ef) => ({
              label: ef.framework,
              value: ef.days,
            }))}
            cells={30}
            palette="ocean"
          />
        </Card>
        <Card title="Controls Trending" subtitle="LAST 30D">
          <table className="tbl">
            <thead>
              <tr>
                <th>Framework</th>
                <th>Δ Pass</th>
                <th>Δ Warn</th>
                <th>Δ Fail</th>
              </tr>
            </thead>
            <tbody>
              {D.trending.map((trend) => (
                <tr key={trend.framework}>
                  <td>{trend.framework}</td>
                  <td className="num" style={{ color: "var(--green)" }}>
                    {trend.pass_delta > 0 ? "+" : ""}{trend.pass_delta}
                  </td>
                  <td className="num" style={{ color: "var(--amber)" }}>
                    {trend.warn_delta > 0 ? "+" : ""}{trend.warn_delta}
                  </td>
                  <td className="num" style={{ color: "var(--red)" }}>
                    {trend.fail_delta > 0 ? "+" : ""}{trend.fail_delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </Page>
  );
}

// =================================================================
// 10. CVE RADAR
// =================================================================
function CVEPage() {
  const { filters, toggleFilter, setDrawerContent } = useC2(AppCtx);

  return (
    <DataBoundary dashboardId="cve">
      {(D) => (
        <CVEPageContent
          D={D}
          filters={filters}
          toggleFilter={toggleFilter}
          setDrawerContent={setDrawerContent}
        />
      )}
    </DataBoundary>
  );
}

function CVEPageContent({ D, filters, toggleFilter, setDrawerContent }) {
  const [sortBy, setSortBy] = useS2("cvss");

  const filtered = useM2(() => {
    let out = D;
    if (filters.severity.length)
      out = out.filter((c) => filters.severity.includes(c.sev));
    return out;
  }, [filters]);

  const sorted = useM2(() => {
    const o = [...filtered];
    o.sort((a, b) =>
      sortBy === "cvss"
        ? b.cvss - a.cvss
        : sortBy === "epss"
          ? b.epss - a.epss
          : b.assets - a.assets,
    );
    return o.slice(0, 30);
  }, [filtered, sortBy]);

  const kev = D.filter((c) => c.kev).length;
  const exploited = D.filter((c) => c.exploited).length;
  const critical = D.filter((c) => c.sev === "critical").length;

  // Bubble plot — CVSS x EPSS
  const W = 1,
    H = 280;

  return (
    <Page>
      <PageHeader
        title="CVE Radar"
        subtitle="Active exploitation risk per CVE. CVSS measures severity, EPSS predicts 30-day exploitation. KEV flags known active exploitation."
        audience={["secops", "ic", "dev"]}
        owner="Vulnerability-Mgmt"
      />
      <FilterRail severityOpts={["critical", "high", "medium", "low"]} />

      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Tracked CVEs">
          <div className="kpi">
            <div className="kpi__value kpi__value--fg">{D.length}</div>
            <div className="kpi__delta">in environment</div>
          </div>
        </Card>
        <Card title="On CISA KEV">
          <div className="kpi">
            <div className="kpi__value kpi__value--red">{kev}</div>
            <div className="kpi__delta">
              {Math.round((kev / D.length) * 100)}% of corpus
            </div>
          </div>
        </Card>
        <Card title="Actively Exploited">
          <div className="kpi">
            <div className="kpi__value kpi__value--amber">{exploited}</div>
            <div className="kpi__delta">EPSS+KEV signal</div>
          </div>
        </Card>
        <Card title="Critical (CVSS ≥9)">
          <div className="kpi">
            <div className="kpi__value kpi__value--violet">{critical}</div>
            <div className="kpi__delta">
              {D.filter((c) => c.sev === "critical" && c.patchAvail).length}{" "}
              patch available
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="CVSS × EPSS Risk Plot"
        subtitle="BUBBLE · SIZE = ASSETS AFFECTED"
        style={{ marginBottom: "var(--pad-3)" }}
      >
        <CVEScatter data={D} />
      </Card>

      <Card
        title="Top CVEs"
        subtitle="SORTED"
        headerExtra={
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { k: "cvss", l: "CVSS" },
              { k: "epss", l: "EPSS" },
              { k: "assets", l: "Assets" },
            ].map((s) => (
              <span
                key={s.k}
                className={"chip" + (sortBy === s.k ? " chip--active" : "")}
                onClick={() => setSortBy(s.k)}
              >
                {s.l}
              </span>
            ))}
          </div>
        }
      >
        <table className="tbl">
          <thead>
            <tr>
              <th>CVE ID</th>
              <th>Product</th>
              <th className="num">CVSS</th>
              <th className="num">EPSS</th>
              <th>Severity</th>
              <th>KEV</th>
              <th className="num">Assets</th>
              <th className="num">Days Exposed</th>
              <th>Patch</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((c) => (
              <tr
                key={c.id}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setDrawerContent({ title: c.id, body: <CVEDetail cve={c} /> })
                }
              >
                <td className="mono">{c.id}</td>
                <td>{c.product}</td>
                <td
                  className="num"
                  style={{
                    color:
                      c.cvss >= 9
                        ? "var(--red)"
                        : c.cvss >= 7
                          ? "var(--amber)"
                          : "var(--fg-1)",
                  }}
                >
                  {c.cvss.toFixed(1)}
                </td>
                <td className="num">{(c.epss * 100).toFixed(1)}%</td>
                <td>
                  <span className={`sev sev--${c.sev}`}>{c.sev}</span>
                </td>
                <td>
                  {c.kev ? (
                    <span
                      className="mono"
                      style={{
                        color: "var(--red)",
                        fontSize: 10,
                        padding: "2px 5px",
                        border: "1px solid var(--red)",
                        borderRadius: 3,
                      }}
                    >
                      KEV
                    </span>
                  ) : (
                    <span style={{ color: "var(--fg-3)" }}>—</span>
                  )}
                </td>
                <td className="num">{c.assets}</td>
                <td
                  className="num"
                  style={{
                    color: c.exposureDays > 30 ? "var(--amber)" : "var(--fg-1)",
                  }}
                >
                  {c.exposureDays}
                </td>
                <td>
                  {c.patchAvail ? (
                    <span style={{ color: "var(--green)" }}>● avail</span>
                  ) : (
                    <span style={{ color: "var(--red)" }}>● none</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

function CVEScatter({ data }) {
  const ref = React.useRef(null);
  const [w, setW] = useS2(800);
  React.useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (ref.current) setW(ref.current.clientWidth);
    });
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  // Add deterministic jitter to separate overlapping points
  const jitteredData = React.useMemo(() => {
    return data.map((c, i) => {
      // Use CVE ID hash for deterministic jitter
      let hash = 0;
      for (let j = 0; j < c.id.length; j++) {
        hash = ((hash << 5) - hash) + c.id.charCodeAt(j);
        hash = hash & hash;
      }
      const seed = Math.sin(hash) * 10000;
      const frac = seed - Math.floor(seed);
      return {
        ...c,
        cvss: c.cvss + (frac - 0.5) * 0.15,
        epss: c.epss + ((frac * 7) % 1 - 0.5) * 0.01,
      };
    });
  }, [data]);
  const h = 320;
  const padL = 40,
    padR = 20,
    padT = 20,
    padB = 30;
  const iw = w - padL - padR,
    ih = h - padT - padB;
  const { show, hide, Tip } = useTooltip();
  return (
    <div ref={ref} style={{ width: "100%", position: "relative" }}>
      {Tip}
      <svg width={w} height={h}>
        {[0, 2, 4, 6, 8, 10].map((t) => (
          <g key={t}>
            <line
              x1={padL + (t / 10) * iw}
              y1={padT}
              x2={padL + (t / 10) * iw}
              y2={padT + ih}
              stroke="var(--bg-4)"
              strokeDasharray="2 4"
            />
            <text
              x={padL + (t / 10) * iw}
              y={h - 8}
              fontSize="9.5"
              textAnchor="middle"
              fill="var(--fg-3)"
            >
              {t}
            </text>
          </g>
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => (
          <g key={t}>
            <line
              x1={padL}
              y1={padT + ih * (1 - t)}
              x2={padL + iw}
              y2={padT + ih * (1 - t)}
              stroke="var(--bg-4)"
              strokeDasharray="2 4"
            />
            <text
              x={padL - 6}
              y={padT + ih * (1 - t) + 3}
              fontSize="9.5"
              textAnchor="end"
              fill="var(--fg-3)"
            >
              {(t * 100).toFixed(0)}%
            </text>
          </g>
        ))}
        {/* danger quadrant */}
        <rect
          x={padL + iw * 0.7}
          y={padT}
          width={iw * 0.3}
          height={ih * 0.7}
          fill="oklch(60% 0.18 25)"
          fillOpacity="0.06"
        />
        <text
          x={padL + iw * 0.85}
          y={padT + 14}
          fontSize="9.5"
          textAnchor="middle"
          fill="var(--red)"
          letterSpacing="0.1em"
        >
          DANGER ZONE
        </text>
        <text
          x={padL + iw / 2}
          y={h - 8 + 0}
          fontSize="9.5"
          textAnchor="middle"
          fill="var(--fg-3)"
          letterSpacing="0.1em"
        >
          CVSS
        </text>
        <text
          x={12}
          y={padT + ih / 2}
          fontSize="9.5"
          textAnchor="middle"
          fill="var(--fg-3)"
          letterSpacing="0.1em"
          transform={`rotate(-90 12 ${padT + ih / 2})`}
        >
          EPSS
        </text>
        {jitteredData.map((c, i) => {
          const x = padL + (c.cvss / 10) * iw;
          const y = padT + ih * (1 - c.epss);
          const r = 3 + Math.sqrt(c.assets) * 0.6;
          const color = c.kev
            ? "var(--red)"
            : c.sev === "critical"
              ? "var(--amber)"
              : c.sev === "high"
                ? "var(--violet)"
                : "var(--signal)";
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={r}
              fill={color}
              fillOpacity="0.5"
              stroke={color}
              strokeWidth="1"
              onMouseEnter={(e) =>
                show(
                  <>
                    <span className="viz-tooltip__label">{c.id}</span>
                    {c.product} · CVSS {c.cvss.toFixed(1)} · EPSS{" "}
                    {(c.epss * 100).toFixed(1)}% · {c.assets} assets
                    {c.kev ? " · KEV" : ""}
                  </>,
                  e,
                )
              }
              onMouseLeave={hide}
            />
          );
        })}
      </svg>
    </div>
  );
}
function CVEDetail({ cve }) {
  return (
    <>
      <div className="eyebrow">VULNERABILITY DETAIL</div>
      <h2
        className="mono"
        style={{ fontSize: 22, color: "var(--fg-0)", margin: "4px 0 16px" }}
      >
        {cve.id}
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Card title="CVSS" menu={false}>
          <div className="kpi__value kpi__value--red" style={{ fontSize: 34 }}>
            {cve.cvss.toFixed(1)}
          </div>
        </Card>
        <Card title="EPSS" menu={false}>
          <div
            className="kpi__value kpi__value--amber"
            style={{ fontSize: 34 }}
          >
            {(cve.epss * 100).toFixed(1)}%
          </div>
        </Card>
      </div>
      <table className="tbl">
        <tbody>
          <tr>
            <td className="eyebrow">PRODUCT</td>
            <td>{cve.product}</td>
          </tr>
          <tr>
            <td className="eyebrow">VECTOR</td>
            <td className="mono">{cve.vector}</td>
          </tr>
          <tr>
            <td className="eyebrow">KEV</td>
            <td>
              {cve.kev ? (
                <span style={{ color: "var(--red)" }}>● Listed</span>
              ) : (
                <span style={{ color: "var(--fg-3)" }}>Not listed</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="eyebrow">EXPLOITED</td>
            <td>
              {cve.exploited ? (
                <span style={{ color: "var(--red)" }}>● Active in wild</span>
              ) : (
                <span style={{ color: "var(--green)" }}>No reports</span>
              )}
            </td>
          </tr>
          <tr>
            <td className="eyebrow">ASSETS AFFECTED</td>
            <td className="mono">{cve.assets}</td>
          </tr>
          <tr>
            <td className="eyebrow">EXPOSED</td>
            <td className="mono">{cve.exposureDays} days</td>
          </tr>
          <tr>
            <td className="eyebrow">PATCH</td>
            <td>
              {cve.patchAvail ? (
                <span style={{ color: "var(--green)" }}>Available</span>
              ) : (
                <span style={{ color: "var(--red)" }}>Pending</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

// =================================================================
// 11. THREAT INTELLIGENCE
// =================================================================
function ThreatPage() {
  const { setDrawerContent } = useC2(AppCtx);

  return (
    <DataBoundary dashboardId="threat">
      {(D) => <ThreatPageContent D={D} setDrawerContent={setDrawerContent} />}
    </DataBoundary>
  );
}

function ThreatPageContent({ D, setDrawerContent }) {
  return (
    <Page>
      <PageHeader
        title="Threat Intelligence"
        subtitle="VERIS taxonomies and tracked threat-actor profiles. Mapped to active campaigns and detection coverage."
        audience={["secops", "exec"]}
        owner="Threat-Intel"
      />

      <div className="section-h">
        VERIS A4 · ACTOR · ACTION · ASSET · ATTRIBUTE
      </div>
      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        {D.veris.map((v, i) => {
          const entries = Object.entries(v).filter(([k]) => k !== "axis");
          const total = entries.reduce((s, [, vv]) => s + vv, 0);
          const colors = [
            "oklch(74% 0.15 220)",
            "oklch(78% 0.16 75)",
            "oklch(70% 0.16 290)",
            "oklch(74% 0.14 155)",
            "oklch(66% 0.19 25)",
            "oklch(72% 0.17 0)",
          ];
          const data = entries.map(([k, vv], j) => ({
            label: k.toUpperCase(),
            value: vv,
            color: colors[j % colors.length],
          }));
          return (
            <Card key={i} title={v.axis} subtitle="A4">
              <Donut
                data={data}
                centerLabel={v.axis.toUpperCase()}
                centerValue={total + "%"}
                size={120}
                thickness={18}
              />
            </Card>
          );
        })}
      </div>

      <div className="section-h">TRACKED ACTORS</div>
      <div className="grid grid--3">
        {D.actors.map((a) => (
          <Card
            key={a.id}
            title={a.alias}
            subtitle={a.id}
            onClick={() =>
              setDrawerContent({
                title: `${a.alias} · ${a.id}`,
                body: <ActorDetail actor={a} />,
              })
            }
            style={{ cursor: "pointer" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 36 }}>{a.origin}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="eyebrow">MOTIVE</div>
                <div style={{ fontSize: 13, color: "var(--fg-0)" }}>
                  {a.motive}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="eyebrow">THREAT</div>
                <div
                  className="mono"
                  style={{ fontSize: 22, color: a.color, fontWeight: 600 }}
                >
                  {a.threat}
                </div>
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                fontSize: 11,
              }}
            >
              <div>
                <span className="eyebrow">TTPs</span>
                <div
                  className="mono"
                  style={{ color: "var(--fg-0)", fontSize: 14 }}
                >
                  {a.ttps}
                </div>
              </div>
              <div>
                <span className="eyebrow">CAMPAIGNS</span>
                <div
                  className="mono"
                  style={{ color: "var(--fg-0)", fontSize: 14 }}
                >
                  {a.campaigns}
                </div>
              </div>
            </div>
            <div className="bar" style={{ marginTop: 10 }}>
              <div
                className="bar__fill"
                style={{ width: `${a.threat}%`, background: a.color }}
              />
            </div>
          </Card>
        ))}
      </div>
    </Page>
  );
}

function ActorDetail({ actor }) {
  return (
    <>
      <div className="eyebrow">ACTOR PROFILE</div>
      <h2 style={{ fontSize: 22, color: "var(--fg-0)", margin: "4px 0 4px" }}>
        {actor.alias}
      </h2>
      <div className="mono" style={{ color: "var(--fg-3)", marginBottom: 16 }}>
        {actor.id} · {actor.origin}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Card title="Threat Score" menu={false}>
          <div className="kpi__value kpi__value--red" style={{ fontSize: 40 }}>
            {actor.threat}
            <span className="kpi__value-suffix">/100</span>
          </div>
        </Card>
        <Card title="Active Campaigns" menu={false}>
          <div
            className="kpi__value kpi__value--violet"
            style={{ fontSize: 40 }}
          >
            {actor.campaigns}
          </div>
        </Card>
      </div>
      <Card title="Recent campaigns" menu={false}>
        <table className="tbl">
          <thead>
            <tr>
              <th>Campaign</th>
              <th>First Seen</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {[
              { c: "OP-TWILIGHT-FORK", f: "2026-03-12", s: "active" },
              { c: "ARID-VAULT-2", f: "2026-02-04", s: "active" },
              { c: "HOLLOW-MERIDIAN", f: "2025-11-22", s: "dormant" },
              { c: "LATTICE-PIVOT", f: "2025-08-09", s: "concluded" },
            ].map((r, i) => (
              <tr key={i}>
                <td className="mono">{r.c}</td>
                <td className="mono">{r.f}</td>
                <td>
                  <span
                    className={`sev sev--${r.s === "active" ? "critical" : r.s === "dormant" ? "medium" : "info"}`}
                  >
                    {r.s}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// =================================================================
// 12. CHAIN OF CUSTODY
// =================================================================
function CustodyPage() {
  return (
    <DataBoundary dashboardId="custody">
      {(D) => <CustodyPageContent D={D} />}
    </DataBoundary>
  );
}

function CustodyPageContent({ D }) {
  return (
    <Page>
      <PageHeader
        title="Chain of Custody"
        subtitle="Cryptographically signed audit trail. Every artifact, every action, every signer — verifiable end-to-end."
        audience={["board", "exec", "secops"]}
        owner="Forensics"
      />

      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Verified Today">
          <div className="kpi">
            <div className="kpi__value kpi__value--green">{D.length}</div>
            <div className="kpi__delta">99.9% sig-valid</div>
          </div>
        </Card>
        <Card title="Merkle Root">
          <div className="kpi">
            <div
              className="kpi__value kpi__value--fg"
              style={{ fontSize: 18, fontFamily: "var(--font-mono)" }}
            >
              4a7e…c2f1
            </div>
            <div className="kpi__delta">blk-142847 · sealed 12min ago</div>
          </div>
        </Card>
        <Card title="Signers Active">
          <div className="kpi">
            <div className="kpi__value kpi__value--violet">12</div>
            <div className="kpi__delta">5 agents · 4 humans · 3 HSM</div>
          </div>
        </Card>
        <Card title="Tamper Events">
          <div className="kpi">
            <div className="kpi__value kpi__value--green">0</div>
            <div className="kpi__delta">last 90 days</div>
          </div>
        </Card>
      </div>

      <Card
        title="Custody Timeline · evt-184232"
        subtitle="VERIFIABLE TRAIL"
        style={{ marginBottom: "var(--pad-3)" }}
      >
        <div style={{ position: "relative", paddingLeft: 24 }}>
          <div
            style={{
              position: "absolute",
              left: 7,
              top: 8,
              bottom: 8,
              width: 1,
              background: "var(--bg-4)",
            }}
          />
          {D.slice(-8).map((e, i) => {
            const isHuman = e.actor.startsWith("human:");
            const isSystem = e.actor === "system";
            const color = isHuman
              ? "var(--violet)"
              : isSystem
                ? "var(--amber)"
                : "var(--signal)";
            return (
              <div key={i} style={{ position: "relative", paddingBottom: 14 }}>
                <div
                  style={{
                    position: "absolute",
                    left: -22,
                    top: 4,
                    width: 14,
                    height: 14,
                    borderRadius: "50%",
                    background: color,
                    border: "3px solid var(--bg-2)",
                    boxShadow: `0 0 0 1px ${color}`,
                  }}
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "180px 1fr 200px",
                    gap: 12,
                    alignItems: "center",
                  }}
                >
                  <span
                    className="mono"
                    style={{ fontSize: 10.5, color: "var(--fg-3)" }}
                  >
                    {e.ts}
                  </span>
                  <div>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        className="mono"
                        style={{
                          fontSize: 10.5,
                          color,
                          padding: "2px 6px",
                          border: `1px solid ${color}`,
                          borderRadius: 3,
                          letterSpacing: "0.05em",
                        }}
                      >
                        {e.action}
                      </span>
                      <span style={{ color: "var(--fg-1)", fontSize: 12 }}>
                        {e.actor}
                      </span>
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: 10.5,
                        color: "var(--fg-3)",
                        marginTop: 4,
                      }}
                    >
                      artifact: {e.artifact} · sha256: {e.hash}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: 2,
                    }}
                  >
                    <span
                      className="mono"
                      style={{ fontSize: 10, color: "var(--fg-2)" }}
                    >
                      {e.signer}
                    </span>
                    {e.verified && (
                      <span
                        className="mono"
                        style={{
                          fontSize: 9.5,
                          color: "var(--green)",
                          letterSpacing: "0.08em",
                        }}
                      >
                        ✓ SIG VERIFIED
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <div className="grid grid--2">
        <Card title="Signature Algorithm Mix" subtitle="DISTRIBUTION">
          <Donut
            data={[
              { label: "KMS HSM", value: 2765, color: "var(--green)" },
              { label: "Ed25519 · agent", value: 3006, color: "var(--signal)" },
              { label: "YubiKey · human", value: 1786, color: "var(--violet)" },
              { label: "Merkle root", value: 690, color: "var(--amber)" },
            ]}
            centerLabel="SIGS · 24H"
            centerValue="8.2K"
          />
        </Card>
        <Card title="Verification Latency" subtitle="MS">
          <AreaLine
            data={Array.from({ length: 48 }, (_, i) => ({
              t: Date.now() - (47 - i) * 3600000,
              v: 1.4 + Math.sin(i * 0.3) * 0.4 + Math.random() * 0.3,
            }))}
            color="var(--green)"
            height={200}
            label="ms"
          />
        </Card>
      </div>
    </Page>
  );
}

// Register
window.SM_PAGES = window.SM_PAGES || {};
Object.assign(window.SM_PAGES, {
  risk: RiskPage,
  blast: BlastPage,
  compliance: CompliancePage,
  cve: CVEPage,
  threat: ThreatPage,
  custody: CustodyPage,
});
