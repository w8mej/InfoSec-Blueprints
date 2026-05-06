/* ============================================================
   Sentinel Mesh — chart primitives
   Lightweight SVG-based viz components.
   Globals: window.{Sparkline, Donut, BarRow, GroupedBar, AreaLine,
            HeatmapGrid, Gauge, RadialArc, NetworkGraph, StackedBar,
            useTooltip, formatNum, formatPct}
   ============================================================ */

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ---------- Formatting ----------
function formatNum(n, opts = {}) {
  if (n == null) return "—";
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n/1e9).toFixed(opts.dp ?? 1) + "B";
  if (abs >= 1e6) return (n/1e6).toFixed(opts.dp ?? 1) + "M";
  if (abs >= 1e3) return (n/1e3).toFixed(opts.dp ?? 1) + "K";
  return Number.isInteger(n) ? String(n) : n.toFixed(opts.dp ?? 1);
}
function formatPct(n, dp = 1) { return (n).toFixed(dp) + "%"; }
function formatTime(ts) {
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
}

// ---------- Tooltip helper ----------
function useTooltip() {
  const [tip, setTip] = useState(null);
  useEffect(() => {
    const onMove = (e) => {
      if (tip) setTip(t => ({ ...t, x: e.clientX, y: e.clientY }));
    };
    if (tip) window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [tip != null]);

  const show = useCallback((content, e) => {
    setTip({ content, x: e.clientX, y: e.clientY });
  }, []);
  const hide = useCallback(() => setTip(null), []);

  const Tip = tip ? (
    <div className={"viz-tooltip viz-tooltip--visible"}
         style={{ left: tip.x + 14, top: tip.y + 14 }}>
      {tip.content}
    </div>
  ) : null;
  return { Tip, show, hide };
}

// ---------- Sparkline ----------
function Sparkline({ data, color = "var(--signal)", height = 28, fill = true, baseline = true }) {
  if (!data || data.length === 0) return null;
  const w = 200, h = height;
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const range = max - min || 1;
  const xs = data.map((_, i) => (i / (data.length - 1)) * w);
  const ys = data.map(d => h - ((d.v - min) / range) * (h - 4) - 2);
  const path = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ width: "100%", height: h }}>
      {baseline && <line x1="0" y1={h-1} x2={w} y2={h-1} stroke="var(--bg-4)" strokeWidth="1"/>}
      {fill && <path d={area} fill={color} opacity="0.16"/>}
      <path d={path} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
}

// ---------- Area / line chart ----------
function AreaLine({ data, color = "var(--signal)", height = 200, showAxes = true, label }) {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver(() => { if (ref.current) setW(ref.current.clientWidth); });
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const { show, hide, Tip } = useTooltip();
  const padL = 36, padR = 12, padT = 8, padB = 22;
  const innerW = w - padL - padR;
  const innerH = height - padT - padB;
  const max = Math.max(...data.map(d => d.v));
  const min = Math.min(...data.map(d => d.v));
  const range = (max - min) || 1;
  const xs = data.map((_, i) => padL + (i / (data.length - 1)) * innerW);
  const ys = data.map(d => padT + innerH - ((d.v - min) / range) * innerH);
  const path = xs.map((x, i) => `${i ? "L" : "M"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `${path} L${padL+innerW},${padT+innerH} L${padL},${padT+innerH} Z`;
  const ticks = [0, 0.5, 1].map(t => min + range * t);

  return (
    <div ref={ref} style={{ width: "100%", position: "relative" }}>
      {Tip}
      <svg width={w} height={height}>
        <defs>
          <linearGradient id={`grad-${color.replace(/[^a-z]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        {/* gridlines */}
        {showAxes && ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={padT + innerH * (1 - i/2)} x2={padL+innerW} y2={padT + innerH * (1 - i/2)}
                  stroke="var(--bg-4)" strokeDasharray="2 4"/>
            <text x={padL - 6} y={padT + innerH * (1 - i/2) + 3} fontSize="9.5" textAnchor="end" fill="var(--fg-3)">
              {formatNum(t)}
            </text>
          </g>
        ))}
        <path d={area} fill={`url(#grad-${color.replace(/[^a-z]/gi, "")})`}/>
        <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
        {/* time labels */}
        {showAxes && [0, Math.floor(data.length/2), data.length-1].map(i => (
          <text key={i} x={xs[i]} y={height - 6} fontSize="9.5" textAnchor="middle" fill="var(--fg-3)">
            {formatTime(data[i].t)}
          </text>
        ))}
        {/* hover overlay */}
        {data.map((d, i) => (
          <rect key={i} x={xs[i] - innerW / data.length / 2} y={padT}
                width={innerW / data.length} height={innerH}
                fill="transparent"
                onMouseEnter={(e) => show(<><span className="viz-tooltip__label">{label || "value"}</span>{formatNum(d.v, {dp:2})} <span className="viz-tooltip__label" style={{marginLeft:8}}>at</span>{formatTime(d.t)}</>, e)}
                onMouseLeave={hide}/>
        ))}
      </svg>
    </div>
  );
}

