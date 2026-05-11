/* ============================================================
   Sentinel Mesh — App shell
   Hash router, left nav, topbar, cmd-k, time picker, drill drawer,
   tweaks panel wiring.
   ============================================================ */

const { useState, useEffect, useMemo, useRef, useCallback } = React;

// ---------- Routes registry ----------
const ROUTES = [
  { id: "dashboard",         path: "#/dashboard",         label: "Project Dashboard",     group: "Operations",  audience: ["secops","ic"],          icon: "grid",     desc: "Real-time Sentinel Mesh operations" },
  { id: "performance",       path: "#/performance",       label: "Performance Analytics", group: "Operations",  audience: ["exec","secops"],         icon: "trend",    desc: "Throughput, MTTD/MTTR, SLO budget" },
  { id: "hitl",              path: "#/hitl",              label: "HITL Gate Composition", group: "Operations",  audience: ["secops","ic","dev"],     icon: "users",    desc: "Human-in-the-loop checkpoint analytics" },
  { id: "marimo",            path: "#/marimo",            label: "Marimo Coverage",       group: "Engineering", audience: ["dev","secops"],          icon: "notebook", desc: "Reactive notebook adoption" },
  { id: "detection",         path: "#/detection",         label: "Detection Fidelity",    group: "Engineering", audience: ["secops","dev"],          icon: "target",   desc: "Precision / recall / drift per detection" },
  { id: "d3fend",            path: "#/d3fend",            label: "D3FEND & CAPEC",        group: "Engineering", audience: ["secops","dev"],          icon: "shield2",  desc: "Defensive countermeasure mapping" },
  { id: "tame",              path: "#/tame",              label: "TAME Behavioral Eval",  group: "Engineering", audience: ["secops","dev"],          icon: "tame",     desc: "Target / Agency / Memory / Embodiment scoring" },
  { id: "risk",              path: "#/risk",              label: "Impact & Business Risk",group: "Strategy",    audience: ["board","exec"],          icon: "scale",    desc: "Quantitative risk for board reporting" },
  { id: "blast",             path: "#/blast",             label: "Blast Radius",          group: "Strategy",    audience: ["exec","secops"],         icon: "radial",   desc: "Propagation containment analysis" },
  { id: "compliance",        path: "#/compliance",        label: "Compliance Matrix",     group: "Strategy",    audience: ["board","exec"],          icon: "check2",   desc: "NIST, ISO, SOC 2, PCI, HIPAA, GDPR, DORA" },
  { id: "cve",               path: "#/cve",               label: "CVE Radar",             group: "Intelligence",audience: ["secops","ic","dev"],     icon: "bug",      desc: "Active exploitation risk per CVE" },
  { id: "threat",            path: "#/threat",            label: "Threat Intelligence",   group: "Intelligence",audience: ["secops","exec"],         icon: "globe",    desc: "VERIS taxonomies and actor profiles" },
  { id: "custody",           path: "#/custody",           label: "Chain of Custody",      group: "Intelligence",audience: ["board","exec","secops"], icon: "lock",     desc: "Cryptographic audit trail" },
];

