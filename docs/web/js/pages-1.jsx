/* ============================================================
   Sentinel Mesh — Dashboard pages (set 1)
   Project, Performance, HITL, Marimo, Detection, D3FEND
   ============================================================ */

const { useState: useS1, useEffect: useE1, useMemo: useM1, useContext: useC1 } = React;

// Data loading boundary with error handling
function DataBoundary({ dashboardId, children, fallback }) {
  const ctx = useC1(AppCtx);
  const rawData = ctx.getDashboardData(dashboardId);
  const loading = ctx.getDashboardLoading(dashboardId);
  const error = ctx.getDashboardError(dashboardId);
  const retry = () => ctx.retryDashboard(dashboardId);
  const data = rawData?.data || rawData;

  if (loading && !data) {
    return (
      <Page>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
          <div style={{ fontSize: 14, color: "var(--fg-2)" }}>Loading dashboard...</div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)" }}>Fetching from /data/{dashboardId}.json</div>
        </div>
      </Page>
    );
  }

  if (error) {
    return (
      <Page>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, maxWidth: 400, margin: "0 auto" }}>
          <div style={{ fontSize: 14, color: "var(--red)" }}>Error loading dashboard</div>
          <div style={{ fontSize: 11, color: "var(--fg-3)", fontFamily: "var(--font-mono)", textAlign: "center" }}>{error.message}</div>
          <div style={{ fontSize: 10, color: "var(--fg-4)" }}>Last updated: {new Date(error.timestamp).toLocaleTimeString()}</div>
          <button className="btn btn--primary" onClick={retry} style={{ marginTop: 8 }}>Retry</button>
        </div>
      </Page>
    );
  }

  if (!data) {
    return (
      <Page>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16 }}>
          <div style={{ fontSize: 14, color: "var(--fg-2)" }}>No data available</div>
          <button className="btn btn--primary" onClick={retry}>Load data</button>
        </div>
      </Page>
    );
  }

  return children(data);
}

// =================================================================
// 1. PROJECT DASHBOARD — operational hub, real-time
// =================================================================
function ProjectDashboard() {
  const { setDrawerContent, tweaks } = useC1(AppCtx);

  return (
    <DataBoundary dashboardId="dashboard">
      {(D) => <ProjectDashboardContent D={D} setDrawerContent={setDrawerContent} tweaks={tweaks} />}
    </DataBoundary>
  );
}