// ---------- Donut ----------
function Donut({ data, size = 140, thickness = 22, centerLabel, centerValue }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - thickness / 2 - 2;
  const c = size / 2;
  let acc = 0;
  const { show, hide, Tip } = useTooltip();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      {Tip}
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--bg-3)" strokeWidth={thickness}/>
        {data.map((d, i) => {
          const frac = d.value / total;
          const start = acc;
          const end = acc + frac;
          acc = end;
          const dash = (end - start) * 2 * Math.PI * r;
          const gap = 2 * Math.PI * r - dash;
          const offset = -start * 2 * Math.PI * r;
          return (
            <circle key={i} cx={c} cy={c} r={r} fill="none"
                    stroke={d.color} strokeWidth={thickness}
                    strokeDasharray={`${dash} ${gap}`}
                    strokeDashoffset={offset}
                    transform={`rotate(-90 ${c} ${c})`}
                    style={{ cursor: "pointer", transition: "stroke-width 0.15s" }}
                    onMouseEnter={(e) => show(<><span className="viz-tooltip__label">{d.label}</span>{formatNum(d.value)} <span className="viz-tooltip__label" style={{marginLeft:6}}>·</span> {(frac*100).toFixed(1)}%</>, e)}
                    onMouseLeave={hide}/>
          );
        })}
        {centerValue && (
          <text x={c} y={c} textAnchor="middle" dominantBaseline="middle"
                fontSize="20" fill="var(--fg-0)" fontFamily="var(--font-mono)" fontWeight="500">
            {centerValue}
          </text>
        )}
        {centerLabel && (
          <text x={c} y={c + 16} textAnchor="middle" fontSize="9.5" fill="var(--fg-3)" letterSpacing="0.1em">
            {centerLabel}
          </text>
        )}
      </svg>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="mono-sm" style={{ fontSize: 10, color: "var(--fg-3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4, display: "flex", justifyContent: "space-between" }}>
          <span>label</span><span>value</span>
        </div>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 0", fontSize: 11.5 }}>
            <span style={{ width: 8, height: 8, background: d.color, borderRadius: 2, flexShrink: 0 }}/>
            <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--fg-1)" }}>{d.label}</span>
            <span className="mono" style={{ color: "var(--fg-1)", fontVariantNumeric: "tabular-nums" }}>{formatNum(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- BarRow (Grafana-style heatmap-row, like ref img1 top bars) ----------
// Renders a list of named rows where each row is a sequence of cells whose
// color encodes value relative to the row max. Inspired by the dense
// Grafana "by event count" heat-bar style — but original layout.
function BarRow({ data, cells = 20, height = 20, valueKey = "value", showValue = true, palette = "fire" }) {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  const palettes = {
    fire: (t) => `oklch(${65 + t*8}% ${0.13 + t*0.06} ${85 - t*60})`,
    ocean: (t) => `oklch(${55 + t*15}% ${0.08 + t*0.1} ${220 - t*30})`,
    spectrum: (t) => `oklch(${60 + t*20}% 0.16 ${290 - t*200})`,
  };
  const fn = palettes[palette] || palettes.fire;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, width: "100%" }}>
      {data.map((row, i) => {
        const v = row[valueKey] || 0;
        const filled = Math.round((v / max) * cells);
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 1fr 38px", alignItems: "center", gap: 8 }}>
            <span style={{ color: "var(--fg-1)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {row.label || row.name}
            </span>
            <div style={{ display: "flex", gap: 1.5, height }}>
              {Array.from({ length: cells }).map((_, c) => {
                if (c < filled) {
                  const t = c / Math.max(cells - 1, 1);
                  return <div key={c} style={{ flex: 1, background: fn(t), borderRadius: 1 }}/>;
                }
                return <div key={c} style={{ flex: 1, background: "var(--bg-3)", borderRadius: 1, opacity: 0.4 }}/>;
              })}
            </div>
            {showValue && (
              <span className="mono" style={{ color: "var(--fg-1)", fontSize: 11, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                {formatNum(v)}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Stacked bar (per-day) ----------
function StackedBar({ data, keys, colors, height = 200, showAxes = true }) {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver(() => { if (ref.current) setW(ref.current.clientWidth); });
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const padL = 36, padR = 8, padT = 8, padB = 22;
  const innerW = w - padL - padR;
  const innerH = height - padT - padB;
  const max = Math.max(...data.map(d => keys.reduce((s, k) => s + (d[k]||0), 0)), 1);
  const colW = innerW / data.length;
  const { show, hide, Tip } = useTooltip();

  return (
    <div ref={ref} style={{ width: "100%", position: "relative" }}>
      {Tip}
      <svg width={w} height={height}>
        {showAxes && [0, 0.5, 1].map((t, i) => (
          <g key={i}>
            <line x1={padL} y1={padT + innerH * (1 - t)} x2={padL + innerW} y2={padT + innerH * (1 - t)}
                  stroke="var(--bg-4)" strokeDasharray="2 4"/>
            <text x={padL - 6} y={padT + innerH * (1 - t) + 3} fontSize="9.5" textAnchor="end" fill="var(--fg-3)">
              {formatNum(max * t)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          let acc = 0;
          return (
            <g key={i} transform={`translate(${padL + i * colW}, 0)`}>
              {keys.map((k, ki) => {
                const v = d[k] || 0;
                const h = (v / max) * innerH;
                const y = padT + innerH - acc - h;
                acc += h;
                return (
                  <rect key={k} x={colW * 0.12} y={y} width={colW * 0.76} height={h}
                        fill={colors[ki]} rx="1"
                        onMouseEnter={(e) => show(<><span className="viz-tooltip__label">{k}</span>{formatNum(v)}</>, e)}
                        onMouseLeave={hide}/>
                );
              })}
            </g>
          );
        })}
        {showAxes && [0, Math.floor(data.length/2), data.length-1].map(i => (
          <text key={i} x={padL + i * colW + colW/2} y={height - 6} fontSize="9.5" textAnchor="middle" fill="var(--fg-3)">
            {data[i].label != null ? data[i].label : `${data[i].hour ?? i}h`}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ---------- Heatmap grid ----------
function HeatmapGrid({ rows, cols, values, scaleMax, color = "oklch(70% 0.16 25)", labelRow, labelCol, cellH = 22, gap = 2 }) {
  const max = scaleMax ?? Math.max(...values.flat());
  const { show, hide, Tip } = useTooltip();
  return (
    <div style={{ display: "flex", gap: 6 }}>
      {Tip}
      <div style={{ display: "flex", flexDirection: "column", gap, paddingTop: 18 }}>
        {rows.map(r => (
          <div key={r} style={{ height: cellH, fontSize: 11, color: "var(--fg-2)", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>
            {r}
          </div>
        ))}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, 1fr)`, gap, height: 18 }}>
          {cols.map(c => (
            <div key={c} style={{ fontSize: 9.5, color: "var(--fg-3)", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center", fontFamily: "var(--font-mono)" }}>
              {c}
            </div>
          ))}
        </div>
        {rows.map((r, ri) => (
          <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length}, 1fr)`, gap }}>
            {cols.map((c, ci) => {
              const v = values[ri][ci];
              const t = v / max;
              const baseColor = color.replace(/oklch\((\d+)%\s+([0-9.]+)\s+(\d+)\)/, (_, l, ch, h) => {
                return `oklch(${20 + t*60}% ${(parseFloat(ch) * (0.3 + t*0.7)).toFixed(3)} ${h})`;
              });
              return (
                <div key={c} style={{
                  height: cellH,
                  background: baseColor,
                  borderRadius: 2,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontFamily: "var(--font-mono)",
                  color: t > 0.5 ? "oklch(15% 0.02 250)" : "var(--fg-1)",
                  border: "1px solid oklch(100% 0 0 / 0.04)",
                }}
                onMouseEnter={(e) => show(<><span className="viz-tooltip__label">{labelRow}</span>{r} <span className="viz-tooltip__label" style={{marginLeft:6}}>{labelCol}</span>{c} <span className="viz-tooltip__label" style={{marginLeft:6}}>·</span> {formatNum(v)}</>, e)}
                onMouseLeave={hide}>
                  {v}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Gauge (semicircle) ----------
function Gauge({ value, max = 100, label, unit = "", thresholds = [0.5, 0.8], color }) {
  const size = 160;
  const r = size / 2 - 14;
  const c = size / 2;
  const startAngle = Math.PI;
  const t = Math.min(1, value / max);
  const endAngle = startAngle + t * Math.PI;
  function arc(a0, a1, rr) {
    const x0 = c + rr * Math.cos(a0);
    const y0 = c + rr * Math.sin(a0);
    const x1 = c + rr * Math.cos(a1);
    const y1 = c + rr * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${x0} ${y0} A${rr} ${rr} 0 ${large} 1 ${x1} ${y1}`;
  }
  const auto = color || (t < thresholds[0] ? "var(--green)" : t < thresholds[1] ? "var(--amber)" : "var(--red)");
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size * 0.66}>
        <path d={arc(startAngle, startAngle + Math.PI, r)} stroke="var(--bg-3)" strokeWidth="10" fill="none" strokeLinecap="round"/>
        <path d={arc(startAngle, endAngle, r)} stroke={auto} strokeWidth="10" fill="none" strokeLinecap="round"/>
        <text x={c} y={c - 4} textAnchor="middle" fontSize="22" fill="var(--fg-0)" fontFamily="var(--font-mono)" fontWeight="500">
          {typeof value === "number" ? value.toFixed(value < 10 ? 2 : 0) : value}{unit}
        </text>
        <text x={c} y={c + 12} textAnchor="middle" fontSize="9.5" fill="var(--fg-3)" letterSpacing="0.1em" textTransform="uppercase">
          {label}
        </text>
      </svg>
    </div>
  );
}

// ---------- Radial Arc (used for circular flow / dark-matter style infographic) ----------
function RadialArc({ value, max = 100, color = "var(--signal)", label, sublabel, size = 130 }) {
  const r = size / 2 - 16;
  const c = size / 2;
  const t = Math.min(1, value / max);
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={c} cy={c} r={r} fill="none" stroke="var(--bg-3)" strokeWidth="8"/>
      <circle cx={c} cy={c} r={r} fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={`${circ * t} ${circ}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${c} ${c})`}/>
      <text x={c} y={c - 2} textAnchor="middle" fontSize="20" fill="var(--fg-0)" fontFamily="var(--font-mono)" fontWeight="500">
        {typeof value === "number" ? (value < 10 ? value.toFixed(1) : Math.round(value)) : value}
      </text>
      <text x={c} y={c + 14} textAnchor="middle" fontSize="9" fill="var(--fg-3)" letterSpacing="0.1em">
        {label}
      </text>
      {sublabel && <text x={c} y={c + 26} textAnchor="middle" fontSize="9" fill="var(--fg-3)">{sublabel}</text>}
    </svg>
  );
}

// ---------- Inventory tile (full-color block, ref img1 inventory style) ----------
function TileBlock({ label, value, color }) {
  return (
    <div className="tile-block" style={{ background: color }}>
      <div className="tile-block__label">{label}</div>
      <div className="tile-block__value">{formatNum(value)}</div>
    </div>
  );
}

// ---------- Network Graph (force-free, polar layout) ----------
// Used for blast radius, ship-to-ship style risk flow. Original layout.
function NetworkGraph({ center, edges, height = 360, accentByRisk = true, onNodeClick }) {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver(() => { if (ref.current) setW(ref.current.clientWidth); });
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const cx = w/2, cy = height/2;
  const r = Math.min(w, height) * 0.36;
  const { show, hide, Tip } = useTooltip();

  const positions = edges.map((_, i) => {
    const a = (i / edges.length) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });

  function riskColor(risk) {
    if (!accentByRisk) return "var(--signal)";
    if (risk > 70) return "var(--red)";
    if (risk > 40) return "var(--amber)";
    return "var(--green)";
  }

  return (
    <div ref={ref} style={{ width: "100%", position: "relative" }}>
      {Tip}
      <svg width={w} height={height}>
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%">
            <stop offset="0%" stopColor="oklch(70% 0.16 220)" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="oklch(70% 0.16 220)" stopOpacity="0"/>
          </radialGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r * 1.05} fill="none" stroke="var(--bg-4)" strokeDasharray="2 4"/>
        <circle cx={cx} cy={cy} r={70} fill="url(#centerGlow)"/>
        {/* edges */}
        {edges.map((e, i) => {
          const p = positions[i];
          const curveX = (cx + p.x) / 2 + (p.y - cy) * 0.08;
          const curveY = (cy + p.y) / 2 - (p.x - cx) * 0.08;
          const stroke = riskColor(e.risk);
          const strokeW = 1.2 + (e.risk / 100) * 3;
          return (
            <g key={i}>
              <path d={`M${cx} ${cy} Q${curveX} ${curveY} ${p.x} ${p.y}`}
                    fill="none" stroke={stroke} strokeWidth={strokeW} opacity="0.65"/>
            </g>
          );
        })}
        {/* center node */}
        <g>
          <rect x={cx - 80} y={cy - 22} width="160" height="44" rx="6"
                fill="oklch(20% 0.04 220)" stroke="oklch(60% 0.16 220)" strokeWidth="1.5"/>
          <text x={cx} y={cy - 4} textAnchor="middle" fontSize="11" fill="var(--fg-0)" fontFamily="var(--font-ui)" fontWeight="600">
            {center.label || center.name}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="var(--fg-3)" fontFamily="var(--font-mono)" letterSpacing="0.08em">
            {center.note || center.id}
          </text>
        </g>
        {/* edge nodes */}
        {edges.map((e, i) => {
          const p = positions[i];
          return (
            <g key={i} style={{ cursor: onNodeClick ? "pointer" : "default" }}
               onClick={() => onNodeClick && onNodeClick(e)}
               onMouseEnter={(ev) => show(<><span className="viz-tooltip__label">node</span>{e.node} <span className="viz-tooltip__label" style={{marginLeft:6}}>risk</span>{e.risk}</>, ev)}
               onMouseLeave={hide}>
              <rect x={p.x - 64} y={p.y - 18} width="128" height="36" rx="5"
                    fill="oklch(20% 0.018 250)" stroke={riskColor(e.risk)} strokeWidth="1"/>
              <text x={p.x} y={p.y - 4} textAnchor="middle" fontSize="10.5" fill="var(--fg-0)" fontFamily="var(--font-ui)" fontWeight="500">
                {e.flag} {e.node}
              </text>
              <text x={p.x} y={p.y + 9} textAnchor="middle" fontSize="8.5" fill="var(--fg-3)" fontFamily="var(--font-mono)" letterSpacing="0.05em">
                {e.id} · risk {e.risk}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ---------- Concentric rings (blast radius) ----------
function BlastRings({ epicenter, rings, height = 360 }) {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver(() => { if (ref.current) setW(ref.current.clientWidth); });
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const cx = w / 2, cy = height / 2;
  const maxR = Math.min(w, height) * 0.46;
  const colors = ["var(--red)", "var(--amber)", "var(--signal)", "var(--green)"];

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width={w} height={height}>
        {rings.slice().reverse().map((r, i) => {
          const idx = rings.length - 1 - i;
          const rr = (idx + 1) / rings.length * maxR;
          const c = colors[idx] || "var(--signal)";
          return (
            <g key={idx}>
              <circle cx={cx} cy={cy} r={rr} fill="none" stroke={c} strokeOpacity="0.25" strokeWidth="1" strokeDasharray="2 4"/>
              <circle cx={cx} cy={cy} r={rr} fill={c} fillOpacity="0.04"/>
              <text x={cx + rr * 0.7} y={cy - rr * 0.7} fontSize="10" fontFamily="var(--font-mono)" fill={c} letterSpacing="0.08em">
                {r.label.toUpperCase()} · {r.count}
              </text>
            </g>
          );
        })}
        {/* spokes for examples */}
        {rings.flatMap((ring, ri) => {
          const rr = (ri + 1) / rings.length * maxR;
          const prevR = ri / rings.length * maxR;
          const mid = (rr + prevR) / 2;
          return ring.examples.slice(0, 3).map((ex, ei) => {
            const angle = (ei / 3) * Math.PI * 2 / rings.length + (ri * Math.PI / 6) - Math.PI/2;
            const x = cx + mid * Math.cos(angle);
            const y = cy + mid * Math.sin(angle);
            return (
              <g key={`${ri}-${ei}`}>
                <circle cx={x} cy={y} r="3" fill={colors[ri] || "var(--signal)"}/>
                <text x={x + 6} y={y + 3} fontSize="9.5" fill="var(--fg-2)" fontFamily="var(--font-mono)">
                  {ex}
                </text>
              </g>
            );
          });
        })}
        {/* epicenter */}
        <circle cx={cx} cy={cy} r="14" fill="var(--red)" opacity="0.9"/>
        <circle cx={cx} cy={cy} r="14" fill="none" stroke="var(--red)" strokeWidth="1">
          <animate attributeName="r" from="14" to="42" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" from="0.8" to="0" dur="2s" repeatCount="indefinite"/>
        </circle>
        <text x={cx} y={cy + 32} textAnchor="middle" fontSize="10.5" fill="var(--fg-0)" fontFamily="var(--font-mono)" fontWeight="600">
          {epicenter.label}
        </text>
        <text x={cx} y={cy + 46} textAnchor="middle" fontSize="9" fill="var(--fg-3)" fontFamily="var(--font-mono)" letterSpacing="0.08em">
          {epicenter.note}
        </text>
      </svg>
    </div>
  );
}

// ---------- Circular ribbon (blood pressure / dark matter inspired) ----------
// Sections of a curved arc, used for editorial story-viz like the
// "Silent Burden" or "Dark Matter" infographics. Original.
function RibbonArc({ buckets, height = 320, accent = "oklch(70% 0.16 290)" }) {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver(() => { if (ref.current) setW(ref.current.clientWidth); });
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const cx = w / 2, cy = height / 2;
  const ringR = Math.min(w, height) * 0.36;
  const ringW = Math.min(w, height) * 0.07;

  function arc(a0, a1, rr) {
    const x0 = cx + rr * Math.cos(a0);
    const y0 = cy + rr * Math.sin(a0);
    const x1 = cx + rr * Math.cos(a1);
    const y1 = cy + rr * Math.sin(a1);
    const large = a1 - a0 > Math.PI ? 1 : 0;
    return `M${x0} ${y0} A${rr} ${rr} 0 ${large} 1 ${x1} ${y1}`;
  }

  const totalSpan = Math.PI * 1.6;
  const startA = -Math.PI / 2 - totalSpan / 2;
  const total = buckets.reduce((s, b) => s + b.count, 0) || 1;
  let acc = 0;

  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width={w} height={height}>
        {/* baseline ring */}
        <path d={arc(startA, startA + totalSpan, ringR)} stroke="var(--bg-3)" strokeWidth={ringW} fill="none" strokeLinecap="round"/>
        {buckets.map((b, i) => {
          const frac = b.count / total;
          const a0 = startA + (acc / total) * totalSpan + 0.01;
          const a1 = startA + ((acc + b.count) / total) * totalSpan - 0.01;
          acc += b.count;
          const mid = (a0 + a1) / 2;
          const tx = cx + (ringR + ringW) * Math.cos(mid);
          const ty = cy + (ringR + ringW) * Math.sin(mid);
          return (
            <g key={i}>
              <path d={arc(a0, a1, ringR)} stroke={b.color || accent} strokeWidth={ringW} fill="none" strokeLinecap="round"/>
              <text x={tx} y={ty} textAnchor={tx < cx ? "end" : "start"} fontSize="10" fill="var(--fg-1)" fontFamily="var(--font-mono)">
                {b.label}
              </text>
              <text x={tx} y={ty + 12} textAnchor={tx < cx ? "end" : "start"} fontSize="9" fill="var(--fg-3)" fontFamily="var(--font-mono)">
                {b.count}
              </text>
            </g>
          );
        })}
        <text x={cx} y={cy} textAnchor="middle" fontSize="32" fill="var(--fg-0)" fontFamily="var(--font-mono)" fontWeight="500">
          {total}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize="9.5" fill="var(--fg-3)" letterSpacing="0.12em">
          TOTAL
        </text>
      </svg>
    </div>
  );
}

// ---------- Sankey-lite (for HITL gates, McKinsey-inspired flow) ----------
function SankeyLite({ left, right, flows, height = 320 }) {
  const ref = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver(() => { if (ref.current) setW(ref.current.clientWidth); });
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  const padX = 8, lblW = 150;
  const colW = 14;
  const innerH = height - 24;
  const lTotal = left.reduce((s, n) => s + n.value, 0);
  const rTotal = right.reduce((s, n) => s + n.value, 0);
  const total = Math.max(lTotal, rTotal);
  let lAcc = 0, rAcc = 0;
  const lPos = left.map(n => {
    const h = (n.value / total) * innerH;
    const y = lAcc;
    lAcc += h + 4;
    return { ...n, h, y };
  });
  const rPos = right.map(n => {
    const h = (n.value / total) * innerH;
    const y = rAcc;
    rAcc += h + 4;
    return { ...n, h, y };
  });
  const { show, hide, Tip } = useTooltip();

  return (
    <div ref={ref} style={{ width: "100%", position: "relative" }}>
      {Tip}
      <svg width={w} height={height}>
        {/* left bars */}
        {lPos.map(n => (
          <g key={n.id}>
            <rect x={padX + lblW} y={n.y + 12} width={colW} height={n.h} fill={n.color} rx="2"/>
            <text x={padX + lblW - 6} y={n.y + 12 + n.h / 2 + 3} textAnchor="end" fontSize="11" fill="var(--fg-1)">
              {n.label}
            </text>
            <text x={padX + lblW - 6} y={n.y + 12 + n.h / 2 + 16} textAnchor="end" fontSize="9.5" fill="var(--fg-3)" fontFamily="var(--font-mono)">
              {formatNum(n.value)}
            </text>
          </g>
        ))}
        {/* right bars */}
        {rPos.map(n => {
          const x = w - padX - lblW - colW;
          return (
            <g key={n.id}>
              <rect x={x} y={n.y + 12} width={colW} height={n.h} fill={n.color} rx="2"/>
              <text x={x + colW + 6} y={n.y + 12 + n.h / 2 + 3} textAnchor="start" fontSize="11" fill="var(--fg-1)">
                {n.label}
              </text>
              <text x={x + colW + 6} y={n.y + 12 + n.h / 2 + 16} textAnchor="start" fontSize="9.5" fill="var(--fg-3)" fontFamily="var(--font-mono)">
                {formatNum(n.value)}
              </text>
            </g>
          );
        })}
        {/* flows */}
        {flows.map((f, i) => {
          const lN = lPos.find(n => n.id === f.from);
          const rN = rPos.find(n => n.id === f.to);
          if (!lN || !rN) return null;
          const lH = (f.value / lN.value) * lN.h;
          const rH = (f.value / rN.value) * rN.h;
          // accumulate per-node offset
          lN._off = (lN._off || 0);
          rN._off = (rN._off || 0);
          const x0 = padX + lblW + colW;
          const y0 = lN.y + 12 + lN._off;
          const x1 = w - padX - lblW - colW;
          const y1 = rN.y + 12 + rN._off;
          lN._off += lH;
          rN._off += rH;
          const mx = (x0 + x1) / 2;
          return (
            <path key={i}
                  d={`M${x0} ${y0} C${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1} L${x1} ${y1+rH} C${mx} ${y1+rH}, ${mx} ${y0+lH}, ${x0} ${y0+lH} Z`}
                  fill={f.color || "var(--signal)"} fillOpacity="0.22" stroke={f.color || "var(--signal)"} strokeOpacity="0.4"
                  onMouseEnter={(e) => show(<><span className="viz-tooltip__label">{lN.label} → {rN.label}</span>{formatNum(f.value)}</>, e)}
                  onMouseLeave={hide}/>
          );
        })}
      </svg>
    </div>
  );
}

// Expose
Object.assign(window, {
  Sparkline, AreaLine, Donut, BarRow, StackedBar, HeatmapGrid, Gauge, RadialArc,
  TileBlock, NetworkGraph, BlastRings, RibbonArc, SankeyLite,
  useTooltip, formatNum, formatPct, formatTime,
});