// ---------- Icons (inline SVG, original geometric set) ----------
const Icon = ({ name, size = 14 }) => {
  const s = size;
  const stroke = "currentColor";
  const sw = 1.5;
  const common = { width: s, height: s, viewBox: "0 0 16 16", fill: "none", stroke, strokeWidth: sw, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case "grid":     return <svg {...common}><rect x="2" y="2" width="5" height="5" rx="1"/><rect x="9" y="2" width="5" height="5" rx="1"/><rect x="2" y="9" width="5" height="5" rx="1"/><rect x="9" y="9" width="5" height="5" rx="1"/></svg>;
    case "trend":    return <svg {...common}><path d="M2 12 L6 8 L9 10 L14 4"/><path d="M14 4 L11 4 M14 4 L14 7"/></svg>;
    case "users":    return <svg {...common}><circle cx="6" cy="6" r="2.2"/><path d="M2 13 C2 11 4 10 6 10 C8 10 10 11 10 13"/><circle cx="11.5" cy="6.5" r="1.6"/><path d="M9 13 C9 11.5 10.5 10.5 12 10.5 C13.4 10.5 14.5 11.4 14.5 12.6"/></svg>;
    case "notebook":return <svg {...common}><rect x="3" y="2" width="10" height="12" rx="1"/><path d="M3 5 L13 5 M6 8 L10 8 M6 11 L10 11"/></svg>;
    case "target":   return <svg {...common}><circle cx="8" cy="8" r="6"/><circle cx="8" cy="8" r="3"/><circle cx="8" cy="8" r="0.8" fill={stroke}/></svg>;
    case "shield2":  return <svg {...common}><path d="M8 2 L13 4 V8 C13 11 10 13 8 14 C6 13 3 11 3 8 V4 Z"/><path d="M6 8 L7.5 9.5 L10 7"/></svg>;
    case "scale":    return <svg {...common}><path d="M8 2 V14"/><path d="M3 6 L8 4 L13 6"/><path d="M5 10 L3 6 L1 10 A2 2 0 0 0 5 10"/><path d="M15 10 L13 6 L11 10 A2 2 0 0 0 15 10"/></svg>;
    case "radial":   return <svg {...common}><circle cx="8" cy="8" r="2"/><circle cx="8" cy="8" r="5" strokeDasharray="2 2"/><circle cx="8" cy="8" r="0.7" fill={stroke}/></svg>;
    case "check2":   return <svg {...common}><rect x="2.5" y="2.5" width="11" height="11" rx="1"/><path d="M5 8 L7 10 L11 6"/></svg>;
    case "bug":      return <svg {...common}><rect x="5" y="5" width="6" height="8" rx="3"/><path d="M5 9 L3 9 M11 9 L13 9 M5 6 L3 4 M11 6 L13 4 M5 12 L3 14 M11 12 L13 14"/></svg>;
    case "globe":    return <svg {...common}><circle cx="8" cy="8" r="6"/><path d="M2 8 H14 M8 2 C10 5 10 11 8 14 C6 11 6 5 8 2"/></svg>;
    case "lock":     return <svg {...common}><rect x="3" y="7" width="10" height="7" rx="1"/><path d="M5 7 V5 A3 3 0 0 1 11 5 V7"/></svg>;
    case "tame":     return <svg {...common}><circle cx="8" cy="8" r="2"/><circle cx="3.5" cy="3.5" r="1.4"/><circle cx="12.5" cy="3.5" r="1.4"/><circle cx="3.5" cy="12.5" r="1.4"/><circle cx="12.5" cy="12.5" r="1.4"/><path d="M8 8 L3.5 3.5 M8 8 L12.5 3.5 M8 8 L3.5 12.5 M8 8 L12.5 12.5"/></svg>;
    case "search":   return <svg {...common}><circle cx="7" cy="7" r="4.5"/><path d="M11 11 L14 14"/></svg>;
    case "filter":   return <svg {...common}><path d="M2 3 H14 L10 8 V13 L6 11 V8 Z"/></svg>;
    case "share":    return <svg {...common}><circle cx="4" cy="8" r="2"/><circle cx="12" cy="4" r="2"/><circle cx="12" cy="12" r="2"/><path d="M6 7 L10 5 M6 9 L10 11"/></svg>;
    case "refresh":  return <svg {...common}><path d="M14 8 A6 6 0 1 1 11 3 L14 3 M14 3 V6"/></svg>;
    case "settings": return <svg {...common}><circle cx="8" cy="8" r="2"/><path d="M8 1 V3 M8 13 V15 M3 8 H1 M15 8 H13 M4 4 L2.5 2.5 M13.5 13.5 L12 12 M4 12 L2.5 13.5 M13.5 2.5 L12 4"/></svg>;
    case "chev":     return <svg {...common}><path d="M5 3 L10 8 L5 13"/></svg>;
    case "x":        return <svg {...common}><path d="M3 3 L13 13 M13 3 L3 13"/></svg>;
    case "play":     return <svg {...common}><path d="M5 3 L13 8 L5 13 Z" fill={stroke}/></svg>;
    case "dot":      return <svg {...common}><circle cx="8" cy="8" r="2" fill={stroke}/></svg>;
    default: return <svg {...common}><rect x="3" y="3" width="10" height="10" rx="2"/></svg>;
  }
};