function ProjectDashboardContent({ D, setDrawerContent, tweaks }) {
  const [feedTick, setFeedTick] = useS1(0);

  useE1(() => {
    const id = setInterval(() => setFeedTick(t => t + 1), 2200);
    return () => clearInterval(id);
  }, []);

  // KPI definitions
  const kpis = [
    { label: "Total Events (24h)",     value: D.metrics.eventsTotal,     suffix: "",  color: "fg",     trend: D.metrics.eventsTrend, delta: "+8.2%", deltaUp: true,  fmt: "num" },
    { label: "Open Investigations",    value: D.metrics.eventsOpen,      suffix: "",  color: "amber",  trend: D.metrics.queueTrend,  delta: "−4.1%", deltaUp: true,  fmt: "num" },
    { label: "Auto-Resolution Rate",   value: D.metrics.autoResolutionRate, suffix: "%", color: "green",  trend: D.metrics.autoResTrend, delta: "+0.18pp", deltaUp: true, fmt: "pct" },
    { label: "HITL Escalations",       value: D.metrics.hitlEscalated,   suffix: "",  color: "violet", trend: D.metrics.queueTrend,  delta: "+12",   deltaUp: false, fmt: "num" },
    { label: "Active Playbooks",       value: D.metrics.activePlaybooks, suffix: "",  color: "fg",     trend: null, delta: "+3 deployed", deltaUp: true,  fmt: "num" },
    { label: "Noise Reduction",        value: D.metrics.noiseReduction,  suffix: "%", color: "pink",   trend: null, delta: "+2.1pp", deltaUp: true, fmt: "pct" },
  ];

  return (
    <Page>
      <PageHeader
        subtitle="Real-time agentic SOC operations — autonomous and HITL throughput across all playbooks, agents, and tenants."
        audience={["secops", "ic", "exec"]}
        owner="SOC-Platform"
        lastUpdated="just now"
        controls={
          <>
            <button className="btn"><Icon name="filter" size={12}/> Customize</button>
            <button className="btn btn--primary"><Icon name="play" size={12}/> Open Console</button>
          </>
        }
      />

      <FilterRail
        severityOpts={["critical", "high", "medium", "low", "info"]}
        domainOpts={["Identity", "Endpoint", "Cloud", "Email", "Network", "Data", "SaaS", "Supply Chain"]}
      />

      {/* KPI Row — Grafana-dense */}
      <div className="grid grid--6" style={{ marginBottom: "var(--pad-3)" }}>
        {kpis.map((k, i) => (
          <Card key={i} title={k.label} subtitle="LIVE" status="live" onClick={() => setDrawerContent({
            title: k.label,
            body: <KPIDrillBody kpi={k}/>
          })} style={{ cursor: "pointer" }}>
            <div className="kpi">
              <div className={`kpi__value kpi__value--${k.color}`}>
                {k.fmt === "pct" ? (k.value).toFixed(2) : formatNum(k.value)}
                {k.suffix && <span className="kpi__value-suffix">{k.suffix}</span>}
              </div>
              <div className={"kpi__delta " + (k.deltaUp ? "kpi__delta--up" : "kpi__delta--down")}>
                {k.deltaUp ? "▲" : "▼"} {k.delta} <span style={{ color: "var(--fg-3)", marginLeft: 4 }}>vs prior 24h</span>
              </div>
              {tweaks.values.showSparklines && k.trend && (
                <div className="kpi__sparkline">
                  <Sparkline data={k.trend}
                             color={k.color === "green" ? "var(--green)" : k.color === "amber" ? "var(--amber)" : k.color === "violet" ? "var(--violet)" : k.color === "pink" ? "var(--pink)" : "var(--signal)"}/>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Top playbooks heat-rows */}
      <div className="grid grid--3" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Top Playbooks by Run Count (24h)" subtitle="HEAT" headerExtra={<span className="mono" style={{ fontSize: 9.5, color: "var(--fg-3)" }}>0 — MAX</span>}>
          <BarRow data={D.ranking.map(p => ({ label: p.name, value: p.runs24h }))} cells={26} palette="fire"/>
        </Card>
        <Card title="Playbooks by Success Rate" subtitle="QUALITY">
          <BarRow data={D.ranking.map(p => ({ label: p.name, value: Math.round(p.successRate * 1000) }))} cells={26} palette="ocean" showValue={false}/>
          <div style={{ marginTop: 6, fontSize: 10, color: "var(--fg-3)", fontFamily: "var(--font-mono)", letterSpacing: "0.06em" }}>
            Range: {(Math.min(...D.ranking.map(p=>p.successRate))*100).toFixed(2)}% — {(Math.max(...D.ranking.map(p=>p.successRate))*100).toFixed(2)}%
          </div>
        </Card>
        <Card title="Playbooks by p95 Latency" subtitle="PERF">
          <BarRow data={D.ranking.map(p => ({ label: p.name, value: p.p95Sec }))} cells={26} palette="spectrum"/>
        </Card>
      </div>

      <div className="section-h">EVENTS</div>
      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Events by Severity" subtitle="DONUT">
          <Donut data={D.eventsBySeverity} centerLabel="EVENTS" centerValue={formatNum(D.eventsBySeverity.reduce((s,d)=>s+d.value,0))}/>
        </Card>
        <Card title="Events by Source" subtitle="DONUT">
          <Donut data={D.eventsBySource.slice(0,5)} centerLabel="SOURCES" centerValue={D.eventsBySource.length}/>
        </Card>
        <Card title="Events Throughput (48h)" subtitle="LIVE" style={{ gridColumn: "span 2" }}>
          <AreaLine data={D.metrics.eventsTrend} color="var(--signal)" height={140} label="events/hr"/>
        </Card>
      </div>

      <div className="section-h">AGENT ACTIVITY</div>
      <div className="grid grid--3" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Agent Actions (24h)" subtitle="STACKED" style={{ gridColumn: "span 2" }}>
          <StackedBar
            data={D.agentActivity.map(d => ({ ...d, label: `${d.hour}h` }))}
            keys={["triage", "enrich", "contain", "escalate"]}
            colors={["var(--signal)", "var(--violet)", "var(--amber)", "var(--red)"]}
            height={200}/>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap", fontSize: 10.5, fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--signal)", marginRight: 4, verticalAlign: "middle", borderRadius: 1 }}/>TRIAGE</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--violet)", marginRight: 4, verticalAlign: "middle", borderRadius: 1 }}/>ENRICH</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--amber)", marginRight: 4, verticalAlign: "middle", borderRadius: 1 }}/>CONTAIN</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--red)", marginRight: 4, verticalAlign: "middle", borderRadius: 1 }}/>ESCALATE</span>
          </div>
        </Card>
        <Card title="Live Activity Feed" subtitle="STREAM" headerExtra={<span className="live-pulse"/>}>
          {tweaks.values.showLiveTicker ? <LiveFeed feed={D.feed} tick={feedTick}/> : <div style={{ color: "var(--fg-3)", fontSize: 11 }}>Live ticker disabled in Tweaks.</div>}
        </Card>
      </div>

      <div className="section-h">INVENTORY</div>
      <div className="grid grid--8">
        {D.inventory.map((t, i) => (
          <TileBlock key={i} label={t.label} value={t.value} color={t.color}/>
        ))}
      </div>
    </Page>
  );
}