// ---------- Brand mark ----------
const BrandMark = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="3" fill="oklch(74% 0.15 220)"/>
    <circle cx="12" cy="12" r="3" stroke="oklch(74% 0.15 220)" strokeOpacity="0.4" strokeWidth="1">
      <animate attributeName="r" from="3" to="11" dur="2.4s" repeatCount="indefinite"/>
      <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2.4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="4" cy="12" r="1.4" fill="oklch(70% 0.16 290)"/>
    <circle cx="20" cy="12" r="1.4" fill="oklch(74% 0.14 155)"/>
    <circle cx="12" cy="4" r="1.4" fill="oklch(78% 0.16 75)"/>
    <circle cx="12" cy="20" r="1.4" fill="oklch(66% 0.19 25)"/>
    <line x1="12" y1="12" x2="4" y2="12" stroke="oklch(40% 0.04 250)" strokeWidth="0.6"/>
    <line x1="12" y1="12" x2="20" y2="12" stroke="oklch(40% 0.04 250)" strokeWidth="0.6"/>
    <line x1="12" y1="12" x2="12" y2="4" stroke="oklch(40% 0.04 250)" strokeWidth="0.6"/>
    <line x1="12" y1="12" x2="12" y2="20" stroke="oklch(40% 0.04 250)" strokeWidth="0.6"/>
  </svg>
);

// ---------- Hash router ----------
function useHashRoute() {
  const [hash, setHash] = useState(() => window.location.hash || "#/dashboard");
  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#/dashboard");
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "#/dashboard";
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const route = ROUTES.find(r => r.path === hash) || ROUTES[0];
  const navigate = (path) => { window.location.hash = path; };
  return { route, navigate };
}

// ---------- Global app context ----------
const AppCtx = React.createContext(null);

function AppProvider({ children }) {
  const [timeRange, setTimeRange] = useState("24h");
  const [filters, setFilters] = useState({ severity: [], domain: [], tier: [] });
  const [drawerContent, setDrawerContent] = useState(null);
  const [cmdkOpen, setCmdkOpen] = useState(false);
  const [dataRefresh, setDataRefresh] = useState(0);
  const tweaks = useTweaks(TWEAK_DEFAULTS);

  // listen for data updates from polling
  useEffect(() => {
    const onDataUpdated = (event) => {
      setDataRefresh(r => r + 1);
    };
    window.addEventListener('dashboardDataUpdated', onDataUpdated);
    return () => window.removeEventListener('dashboardDataUpdated', onDataUpdated);
  }, []);

  // apply theme/density
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tweaks.values.theme);
    document.documentElement.setAttribute("data-density", tweaks.values.density);
  }, [tweaks.values.theme, tweaks.values.density]);

  // cmd-k shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCmdkOpen(o => !o);
      }
      if (e.key === "Escape") {
        setCmdkOpen(false);
        setDrawerContent(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleFilter = (cat, val) => {
    setFilters(f => {
      const cur = f[cat] || [];
      return { ...f, [cat]: cur.includes(val) ? cur.filter(v => v !== val) : [...cur, val] };
    });
  };

  const getDashboardData = (dashboardId) => {
    return window.SM_DATA?.[dashboardId] || null;
  };

  const getDashboardLoading = (dashboardId) => {
    return window.SM_DATA_LOADING?.[dashboardId] || false;
  };

  const getDashboardError = (dashboardId) => {
    return window.SM_DATA_ERRORS?.[dashboardId] || null;
  };

  const retryDashboard = (dashboardId) => {
    if (window.SM?.fetchDashboardData) {
      window.SM.fetchDashboardData(dashboardId);
    }
  };

  return (
    <AppCtx.Provider value={{
      timeRange, setTimeRange,
      filters, setFilters, toggleFilter,
      drawerContent, setDrawerContent,
      cmdkOpen, setCmdkOpen,
      tweaks,
      getDashboardData,
      getDashboardLoading,
      getDashboardError,
      retryDashboard,
      dataRefresh,
    }}>
      {children}
    </AppCtx.Provider>
  );
}

// ---------- Tweaks defaults ----------
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "default",
  "density": "default",
  "showLiveTicker": true,
  "showAudienceTags": true,
  "accentHue": 220,
  "showSparklines": true
}/*EDITMODE-END*/;

// ---------- Left nav ----------
function Nav() {
  const { route, navigate } = useHashRoute();
  const groups = useMemo(() => {
    const out = {};
    ROUTES.forEach(r => { (out[r.group] = out[r.group] || []).push(r); });
    return out;
  }, []);
  return (
    <aside className="nav">
      <div className="nav__brand" onClick={() => navigate("#/dashboard")}>
        <BrandMark size={22}/>
        <div>
          <div className="nav__brand-name">Sentinel Mesh</div>
          <div className="nav__brand-tag">Sentinel Mesh · v2.4</div>
        </div>
      </div>
      <div className="nav__list">
        {Object.entries(groups).map(([g, items]) => (
          <div key={g}>
            <div className="nav__group-label">{g}</div>
            {items.map(r => (
              <a key={r.id}
                 className={"nav__item" + (r.id === route.id ? " nav__item--active" : "")}
                 onClick={(e) => { e.preventDefault(); navigate(r.path); }}
                 href={r.path}>
                <Icon name={r.icon} size={14}/>
                <span>{r.label}</span>
                {r.audience && r.audience[0] && (
                  <span className="nav__item-tag">{r.audience[0].toUpperCase()}</span>
                )}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="nav__footer">
        <span className="live-pulse"></span>
        <span>STREAM ACTIVE</span>
        <span>312/s</span>
      </div>
    </aside>
  );
}

// ---------- Topbar ----------
function Topbar() {
  const { route } = useHashRoute();
  const { timeRange, setTimeRange, setCmdkOpen } = React.useContext(AppCtx);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const refreshLabel = useMemo(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
  }, [tick]);

  return (
    <header className="topbar">
      <div className="crumb">
        <span>Home</span>
        <span className="crumb__sep">/</span>
        <span>{route.group}</span>
        <span className="crumb__sep">/</span>
        <span className="crumb__current">{route.label}</span>
      </div>
      <div className="topbar__search" onClick={() => setCmdkOpen(true)}>
        <Icon name="search" size={13}/>
        <span>Search dashboards, playbooks, CVEs, gates…</span>
        <kbd>⌘K</kbd>
      </div>
      <div className="topbar__actions">
        <div className="time-picker">
          {["1h", "24h", "7d", "30d"].map(r => (
            <div key={r}
                 className={"time-picker__opt" + (timeRange === r ? " time-picker__opt--active" : "")}
                 onClick={() => setTimeRange(r)}>
              {r}
            </div>
          ))}
        </div>
        <button className="btn btn--ghost btn--icon" title="Refresh">
          <Icon name="refresh" size={13}/>
        </button>
        <button className="btn btn--ghost btn--icon" title="Share">
          <Icon name="share" size={13}/>
        </button>
        <span className="mono" style={{ color: "var(--fg-3)", fontSize: 10.5, marginLeft: 4 }}>
          UPDATED {refreshLabel}
        </span>
      </div>
    </header>
  );
}

// ---------- Filter rail ----------
function FilterRail({ severityOpts, domainOpts, tierOpts }) {
  const { filters, toggleFilter, setFilters } = React.useContext(AppCtx);
  const all = [
    ...filters.severity.map(v => ({ cat: "severity", v })),
    ...filters.domain.map(v => ({ cat: "domain", v })),
    ...filters.tier.map(v => ({ cat: "tier", v })),
  ];
  return (
    <div className="filter-rail">
      <span className="filter-rail__label">Filters</span>
      {severityOpts && (
        <>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)" }}>SEV</span>
          {severityOpts.map(s => (
            <span key={s} className={"chip" + (filters.severity.includes(s) ? " chip--active" : "")}
                  onClick={() => toggleFilter("severity", s)}>{s}</span>
          ))}
        </>
      )}
      {domainOpts && (
        <>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)", marginLeft: 6 }}>DOMAIN</span>
          {domainOpts.map(d => (
            <span key={d} className={"chip" + (filters.domain.includes(d) ? " chip--active" : "")}
                  onClick={() => toggleFilter("domain", d)}>{d}</span>
          ))}
        </>
      )}
      {tierOpts && (
        <>
          <span className="mono" style={{ fontSize: 10, color: "var(--fg-3)", marginLeft: 6 }}>TIER</span>
          {tierOpts.map(t => (
            <span key={t} className={"chip" + (filters.tier.includes(t) ? " chip--active" : "")}
                  onClick={() => toggleFilter("tier", t)}>{t}</span>
          ))}
        </>
      )}
      {all.length > 0 && (
        <button className="btn btn--ghost" style={{ marginLeft: "auto", height: 24, fontSize: 11 }}
                onClick={() => setFilters({ severity: [], domain: [], tier: [] })}>
          Clear all
        </button>
      )}
    </div>
  );
}

// ---------- Cmd-K palette ----------
function CmdK() {
  const { cmdkOpen, setCmdkOpen } = React.useContext(AppCtx);
  const { navigate } = useHashRoute();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  useEffect(() => {
    if (cmdkOpen) {
      setQ(""); setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [cmdkOpen]);

  const items = useMemo(() => {
    const ql = q.toLowerCase();
    const dashItems = ROUTES.map(r => ({
      kind: "dashboard", label: r.label, sub: r.desc, group: r.group,
      action: () => { navigate(r.path); setCmdkOpen(false); }
    }));
    const playbookItems = (window.SM_DATA?.project?.ranking || []).map(p => ({
      kind: "playbook", label: p.name, sub: `${p.domain} · runs ${p.runs24h} · success ${(p.successRate*100).toFixed(2)}%`,
      group: "Playbooks", action: () => { navigate("#/dashboard"); setCmdkOpen(false); }
    }));
    const cveData = Array.isArray(window.SM_DATA?.cve) ? window.SM_DATA.cve : (window.SM_DATA?.cve?.data || []);
    const cveItems = cveData.slice(0, 24).map(c => ({
      kind: "cve", label: c.id, sub: `${c.product} · CVSS ${c.cvss} · EPSS ${(c.epss*100).toFixed(1)}%${c.kev ? " · KEV":""}`,
      group: "CVEs", action: () => { navigate("#/cve"); setCmdkOpen(false); }
    }));
    const all = [...dashItems, ...playbookItems, ...cveItems];
    if (!q) return all.slice(0, 14);
    return all.filter(i => i.label.toLowerCase().includes(ql) || (i.sub && i.sub.toLowerCase().includes(ql))).slice(0, 18);
  }, [q]);

  useEffect(() => {
    const onKey = (e) => {
      if (!cmdkOpen) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, items.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
      if (e.key === "Enter")     { e.preventDefault(); items[active]?.action(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cmdkOpen, items, active]);

  if (!cmdkOpen) return null;
  const grouped = items.reduce((acc, it) => {
    (acc[it.group] = acc[it.group] || []).push(it);
    return acc;
  }, {});
  let idx = -1;

  return (
    <div className="cmdk-overlay" onClick={() => setCmdkOpen(false)}>
      <div className="cmdk" onClick={e => e.stopPropagation()}>
        <input ref={inputRef} className="cmdk__input"
               placeholder="Jump to dashboard, playbook, CVE, gate…"
               value={q} onChange={e => { setQ(e.target.value); setActive(0); }}/>
        <div className="cmdk__list">
          {Object.entries(grouped).map(([g, list]) => (
            <div key={g}>
              <div className="cmdk__group">{g}</div>
              {list.map(it => {
                idx++;
                const isActive = idx === active;
                const myIdx = idx;
                return (
                  <div key={it.label + g} className={"cmdk__item" + (isActive ? " cmdk__item--active" : "")}
                       onMouseEnter={() => setActive(myIdx)}
                       onClick={() => it.action()}>
                    <Icon name={it.kind === "cve" ? "bug" : it.kind === "playbook" ? "play" : "grid"} size={13}/>
                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</span>
                      {it.sub && <span style={{ fontSize: 10.5, color: "var(--fg-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.sub}</span>}
                    </div>
                    <span className="cmdk__item-tag">{it.kind.toUpperCase()}</span>
                  </div>
                );
              })}
            </div>
          ))}
          {items.length === 0 && (
            <div style={{ padding: "30px 20px", textAlign: "center", color: "var(--fg-3)", fontSize: 12 }}>No results</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------- Drill-down drawer ----------
function Drawer() {
  const { drawerContent, setDrawerContent } = React.useContext(AppCtx);
  if (!drawerContent) return null;
  return (
    <>
      <div className="drawer-overlay" onClick={() => setDrawerContent(null)}/>
      <div className="drawer">
        <div className="drawer__header">
          <h3 className="drawer__title">{drawerContent.title}</h3>
          <button className="btn btn--ghost btn--icon" onClick={() => setDrawerContent(null)}>
            <Icon name="x" size={12}/>
          </button>
        </div>
        <div className="drawer__body">
          {drawerContent.body}
        </div>
      </div>
    </>
  );
}

// ---------- Page header (title + audience tags + meta) ----------
function PageHeader({ title, subtitle, audience = [], owner, lastUpdated, controls }) {
  const { tweaks } = React.useContext(AppCtx);
  return (
    <div className="page__header">
      <div className="page__title-block">
        <h1 className="page__title">{title}</h1>
        <p className="page__subtitle">{subtitle}</p>
        <div className="page__meta">
          {tweaks.values.showAudienceTags && audience.length > 0 && (
            <div className="audience-tags">
              {audience.map(a => (
                <span key={a} className={`audience-tag audience-tag--${a}`}>
                  {a === "board" ? "BOARD" : a === "exec" ? "C-LEVEL" : a === "secops" ? "SECOPS" : a === "ic" ? "ANALYST" : "DEV"}
                </span>
              ))}
            </div>
          )}
          {owner && <span>OWNER · {owner}</span>}
          {lastUpdated && <span>UPDATED · {lastUpdated}</span>}
        </div>
      </div>
      {controls && <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{controls}</div>}
    </div>
  );
}

// ---------- Card wrapper (consistent panel) ----------
function Card({ title, subtitle, status = "live", menu = true, children, style, bodyStyle, onClick, headerExtra }) {
  return (
    <div className="card" style={style} onClick={onClick}>
      {(title || subtitle) && (
        <div className="card__header">
          <h4 className="card__title">
            {status && <span className="card__title-status" style={{ background: status === "live" ? "var(--green)" : status === "warn" ? "var(--amber)" : "var(--red)" }}/>}
            {title}
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {subtitle && <span className="card__subtitle">{subtitle}</span>}
            {headerExtra}
            {menu && <span className="card__menu">⋯</span>}
          </div>
        </div>
      )}
      <div className="card__body" style={bodyStyle}>{children}</div>
    </div>
  );
}

// ---------- Page wrapper ----------
function Page({ children }) {
  return <div className="page">{children}</div>;
}

// ---------- Tweaks panel content ----------
function TweaksContent() {
  const { tweaks } = React.useContext(AppCtx);
  return (
    <>
      <TweakSection title="Theme">
        <TweakRadio label="Palette"
                    value={tweaks.values.theme}
                    onChange={v => tweaks.setTweak("theme", v)}
                    options={[
                      { label: "Default", value: "default" },
                      { label: "Midnight", value: "midnight" },
                      { label: "Forest", value: "forest" },
                    ]}/>
      </TweakSection>
      <TweakSection title="Density">
        <TweakRadio label="Spacing"
                    value={tweaks.values.density}
                    onChange={v => tweaks.setTweak("density", v)}
                    options={[
                      { label: "Compact", value: "compact" },
                      { label: "Default", value: "default" },
                      { label: "Cozy", value: "cozy" },
                    ]}/>
      </TweakSection>
      <TweakSection title="Display">
        <TweakToggle label="Show audience tags"
                     value={tweaks.values.showAudienceTags}
                     onChange={v => tweaks.setTweak("showAudienceTags", v)}/>
        <TweakToggle label="Show live ticker on Project Dashboard"
                     value={tweaks.values.showLiveTicker}
                     onChange={v => tweaks.setTweak("showLiveTicker", v)}/>
        <TweakToggle label="Show sparklines on KPIs"
                     value={tweaks.values.showSparklines}
                     onChange={v => tweaks.setTweak("showSparklines", v)}/>
      </TweakSection>
    </>
  );
}

// ---------- App root ----------
function App() {
  const { route } = useHashRoute();
  const PageComponent = window.SM_PAGES?.[route.id] || (() => <Page><div style={{ color: "var(--fg-2)" }}>Loading…</div></Page>);

  return (
    <AppProvider>
      <div className="app">
        <Nav/>
        <Topbar/>
        <main className="main">
          <PageComponent/>
        </main>
      </div>
      <CmdK/>
      <Drawer/>
      <TweaksPanel title="Tweaks">
        <TweaksContent/>
      </TweaksPanel>
    </AppProvider>
  );
}

// expose helpers
Object.assign(window, { ROUTES, Icon, BrandMark, AppCtx, Page, PageHeader, Card, FilterRail, App });