function KPIDrillBody({ kpi }) {
  return (
    <>
      <div className="eyebrow" style={{ marginBottom: 8 }}>METRIC DETAIL</div>
      <div className={`kpi__value kpi__value--${kpi.color}`} style={{ fontSize: 56, marginBottom: 12 }}>
        {kpi.fmt === "pct" ? kpi.value.toFixed(2) : formatNum(kpi.value)}
        {kpi.suffix && <span className="kpi__value-suffix">{kpi.suffix}</span>}
      </div>
      {kpi.trend && <div style={{ marginBottom: 16 }}><AreaLine data={kpi.trend} height={180} label="value"/></div>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "p50", value: "4.2 min" }, { label: "p90", value: "8.8 min" },
          { label: "p95", value: "11.4 min" }, { label: "p99", value: "18.6 min" },
        ].map(m => (
          <div key={m.label} style={{ background: "var(--bg-2)", padding: 12, borderRadius: 6, border: "1px solid var(--line-1)" }}>
            <div className="eyebrow">{m.label}</div>
            <div className="mono" style={{ fontSize: 18, color: "var(--fg-0)", marginTop: 4 }}>{m.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function LiveFeed({ feed, tick }) {
  // Rotate items so it feels live
  const offset = tick % feed.length;
  const view = [...feed.slice(offset), ...feed.slice(0, offset)];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, fontSize: 11 }}>
      {view.slice(0, 7).map((e, i) => (
        <div key={i + tick} style={{ display: "grid", gridTemplateColumns: "54px 1fr auto", gap: 8, padding: "6px 0", borderBottom: i === 6 ? "none" : "1px solid var(--line-1)", alignItems: "center", animation: i === 0 ? "fade 0.4s ease" : "none" }}>
          <span className="mono" style={{ color: "var(--fg-3)", fontSize: 10 }}>{e.ts}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{ color: "var(--fg-0)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              <span className="mono" style={{ fontSize: 10, color: "var(--fg-2)" }}>{e.action}</span>
              {" "}
              <span style={{ color: "var(--fg-1)" }}>{e.playbook}</span>
            </div>
            <div className="mono" style={{ fontSize: 10, color: "var(--fg-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {e.target} · {e.agent}
            </div>
          </div>
          <span className={`sev sev--${e.sev}`}>{e.sev}</span>
        </div>
      ))}
    </div>
  );
}

// =================================================================
// 2. PERFORMANCE ANALYTICS
// =================================================================
function PerformancePage() {
  return (
    <DataBoundary dashboardId="performance">
      {(D) => <PerformancePageContent D={D} />}
    </DataBoundary>
  );
}

function PerformancePageContent({ D }) {
  return (
    <Page>
      <PageHeader
        title="Performance Analytics"
        subtitle="MTTD / MTTR, throughput, queue lag, and SLO budget burn across the playbook fleet."
        audience={["exec", "secops"]}
        owner="SOC-Operations"
        lastUpdated="2 min ago"
      />
      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="MTTD" subtitle="P95 · MIN"><div className="kpi"><div className="kpi__value kpi__value--green">38<span className="kpi__value-suffix">sec</span></div><div className="kpi__delta kpi__delta--up">▲ −22% YoY</div><Sparkline data={D.mttd} color="var(--green)"/></div></Card>
        <Card title="MTTR" subtitle="P50 · MIN"><div className="kpi"><div className="kpi__value kpi__value--green">7.2<span className="kpi__value-suffix">min</span></div><div className="kpi__delta kpi__delta--up">▲ −41% YoY</div><Sparkline data={D.mttr} color="var(--green)"/></div></Card>
        <Card title="Auto-Resolution" subtitle="ROLLING"><div className="kpi"><div className="kpi__value kpi__value--violet">99.32<span className="kpi__value-suffix">%</span></div><div className="kpi__delta kpi__delta--up">▲ +1.4pp</div><Sparkline data={D.autoRate} color="var(--violet)"/></div></Card>
        <Card title="SLO Budget Remaining" subtitle="ROLLING 30D"><div className="kpi"><div className="kpi__value kpi__value--amber">{Math.round(D.sloBudget*100)}<span className="kpi__value-suffix">%</span></div><div className="kpi__delta kpi__delta--down">▼ 39% burned</div><div className="bar" style={{marginTop:8}}><div className="bar__fill" style={{width: `${D.sloBudget*100}%`, background:"var(--amber)"}}/></div></div></Card>
      </div>

      <div className="grid grid--2" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Latency Distribution (response time)" subtitle="MIN · 72H">
          <AreaLine data={D.mttr} color="var(--signal)" height={220} label="MTTR (min)"/>
        </Card>
        <Card title="Throughput (events / hr)" subtitle="72H">
          <AreaLine data={D.throughput} color="var(--violet)" height={220} label="events/hr"/>
        </Card>
      </div>

      <div className="grid grid--2">
        <Card title="Percentiles · Response Time" subtitle="MIN">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {[{l:"p50",v:D.p50,c:"var(--green)"},{l:"p90",v:D.p90,c:"var(--signal)"},{l:"p95",v:D.p95,c:"var(--amber)"},{l:"p99",v:D.p99,c:"var(--red)"}].map(p=>(
              <div key={p.l} style={{textAlign:"center"}}>
                <RadialArc value={p.v} max={20} color={p.c} label={p.l.toUpperCase()} sublabel="min"/>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Queue Lag" subtitle="SEC · 72H">
          <AreaLine data={D.queueLag} color="var(--amber)" height={220} label="lag (s)"/>
        </Card>
      </div>
    </Page>
  );
}

// CountLatencyPlot: inline SVG scatter showing role count vs latency
function CountLatencyPlot({ roles, height = 260 }) {
  if (!roles || roles.length === 0) return null;

  const margin = { top: 40, right: 40, bottom: 50, left: 120 };
  const width = 600 - margin.left - margin.right;
  const colors = ["var(--signal)", "var(--green)", "var(--amber)", "var(--red)", "var(--violet)"];

  const countMin = Math.min(...roles.map(r => r.playbook_count));
  const countMax = Math.max(...roles.map(r => r.playbook_count));
  const latencyMin = Math.min(...roles.map(r => r.avg_latency_min));
  const latencyMax = Math.max(...roles.map(r => r.avg_latency_min));

  const countRange = countMax - countMin || 1;
  const latencyRange = latencyMax - latencyMin || 1;
  const scaleX = (v) => ((v - countMin) / countRange) * width;
  const scaleY = (v) => height - ((v - latencyMin) / latencyRange) * height;

  return (
    <svg width="100%" height={height + margin.top + margin.bottom} style={{ display: "block" }}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Grid lines */}
        {[0, 1, 2].map(i => {
          const y = (i / 2) * height;
          return <line key={`grid-${i}`} x1={0} x2={width} y1={y} y2={y} stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />;
        })}

        {/* Bubbles */}
        {roles.map((r, i) => {
          const x = scaleX(r.playbook_count);
          const y = scaleY(r.avg_latency_min);
          const bubbleSize = Math.max(6, Math.min(20, r.bottleneck_score * 8));
          const color = colors[i % colors.length];
          return (
            <g key={r.name}>
              <circle cx={x} cy={y} r={bubbleSize} fill={color} opacity={0.7} />
              <text x={x} y={y + bubbleSize + 12} textAnchor="middle" fontSize={10} fill="var(--fg-2)" style={{ overflow: "hidden", textOverflow: "ellipsis", maxWidth: 40 }}>
                {r.name.slice(0, 12)}
              </text>
            </g>
          );
        })}

        {/* X-axis */}
        <line x1={0} y1={height} x2={width} y2={height} stroke="var(--border)" strokeWidth={1} />
        <text x={width / 2} y={height + 35} textAnchor="middle" fontSize={11} fill="var(--fg-2)">Playbook Count</text>

        {/* Y-axis */}
        <line x1={0} y1={0} x2={0} y2={height} stroke="var(--border)" strokeWidth={1} />
        <text x={-50} y={-10} textAnchor="middle" fontSize={11} fill="var(--fg-2)">Latency (min)</text>
      </g>
    </svg>
  );
}

// =================================================================
// 3. HITL GATE COMPOSITION
// =================================================================
function HITLPage() {
  const { setDrawerContent } = useC1(AppCtx);

  return (
    <DataBoundary dashboardId="hitl">
      {(D) => <HITLPageContent D={D} setDrawerContent={setDrawerContent} />}
    </DataBoundary>
  );
}

function HITLPageContent({ D, setDrawerContent }) {
  // Destructure new data structure: {gates, roles, mcp_tools}
  const gates = D.gates || D;
  const roles = D.roles || [];
  const mcp_tools = D.mcp_tools || [];

  // For sankey: gates → outcomes (auto vs review-approved vs review-denied)
  const left = gates.map((g, i) => ({
    id: g.id, label: g.name, value: g.autoCount + g.reviewCount,
    color: g.tier === "T0" ? "var(--red)" : g.tier === "T1" ? "var(--amber)" : "var(--green)"
  }));
  const totalAuto = gates.reduce((s,g)=>s+g.autoCount,0);
  const totalReview = gates.reduce((s,g)=>s+g.reviewCount,0);
  const totalApproved = gates.reduce((s,g)=>s+Math.round(g.reviewCount * g.approvalRate), 0);
  const totalDenied = totalReview - totalApproved;
  const right = [
    { id: "auto", label: "Auto-executed", value: totalAuto, color: "var(--green)" },
    { id: "approve", label: "Review · Approved", value: totalApproved, color: "var(--signal)" },
    { id: "deny", label: "Review · Denied", value: totalDenied, color: "var(--red)" },
  ];
  const flows = gates.flatMap(g => {
    const approved = Math.round(g.reviewCount * g.approvalRate);
    const denied = g.reviewCount - approved;
    return [
      { from: g.id, to: "auto", value: g.autoCount, color: "var(--green)" },
      { from: g.id, to: "approve", value: approved, color: "var(--signal)" },
      { from: g.id, to: "deny", value: denied, color: "var(--red)" },
    ].filter(f => f.value > 0);
  });

  return (
    <Page>
      <PageHeader
        title="HITL Gate Composition"
        subtitle="Human-in-the-loop checkpoint analytics — which actions require review, latency, approval rate, tier."
        audience={["secops", "ic", "dev"]}
        owner="Governance"
      />
      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Total Gate Decisions"><div className="kpi"><div className="kpi__value kpi__value--fg">{formatNum(totalAuto+totalReview)}</div><div className="kpi__delta">24h</div></div></Card>
        <Card title="Auto-Executed"><div className="kpi"><div className="kpi__value kpi__value--green">{formatNum(totalAuto)}</div><div className="kpi__delta">{((totalAuto/(totalAuto+totalReview))*100).toFixed(1)}% of decisions</div></div></Card>
        <Card title="Human Reviewed"><div className="kpi"><div className="kpi__value kpi__value--violet">{formatNum(totalReview)}</div><div className="kpi__delta">{((totalReview/(totalAuto+totalReview))*100).toFixed(1)}% of decisions</div></div></Card>
        <Card title="Approval Rate"><div className="kpi"><div className="kpi__value kpi__value--green">{((totalApproved/totalReview)*100).toFixed(1)}<span className="kpi__value-suffix">%</span></div><div className="kpi__delta">{totalDenied} denied</div></div></Card>
      </div>

      <div className="grid grid--2" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Top Bottleneck Role">
          {roles.length > 0 && (
            <div className="kpi">
              <div className="kpi__value kpi__value--amber">{roles[0].name}</div>
              <div className="kpi__delta kpi__delta--up">▲ score {roles[0].bottleneck_score}</div>
              <div className="kpi__sparkline"><Sparkline data={roles[0].trend} color="var(--amber)" /></div>
            </div>
          )}
        </Card>
        <Card title="Most Gated MCP Tool">
          {mcp_tools.length > 0 && (
            <div className="kpi">
              <div className="kpi__value kpi__value--violet">{mcp_tools[0].name}</div>
              <div className="kpi__delta">{formatNum(mcp_tools[0].playbook_count)} playbooks</div>
              <div className="kpi__sparkline"><Sparkline data={mcp_tools[0].trend} color="var(--violet)" /></div>
            </div>
          )}
        </Card>
      </div>

      <Card title="Gate → Outcome Flow" subtitle="ROUTING · 24H" style={{ marginBottom: "var(--pad-3)" }}>
        <SankeyLite left={left} right={right} flows={flows} height={420}/>
      </Card>

      <div className="grid grid--2" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Role Bottleneck Score" subtitle="BOTTLENECK LOAD">
          {roles.length > 0 && (
            <BarRow
              data={roles.map(r => ({ label: r.name, value: r.bottleneck_score }))}
              cells={20}
              palette="fire"
              showValue={true}
            />
          )}
        </Card>
        <Card title="Count vs. Latency" subtitle="ROLE LOAD · BUBBLE = SCORE">
          {roles.length > 0 && <CountLatencyPlot roles={roles} height={260} />}
        </Card>
      </div>

      <Card title="Per-Gate Detail" subtitle="DRILL">
        <table className="tbl">
          <thead><tr>
            <th>Gate ID</th><th>Name</th><th>Tier</th><th className="num">Auto</th><th className="num">Review</th><th className="num">Approval</th><th className="num">p95 (min)</th><th></th>
          </tr></thead>
          <tbody>
            {gates.map(g => (
              <tr key={g.id} style={{ cursor: "pointer" }} onClick={() => setDrawerContent({
                title: `${g.id} · ${g.name}`,
                body: <GateDetail gate={g}/>
              })}>
                <td className="mono">{g.id}</td>
                <td>{g.name}</td>
                <td><span className="mono" style={{ color: g.tier === "T0" ? "var(--red)" : g.tier === "T1" ? "var(--amber)" : "var(--green)" }}>{g.tier}</span></td>
                <td className="num">{formatNum(g.autoCount)}</td>
                <td className="num">{formatNum(g.reviewCount)}</td>
                <td className="num">{(g.approvalRate*100).toFixed(1)}%</td>
                <td className="num">{g.p95Min.toFixed(1)}</td>
                <td><Icon name="chev" size={11}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

function GateDetail({ gate }) {
  return (
    <>
      <div className="eyebrow">{gate.tier} · {gate.id}</div>
      <h2 style={{ fontSize: 20, color: "var(--fg-0)", margin: "4px 0 16px" }}>{gate.name}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        <Card title="Approvals (rolling)" menu={false}><div className="kpi__value kpi__value--green" style={{fontSize:34}}>{(gate.approvalRate*100).toFixed(1)}<span className="kpi__value-suffix">%</span></div></Card>
        <Card title="p95 latency" menu={false}><div className="kpi__value kpi__value--amber" style={{fontSize:34}}>{gate.p95Min}<span className="kpi__value-suffix">min</span></div></Card>
      </div>
      <Card title="Recent decisions" menu={false}>
        <table className="tbl">
          <thead><tr><th>Time</th><th>Reviewer</th><th>Decision</th><th>Latency</th></tr></thead>
          <tbody>
            {[
              { t: "10:42:09", r: "k.tan", d: "approve", l: "3.4 min" },
              { t: "10:39:14", r: "j.alvarez", d: "approve", l: "5.1 min" },
              { t: "10:33:02", r: "k.tan", d: "deny", l: "8.8 min" },
              { t: "10:28:41", r: "m.okafor", d: "approve", l: "2.2 min" },
              { t: "10:21:09", r: "j.alvarez", d: "approve", l: "4.0 min" },
            ].map((r,i)=>(
              <tr key={i}><td className="mono">{r.t}</td><td>{r.r}</td><td><span className={`sev sev--${r.d==="approve"?"low":"critical"}`}>{r.d}</span></td><td className="num">{r.l}</td></tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

// =================================================================
// 4. MARIMO COVERAGE
// =================================================================
function MarimoPage() {
  return (
    <DataBoundary dashboardId="marimo">
      {(D) => <MarimoPageContent D={D} />}
    </DataBoundary>
  );
}

function MarimoPageContent({ D }) {
  const total = D.reduce((s,d)=>s+d.playbooks,0);
  const reactive = D.reduce((s,d)=>s+d.reactive,0);
  const advanced = D.reduce((s,d)=>s+d.advanced,0);

  return (
    <Page>
      <PageHeader
        title="Marimo Playbook Coverage"
        subtitle="Reactive notebook adoption across security domains. Heuristic readiness based on automation ratios and HITL composition."
        audience={["dev", "secops"]}
        owner="Detection-Engineering"
      />
      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Total Playbooks"><div className="kpi"><div className="kpi__value kpi__value--fg">{total}</div><div className="kpi__delta">across 8 domains</div></div></Card>
        <Card title="Reactive Adoption"><div className="kpi"><div className="kpi__value kpi__value--violet">{Math.round(reactive/total*100)}<span className="kpi__value-suffix">%</span></div><div className="kpi__delta kpi__delta--up">▲ +14pp QoQ</div></div></Card>
        <Card title="Advanced Reactive"><div className="kpi"><div className="kpi__value kpi__value--signal">{advanced}</div><div className="kpi__delta">{Math.round(advanced/total*100)}% of corpus</div></div></Card>
        <Card title="Heuristic Score (mean)"><div className="kpi"><div className="kpi__value kpi__value--green">{(D.reduce((s,d)=>s+d.score,0)/D.length).toFixed(2)}</div><div className="kpi__delta">readiness index</div></div></Card>
      </div>

      <div className="grid grid--2" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Reactive Score by Domain" subtitle="HEURISTIC">
          <BarRow data={D.map(d => ({ label: d.name, value: Math.round(d.score * 100) }))} cells={28} palette="ocean"/>
        </Card>
        <Card title="Composition · Basic vs Advanced" subtitle="STACK">
          <StackedBar
            data={D.map(d => ({ label: d.name, basic: d.basic, advanced: d.advanced, nonReactive: d.playbooks - d.reactive }))}
            keys={["advanced", "basic", "nonReactive"]}
            colors={["var(--violet)", "var(--signal)", "var(--bg-4)"]}
            height={200}/>
          <div style={{ display: "flex", gap: 12, marginTop: 8, fontSize: 10.5, fontFamily: "var(--font-mono)" }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--violet)", marginRight: 4 }}/>ADVANCED</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--signal)", marginRight: 4 }}/>BASIC</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, background: "var(--bg-4)", marginRight: 4 }}/>NON-REACTIVE</span>
          </div>
        </Card>
      </div>

      <Card title="Per-Domain Readiness" subtitle="DETAIL">
        <table className="tbl">
          <thead><tr><th>Domain</th><th className="num">Playbooks</th><th className="num">Reactive</th><th className="num">Basic</th><th className="num">Advanced</th><th className="num">Score</th><th>Readiness</th></tr></thead>
          <tbody>
            {D.map(d => (
              <tr key={d.name}>
                <td>{d.name}</td>
                <td className="num">{d.playbooks}</td>
                <td className="num">{d.reactive}</td>
                <td className="num">{d.basic}</td>
                <td className="num">{d.advanced}</td>
                <td className="num">{d.score.toFixed(2)}</td>
                <td><div className="bar"><div className="bar__fill" style={{ width: `${d.score*100}%`, background: d.score > 0.8 ? "var(--green)" : d.score > 0.6 ? "var(--amber)" : "var(--red)" }}/></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

// =================================================================
// 5. DETECTION FIDELITY
// =================================================================
function DetectionPage() {
  const { setDrawerContent } = useC1(AppCtx);

  return (
    <DataBoundary dashboardId="detection">
      {(D) => <DetectionPageContent D={D} setDrawerContent={setDrawerContent} />}
    </DataBoundary>
  );
}

function DetectionPageContent({ D, setDrawerContent }) {
  const meanF1 = D.reduce((s,d)=>s+d.f1,0)/D.length;
  const meanPrec = D.reduce((s,d)=>s+d.precision,0)/D.length;
  const meanRec = D.reduce((s,d)=>s+d.recall,0)/D.length;
  const driftHi = D.filter(d => d.driftDays > 14).length;

  return (
    <Page>
      <PageHeader
        title="Detection Fidelity"
        subtitle="Precision, recall, and drift across the detection corpus. Click any rule to inspect its confusion matrix and tune history."
        audience={["secops", "dev", "ic"]}
        owner="Detection-Engineering"
      />
      <div className="grid grid--4" style={{ marginBottom: "var(--pad-3)" }}>
        <Card title="Mean F1"><div className="kpi"><div className="kpi__value kpi__value--green">{meanF1.toFixed(3)}</div><div className="kpi__delta kpi__delta--up">▲ +0.02 QoQ</div></div></Card>
        <Card title="Mean Precision"><div className="kpi"><div className="kpi__value kpi__value--signal">{meanPrec.toFixed(3)}</div><div className="kpi__delta">FP rate {((1-meanPrec)*100).toFixed(1)}%</div></div></Card>
        <Card title="Mean Recall"><div className="kpi"><div className="kpi__value kpi__value--violet">{meanRec.toFixed(3)}</div><div className="kpi__delta">FN rate {((1-meanRec)*100).toFixed(1)}%</div></div></Card>
        <Card title="Drift Risk"><div className="kpi"><div className="kpi__value kpi__value--amber">{driftHi}</div><div className="kpi__delta">rules > 14d untuned</div></div></Card>
      </div>

      <Card title="Detection Rules" subtitle="DETAIL">
        <table className="tbl">
          <thead><tr><th>ID</th><th>Rule</th><th className="num">TP</th><th className="num">FP</th><th className="num">FN</th><th className="num">Precision</th><th className="num">Recall</th><th className="num">F1</th><th className="num">Drift (d)</th><th>Confusion</th></tr></thead>
          <tbody>
            {D.map(d => (
              <tr key={d.id} style={{ cursor: "pointer" }} onClick={() => setDrawerContent({
                title: `${d.id} · ${d.name}`,
                body: <DetectionDetail det={d}/>
              })}>
                <td className="mono">{d.id}</td>
                <td>{d.name}</td>
                <td className="num">{d.tp}</td>
                <td className="num" style={{ color: d.fp > 50 ? "var(--amber)" : "var(--fg-1)" }}>{d.fp}</td>
                <td className="num" style={{ color: d.fn > 10 ? "var(--red)" : "var(--fg-1)" }}>{d.fn}</td>
                <td className="num">{d.precision.toFixed(3)}</td>
                <td className="num">{d.recall.toFixed(3)}</td>
                <td className="num" style={{ color: d.f1 > 0.9 ? "var(--green)" : d.f1 > 0.8 ? "var(--amber)" : "var(--red)" }}>{d.f1.toFixed(3)}</td>
                <td className="num" style={{ color: d.driftDays > 14 ? "var(--amber)" : "var(--fg-2)" }}>{d.driftDays}</td>
                <td><MiniConfusion d={d}/></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}
function MiniConfusion({ d }) {
  const tot = d.tp + d.fp + d.fn;
  return (
    <div style={{ display: "flex", height: 14, width: 90, gap: 1 }}>
      <div style={{ flex: d.tp/tot, background: "var(--green)" }}/>
      <div style={{ flex: d.fp/tot, background: "var(--amber)" }}/>
      <div style={{ flex: d.fn/tot, background: "var(--red)" }}/>
    </div>
  );
}
function DetectionDetail({ det }) {
  return (
    <>
      <div className="eyebrow">{det.id}</div>
      <h2 style={{ fontSize: 20, color: "var(--fg-0)", margin: "4px 0 16px" }}>{det.name}</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
        {[{l:"Precision",v:det.precision,c:"var(--signal)"},{l:"Recall",v:det.recall,c:"var(--violet)"},{l:"F1",v:det.f1,c:"var(--green)"}].map(m => (
          <Card key={m.l} title={m.l} menu={false}>
            <RadialArc value={m.v*100} max={100} color={m.c} label={m.l.toUpperCase()}/>
          </Card>
        ))}
      </div>
      <Card title="Confusion matrix · 24h" menu={false}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr", gap: 6, fontSize: 12 }}>
          <div></div>
          <div className="eyebrow" style={{textAlign:"center"}}>Predicted+</div>
          <div className="eyebrow" style={{textAlign:"center"}}>Predicted−</div>
          <div className="eyebrow" style={{display:"flex",alignItems:"center"}}>Actual+</div>
          <div style={{background:"var(--green)",padding:14,borderRadius:6,textAlign:"center",color:"oklch(15% 0.02 250)",fontFamily:"var(--font-mono)",fontSize:18,fontWeight:600}}>{det.tp}<div style={{fontSize:9}}>TRUE POSITIVE</div></div>
          <div style={{background:"var(--red)",padding:14,borderRadius:6,textAlign:"center",color:"oklch(15% 0.02 250)",fontFamily:"var(--font-mono)",fontSize:18,fontWeight:600}}>{det.fn}<div style={{fontSize:9}}>FALSE NEGATIVE</div></div>
          <div className="eyebrow" style={{display:"flex",alignItems:"center"}}>Actual−</div>
          <div style={{background:"var(--amber)",padding:14,borderRadius:6,textAlign:"center",color:"oklch(15% 0.02 250)",fontFamily:"var(--font-mono)",fontSize:18,fontWeight:600}}>{det.fp}<div style={{fontSize:9}}>FALSE POSITIVE</div></div>
          <div style={{background:"var(--bg-3)",padding:14,borderRadius:6,textAlign:"center",fontFamily:"var(--font-mono)",fontSize:18,color:"var(--fg-2)"}}>—<div style={{fontSize:9}}>TRUE NEGATIVE</div></div>
        </div>
      </Card>
    </>
  );
}

// =================================================================
// 6. D3FEND & CAPEC
// =================================================================
function D3FENDPage() {
  return (
    <DataBoundary dashboardId="d3fend">
      {(D) => <D3FENDPageContent D={D} />}
    </DataBoundary>
  );
}

function D3FENDPageContent({ D }) {
  return (
    <Page>
      <PageHeader
        title="D3FEND & CAPEC"
        subtitle="Defensive countermeasures (D3FEND) mapped to attack patterns (CAPEC). Coverage, gaps, and detection density."
        audience={["secops", "dev"]}
        owner="Threat-Modeling"
      />
      <div className="grid grid--5" style={{ marginBottom: "var(--pad-3)" }}>
        {D.tactics.map(t => (
          <Card key={t.tactic} title={t.tactic} subtitle="D3FEND">
            <RadialArc value={t.coverage*100} max={100}
              color={t.coverage > 0.8 ? "var(--green)" : t.coverage > 0.6 ? "var(--amber)" : "var(--red)"}
              label={`${(t.coverage*100).toFixed(0)}%`} sublabel={`${t.techniques} techniques`}/>
            <div className="mono" style={{fontSize:10,color:"var(--fg-3)",textAlign:"center",marginTop:4}}>
              {t.mappings} mappings
            </div>
          </Card>
        ))}
      </div>

      <Card title="CAPEC Pattern Coverage" subtitle="ATTACK PATTERNS">
        <table className="tbl">
          <thead><tr><th>CAPEC ID</th><th>Pattern</th><th>Severity</th><th className="num">Detections</th><th className="num">Coverage</th><th>Status</th></tr></thead>
          <tbody>
            {D.capec.map((p,i) => (
              <tr key={i}>
                <td className="mono">{p.id}</td>
                <td>{p.name}</td>
                <td><span className={`sev sev--${p.severity}`}>{p.severity}</span></td>
                <td className="num">{p.detections}</td>
                <td className="num">{(p.coverage*100).toFixed(0)}%</td>
                <td><div className="bar" style={{width:120}}><div className="bar__fill" style={{width:`${p.coverage*100}%`, background: p.coverage > 0.8 ? "var(--green)" : p.coverage > 0.5 ? "var(--amber)" : "var(--red)"}}/></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Page>
  );
}

// Register
window.SM_PAGES = window.SM_PAGES || {};
Object.assign(window.SM_PAGES, {
  dashboard:   ProjectDashboard,
  performance: PerformancePage,
  hitl:        HITLPage,
  marimo:      MarimoPage,
  detection:   DetectionPage,
  d3fend:      D3FENDPage,
});
