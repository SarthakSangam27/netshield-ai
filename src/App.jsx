
import { useState, useEffect, useRef } from "react";
import './App.css';



  


/* ─── DATA ─── */
const FEATURES = [
  { n:'01', icon:'🔍', name:'Deep Packet Inspection', desc:'Analyse traffic at Layer 7 in real time. Our AI engine classifies payloads across 2,400+ protocols — including encrypted and tunnelled traffic.' },
  { n:'02', icon:'🧠', name:'Behavioural AI Detection', desc:'Model baseline network behaviour per device and user. Detect zero-days and insider threats through anomaly scoring — before signatures exist.' },
  { n:'03', icon:'⚡', name:'Automated Response', desc:'Contain threats in under 50ms with policy-driven automated isolation, IP blocking, and SOAR playbook triggering — no manual intervention needed.' },
  { n:'04', icon:'🗺️', name:'Threat Intelligence Graph', desc:'Continuously updated threat feeds from 200M+ global sensors. Correlate indicators across your network and industry with a unified graph view.' },
  { n:'05', icon:'📊', name:'Forensic Telemetry', desc:'Full packet capture with 90-day hot storage. Reconstruct any session, trace lateral movement, and generate audit-ready incident reports in one click.' },
  { n:'06', icon:'🔗', name:'Ecosystem Integrations', desc:'Native connectors for Splunk, CrowdStrike, Okta, AWS, Azure, and 80+ others. Deploy via agent, tap, or cloud SPAN — in under 30 minutes.' },
];

const HOW_STEPS = [
  { n:'01', title:'Ingest & Normalise', desc:'Traffic is captured from network taps, cloud flow logs, endpoint agents, and DNS resolvers. All data is normalised into a unified event format at line speed.' },
  { n:'02', title:'AI Analysis', desc:'Five detection layers run in parallel: signature matching, ML anomaly detection, graph correlation, threat intel enrichment, and context reasoning.' },
  { n:'03', title:'Risk Scoring', desc:'Every event is assigned a confidence score and MITRE ATT&CK mapping. High-fidelity alerts surface with full context — eliminating alert fatigue.' },
  { n:'04', title:'Contain & Report', desc:'Automated playbooks isolate affected assets, block attack vectors, and notify stakeholders. Full audit trails are generated automatically for compliance teams.' },
];

const INITIAL_LOGS = [
  { t:'09:14:02', b:'scan',   m:<>Ingesting <b>14,280 pkt/s</b> across 6 segments</> },
  { t:'09:14:03', b:'detect', m:<>Port scan from <b>45.33.32.156</b> — 512 ports in 0.8s</> },
  { t:'09:14:03', b:'alert',  m:<>Confidence 97.3% — MITRE T1046 <b>Network Service Scan</b></> },
  { t:'09:14:03', b:'block',  m:<>Source IP blocked at edge in <b>38ms</b>. Playbook PB-041</> },
  { t:'09:14:04', b:'learn',  m:<><b>2 related IPs</b> auto-flagged in threat graph</> },
  { t:'09:14:06', b:'scan',   m:<>Baseline monitoring resumed — all segments nominal</> },
];
const MORE_LOGS = [
  { t:'09:14:44', b:'scan',   m:<>Network health check — all 6 segments nominal</> },
  { t:'09:14:52', b:'detect', m:<>Suspicious TLS cert on <b>host-09</b> — self-signed</> },
  { t:'09:14:53', b:'block',  m:<>Egress to 104.21.33.98 quarantined — PB-017</> },
  { t:'09:14:52', b:'alert',  m:<>MITRE T1573 Encrypted Channel — 81.2%</> },
  { t:'09:15:01', b:'scan',   m:<>Full segment rescan — 1,240 hosts</> },
  { t:'09:15:10', b:'learn',  m:<>Baseline updated for <b>3 hosts</b> post-patch</> },
];

const PLANS = [
  { tier:'Starter', price:'299', period:'per month · billed annually', desc:'For small teams protecting up to 250 network nodes.', feats:['Up to 250 nodes','AI anomaly detection','Automated blocking','30-day forensic storage','Email & Slack alerts'], off:['Custom playbooks','SSO / SAML','Dedicated SOC'] },
  { tier:'Professional', price:'799', period:'per month · billed annually', desc:'For mid-market teams needing full automation and compliance.', feats:['Up to 2,500 nodes','Anomaly + behavioural AI','Automated blocking','90-day forensic storage','SIEM push + multi-channel alerts','Custom SOAR playbooks','SSO / SAML'], off:['Dedicated SOC'], feat:true },
  { tier:'Enterprise', price:null, period:'volume pricing · annual contract', desc:'For large enterprises and MSSPs with unlimited nodes.', feats:['Unlimited nodes','Full AI + custom models','Sub-10ms response SLA','12-month+ forensic storage','Dedicated SOC team','On-premise / air-gap','Custom compliance reporting'], off:[] },
];

const THREAT_TYPES = ['SQL Injection','Port Scan','Brute Force','DNS Tunnelling','Ransomware C2','XSS Attempt','DDoS','Credential Stuffing'];
const ORIGINS = ['45.33.32.156','192.168.1.44','103.21.244.0','198.51.100.4','203.0.113.77','185.220.101.5'];
const STATUSES = ['BLOCKED','BLOCKED','BLOCKED','ANALYZING','CRITICAL'];
const SEVS = ['LOW','MED','HIGH','CRITICAL'];
const ST_COLOR = { BLOCKED:'st-green', ANALYZING:'st-amber', CRITICAL:'st-red' };
const SEV_COLOR = { LOW:'sev-low', MED:'sev-med', HIGH:'sev-high', CRITICAL:'sev-crit' };
function randThreat(id) {
  return { id, time: new Date().toTimeString().slice(0,8), type: THREAT_TYPES[Math.floor(Math.random()*THREAT_TYPES.length)], origin: ORIGINS[Math.floor(Math.random()*ORIGINS.length)], status: STATUSES[Math.floor(Math.random()*STATUSES.length)], sev: SEVS[Math.floor(Math.random()*SEVS.length)] };
}

/* ─── COMPONENTS ─── */

function Logo() {
  return (
    <div className="logo">
      <div className="logo-icon" />
      <span className="logo-text">Net<span>Shield</span> AI</span>
    </div>
  );
}

function Navbar({ page, setPage }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <button onClick={() => setPage('home')} style={{background:'none',border:'none'}}><Logo /></button>
        <ul className="nav-links">
          {['Features','How it works','Detection','Pricing'].map(l => (
            <li key={l}><a onClick={() => setPage('home')} href="#">{l}</a></li>
          ))}
        </ul>
        <div className="nav-actions">
          <button className="btn-ghost" onClick={() => setPage('login')}>Sign in</button>
          <button className="btn-blue" onClick={() => setPage('register')}>Start free trial →</button>
        </div>
      </div>
    </nav>
  );
}

function HeroVisual() {
  return (
    <div className="hero-visual">
      <div className="threat-map">
        <div className="map-hdr">
          <span className="map-title">Global Threat Map — Live</span>
          <span className="map-live"><span className="live-dot" />MONITORING</span>
        </div>
        <svg className="net-svg" viewBox="0 0 460 200">
          <defs>
            <radialGradient id="gb" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25"/><stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/></radialGradient>
            <radialGradient id="gr" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#f87171" stopOpacity="0.35"/><stop offset="100%" stopColor="#f87171" stopOpacity="0"/></radialGradient>
          </defs>
          <line x1="0" y1="50"  x2="460" y2="50"  stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          <line x1="0" y1="100" x2="460" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          <line x1="0" y1="150" x2="460" y2="150" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          <line x1="230" y1="0" x2="230" y2="200"  stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          <line x1="115" y1="0" x2="115" y2="200"  stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          <line x1="345" y1="0" x2="345" y2="200"  stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
          <line x1="230" y1="100" x2="90"  y2="52"  stroke="rgba(96,165,250,0.2)"  strokeWidth="1" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="0;-16" dur="2s"   repeatCount="indefinite"/></line>
          <line x1="230" y1="100" x2="368" y2="46"  stroke="rgba(96,165,250,0.2)"  strokeWidth="1" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="0;-16" dur="2.5s" repeatCount="indefinite"/></line>
          <line x1="230" y1="100" x2="55"  y2="145" stroke="rgba(96,165,250,0.15)" strokeWidth="1" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="0;-16" dur="3s"   repeatCount="indefinite"/></line>
          <line x1="230" y1="100" x2="405" y2="162" stroke="rgba(96,165,250,0.15)" strokeWidth="1" strokeDasharray="4 4"><animate attributeName="stroke-dashoffset" values="0;-16" dur="1.8s" repeatCount="indefinite"/></line>
          <line x1="230" y1="100" x2="172" y2="172" stroke="rgba(248,113,113,0.35)" strokeWidth="1.5" strokeDasharray="3 3"><animate attributeName="stroke-dashoffset" values="0;-12" dur="1.2s" repeatCount="indefinite"/></line>
          <circle cx="230" cy="100" r="36" fill="url(#gb)"/>
          <circle cx="172" cy="172" r="16" fill="url(#gr)"/>
          <circle cx="230" cy="100" r="14" fill="rgba(26,86,219,0.12)" stroke="rgba(96,165,250,0.4)" strokeWidth="1.5"/>
          <circle cx="230" cy="100" r="8"  fill="#1a56db"/>
          <circle cx="230" cy="100" r="3.5" fill="#fff"/>
          <circle cx="230" cy="100" r="20" fill="none" stroke="rgba(96,165,250,0.15)" strokeWidth="1"><animate attributeName="r" values="14;30" dur="3s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.3;0" dur="3s" repeatCount="indefinite"/></circle>
          <circle cx="90"  cy="52"  r="6"  fill="rgba(52,211,153,0.2)" stroke="rgba(52,211,153,0.5)" strokeWidth="1.2"/><circle cx="90"  cy="52"  r="2.8" fill="#34d399"/>
          <circle cx="368" cy="46"  r="6"  fill="rgba(52,211,153,0.2)" stroke="rgba(52,211,153,0.5)" strokeWidth="1.2"/><circle cx="368" cy="46"  r="2.8" fill="#34d399"/>
          <circle cx="55"  cy="145" r="5"  fill="rgba(96,165,250,0.2)"  stroke="rgba(96,165,250,0.4)"  strokeWidth="1"/><circle cx="55"  cy="145" r="2.4" fill="#60a5fa"/>
          <circle cx="405" cy="162" r="5"  fill="rgba(96,165,250,0.2)"  stroke="rgba(96,165,250,0.4)"  strokeWidth="1"/><circle cx="405" cy="162" r="2.4" fill="#60a5fa"/>
          <circle cx="172" cy="172" r="7"  fill="rgba(248,113,113,0.2)" stroke="rgba(248,113,113,0.6)" strokeWidth="1.5"><animate attributeName="strokeOpacity" values="0.6;0.2;0.6" dur="1.5s" repeatCount="indefinite"/></circle>
          <circle cx="172" cy="172" r="3.2" fill="#f87171"/>
          <text x="140" y="187" fontFamily="monospace" fontSize="7" fill="rgba(248,113,113,0.7)">BLOCKED</text>
          <text x="218" y="91"  fontFamily="monospace" fontSize="7" fill="rgba(255,255,255,0.25)" textAnchor="middle">CORE</text>
        </svg>
        <div className="map-stats">
          <div className="map-stat"><div className="stat-v g">99.98%</div><div className="stat-l">Uptime SLA</div></div>
          <div className="map-stat"><div className="stat-v r">2,847</div><div className="stat-l">Blocked today</div></div>
          <div className="map-stat"><div className="stat-v a">1.2ms</div><div className="stat-l">Avg response</div></div>
        </div>
      </div>
      <div className="alert-float">
        <div className="af-icon">🛡️</div>
        <div><div className="af-title">Intrusion blocked</div><div className="af-sub">192.168.0.44 — SQL injection</div></div>
      </div>
    </div>
  );
}

function LiveLog() {
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const scrollRef = useRef();
  let idx = 0;
  useEffect(() => {
    const t = setInterval(() => {
      setLogs(prev => [...prev.slice(-10), MORE_LOGS[idx % MORE_LOGS.length]]);
      idx++;
    }, 2800);
    return () => clearInterval(t);
  }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [logs]);
  return (
    <div className="log-box">
      <div className="log-hdr"><span>system activity log</span><span>engine v4.1.0</span></div>
      <div className="log-scroll" ref={scrollRef}>
        {logs.map((l, i) => (
          <div className="log-line" key={i}>
            <span className="log-t">{l.t}</span>
            <span className={'log-b lb-${l.b}'}>{l.b.toUpperCase()}</span>
            <span className="log-m">{l.m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage({ setPage }) {
  const [activeStep, setActiveStep] = useState(0);
  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot"/>Active threat monitoring — 24/7</div>
          <h1>Network security<br/>powered by <em>real&#8209;time AI</em></h1>
          <p className="hero-desc">NetShield AI detects, classifies, and neutralises network threats before they reach your infrastructure — with zero-delay response and full forensic visibility.</p>
          <div className="hero-btns">
            <button className="btn-navy" onClick={() => setPage('register')}>Get started free →</button>
            <a href="#how" className="btn-outline">See how it works</a>
          </div>
          <div className="trust-row">
            <span className="trust-item"><span className="trust-check">✓</span> SOC 2 Type II</span>
            <span className="trust-div"/>
            <span className="trust-item"><span className="trust-check">✓</span> No credit card</span>
            <span className="trust-div"/>
            <span className="trust-item"><span className="trust-check">✓</span> 14-day free trial</span>
          </div>
        </div>
        <HeroVisual />
      </section>

      {/* LOGOS */}
      <div className="logos-bar">
        <div className="logos-inner">
          <span className="logos-label">Trusted by security teams at</span>
          <div className="logos-track">
            {['Accenture','Deloitte','Palantir','Cloudflare','Palo Alto','CrowdStrike'].map(l => <span className="logo-brand" key={l}>{l}</span>)}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <section className="section feat-bg" id="features">
        <div className="s-inner">
          <div className="s-hdr">
            <div className="tag">Platform capabilities</div>
            <h2>Every layer of your network,<br/><em>always protected</em></h2>
            <p className="s-sub">From perimeter defence to internal lateral movement — NetShield AI monitors and responds across your entire attack surface.</p>
          </div>
          <div className="feat-grid">
            {FEATURES.map(f => (
              <div className="feat-card" key={f.n} data-n={f.n}>
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-name">{f.name}</div>
                <p className="feat-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* HOW IT WORKS */}
<section className="section how-bg" id="how">
  <div className="s-inner">
    <div className="how-grid">
      <div>
        <div className="s-hdr">
          <div className="tag">How it works</div>
          <h2>Detection to response<br/>in <em>milliseconds</em></h2>
          <p className="s-sub">
            Four stages that run continuously, silently, and autonomously.
          </p>
        </div>

        <div className="how-steps">
          {HOW_STEPS.map((s, i) => (
            <div
              key={s.n}
              className={`step ${activeStep === i ? 'active' : ''}`}
              onMouseEnter={() => setActiveStep(i)}
            >
              <div className="step-n">{s.n}</div>
              <div>
                <div className="step-title">{s.title}</div>
                <p className="step-desc">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  </div>
</section>

      {/* METRICS */}
      <section className="section metrics-bg">
        <div className="s-inner">
          <div className="s-hdr">
            <div className="tag">By the numbers</div>
            <h2>Performance you can<br/><em style={{color:'#60a5fa'}}>measure and trust</em></h2>
          </div>
          <div className="metric-grid">
            {[
              { num:'99.97%', lbl:'Detection accuracy (vs. red team)', w:'99.97%', c:'#34d399' },
              { num:'38ms',   lbl:'Average automated response time',   w:'92%',    c:'#60a5fa' },
              { num:'0.02%',  lbl:'False positive rate',                w:'98%',    c:'#a78bfa' },
              { num:'4.2B',   lbl:'Events analysed per day globally',   w:'85%',    c:'#fbbf24' },
            ].map(m => (
              <div className="metric-card" key={m.num}>
                <div className="metric-num">{m.num}</div>
                <div className="metric-lbl">{m.lbl}</div>
                <div className="metric-bar"><div className="metric-fill" style={{width:m.w,background:m.c}}/></div>
              </div>
            ))}
          </div>
          <div className="t-grid">
            {[
              { q:'"NetShield AI cut our mean time to detect from 4 hours to under a minute. The ROI was immediate."', name:'James Sullivan', role:'CISO, Meridian Financial Group', init:'JS', c:'#1a56db' },
              { q:'"The behavioural detection caught an insider threat our SIEM had been blind to for six weeks."', name:'Ananya Rao', role:'VP Engineering, TrustCore Systems', init:'AR', c:'#0d9488' },
            ].map(t => (
              <div className="t-card" key={t.name}>
                <p className="t-quote">{t.q}</p>
                <div className="t-author"><div className="t-av" style={{background:t.c}}>{t.init}</div><div><div className="t-name">{t.name}</div><div className="t-role">{t.role}</div></div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      {PLANS.map((p) => (
  <div className={`price-card ${p.feat ? "feat" : ""}`} key={p.tier}>
    
    {p.feat && (
      <div className="price-badge">Most popular</div>
    )}

    <div className="plan-tier">{p.tier}</div>

    <div className="plan-price-row">
      {p.price ? (
        <>
          <span className="p-dollar">$</span>
          <span className="p-amount">{p.price}</span>
        </>
      ) : (
        <span className="p-amount" style={{ fontSize: "2rem" }}>
          Custom
        </span>
      )}
    </div>

    <div className="p-period">{p.period}</div>

    <p className="p-desc">{p.desc}</p>

    <ul className="p-feats">
      {p.feats.map((f) => (
        <li key={f}>{f}</li>
      ))}

      {p.off.map((f) => (
        <li key={f} className="off">
          {f}
        </li>
      ))}
    </ul>

  </div>
))}


      {/* CTA */}
      <section className="cta-sec">
        <div className="cta-inner">
          <div>
            <div className="tag" style={{color:'#60a5fa'}}>Get started today</div>
            <h2>Stop threats before<br/><em style={{color:'#60a5fa'}}>they reach you</em></h2>
            <p className="s-sub" style={{color:'rgba(255,255,255,0.5)'}}>Deploy in 30 minutes. See real threats on day one.</p>
          </div>
          <div className="cta-btns">
            <button className="btn-white" onClick={() => setPage('register')}>Start free 14-day trial →</button>
            <button className="btn-woutline">Schedule a demo</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="ft-inner">
          <div className="ft-top">
            <div>
              <div className="ft-logo-row"><div className="ft-logo-icon"/><span className="ft-logo-text">Net<span>Shield</span> AI</span></div>
              <p className="ft-tagline">AI-driven network threat detection and automated response for modern security teams.</p>
              <div className="ft-certs"><span className="cert">SOC 2 TYPE II</span><span className="cert">ISO 27001</span><span className="cert">GDPR</span></div>
            </div>
            {[
              { title:'Product', links:['Features','Integrations','Pricing','Changelog','Roadmap'] },
              { title:'Resources', links:['Documentation','API Reference','Threat Library','Blog','Security Research'] },
              { title:'Company', links:['About','Careers','Partners','Contact','Status'] },
            ].map(col => (
              <div key={col.title}>
                <div className="ft-col-title">{col.title}</div>
                <ul className="ft-links">{col.links.map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
              </div>
            ))}
          </div>
          <div className="ft-bottom">
            <span>© 2025 NetShield AI, Inc. All rights reserved.</span>
            <div className="ft-bottom-links">{['Privacy','Terms','Cookie Policy','Security'].map(l => <a href="#" key={l}>{l}</a>)}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LoginPage({ setPage }) {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = e => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setPage('dashboard'); }, 1200); };
  return (
    <div className="auth-page">
      <div className="auth-left">
        <button onClick={() => setPage('home')} style={{background:'none',border:'none'}} className="auth-logo"><div className="al-icon"/><span>Net<span>Shield</span> AI</span></button>
        <div className="auth-stats">
          <div className="as-card"><div className="as-val g">99.97%</div><div className="as-lbl">Detection accuracy</div></div>
          <div className="as-card"><div className="as-val">38ms</div><div className="as-lbl">Avg response</div></div>
          <div className="as-card"><div className="as-val r">2,847</div><div className="as-lbl">Blocked today</div></div>
        </div>
        <blockquote className="auth-quote">"NetShield AI cut our mean time to detect from 4 hours to under a minute."<cite>— James Sullivan, CISO at Meridian Financial</cite></blockquote>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Welcome back</h2>
          <p>Sign in to your NetShield AI account</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Work email</label>
              <input type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required/>
            </div>
            <div className="form-group">
              <label>Password <a href="#" className="flink">Forgot password?</a></label>
              <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required/>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in →'}</button>
          </form>
          <p className="auth-switch">No account? <a onClick={() => setPage('register')} href="#">Start free trial</a></p>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ setPage }) {
  const [form, setForm] = useState({ name:'', email:'', password:'', company:'' });
  const [loading, setLoading] = useState(false);
  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});
  const handleSubmit = e => { e.preventDefault(); setLoading(true); setTimeout(() => { setLoading(false); setPage('dashboard'); }, 1200); };
  return (
    <div className="auth-page">
      <div className="auth-left">
        <button onClick={() => setPage('home')} style={{background:'none',border:'none'}} className="auth-logo"><div className="al-icon"/><span>Net<span>Shield</span> AI</span></button>
        <div className="auth-perks">
          {['14-day free trial, no credit card','Deploy in under 30 minutes','SOC 2 Type II certified','Cancel anytime'].map(p => (
            <div className="auth-perk" key={p}><span className="perk-c">✓</span>{p}</div>
          ))}
        </div>
        <blockquote className="auth-quote">"The behavioural detection caught an insider threat our SIEM had been blind to for six weeks."<cite>— Ananya Rao, VP Engineering, TrustCore</cite></blockquote>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrap">
          <h2>Start free trial</h2>
          <p>14 days free. No credit card required.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label>Full name</label><input type="text" name="name" placeholder="Jane Smith" value={form.name} onChange={handleChange} required/></div>
              <div className="form-group"><label>Company</label><input type="text" name="company" placeholder="Acme Corp" value={form.company} onChange={handleChange} required/></div>
            </div>
            <div className="form-group"><label>Work email</label><input type="email" name="email" placeholder="you@company.com" value={form.email} onChange={handleChange} required/></div>
            <div className="form-group"><label>Password</label><input type="password" name="password" placeholder="Min. 8 characters" value={form.password} onChange={handleChange} required/></div>
            <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Creating account...' : 'Create free account →'}</button>
            <p className="form-terms">By signing up you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
          </form>
          <p className="auth-switch">Already have an account? <a onClick={() => setPage('login')} href="#">Sign in</a></p>
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ setPage }) {
  const [threats, setThreats] = useState(() => Array.from({length:8}, (_,i) => randThreat(i)));
  const [blocked, setBlocked] = useState(2847);
  const [activeNav, setActiveNav] = useState('Overview');

  useEffect(() => {
    const t = setInterval(() => {
      setThreats(prev => [randThreat(Date.now()), ...prev.slice(0,11)]);
      setBlocked(prev => prev + Math.floor(Math.random()*3));
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const navItems = [
    {label:'Overview', icon:'⊞'}, {label:'Threat Feed', icon:'⚡'},
    {label:'Network Map', icon:'🗺'}, {label:'Forensics', icon:'🔬'},
    {label:'Playbooks', icon:'⚙'}, {label:'Settings', icon:'⚙️'},
  ];

  return (
    <div className="db-layout">
  <aside className="db-side">
    <button
      onClick={() => setPage("home")}
      style={{ background: "none", border: "none", textAlign: "left" }}
      className="db-side-logo"
    >
      <div className="dsl-icon" />
      <span>
        Net<span>Shield</span>
      </span>
    </button>

    <nav className="db-nav">
      {navItems.map((n) => (
        <button
          key={n.label}
          className={`db-nav-btn ${activeNav === n.label ? "active" : ""}`}
          onClick={() => setActiveNav(n.label)}
        >
          <span>{n.icon}</span>
          {n.label}
        </button>
      ))}
    </nav>

    <div className="db-side-foot">
      <div className="db-user">
        <div className="db-avatar">JD</div>
        <div>
          <div className="db-uname">Jane Doe</div>
          <div className="db-urole">Security Admin</div>
        </div>
      </div>
    </div>
  </aside>

  <main className="db-main">
    <header className="db-topbar">
      <div>
        <div className="db-pg-title">{activeNav}</div>
        <div className="db-pg-sub">Last updated: just now</div>
      </div>

      <div className="db-tb-acts">
        <div className="live-badge">
          <span className="live-badge-dot" />
          LIVE
        </div>
        <button className="db-tb-btn">+ Add Playbook</button>
      </div>
    </header>

    <div className="db-kpi">
      {[
        { label: "Threats Blocked", val: blocked.toLocaleString(), delta: "+142 today", cls: "kv-green" },
        { label: "Active Alerts", val: "4", delta: "2 critical", cls: "kv-red" },
        { label: "Nodes Monitored", val: "1,240", delta: "All healthy", cls: "kv-blue" },
        { label: "Avg Response", val: "38ms", delta: "↓ 2ms vs yesterday", cls: "kv-teal" },
      ].map((k) => (
        <div className="kpi-card" key={k.label}>
          <div className="kpi-label">{k.label}</div>
          <div className={`kpi-val ${k.cls}`}>{k.val}</div>
          <div className="kpi-delta">{k.delta}</div>
        </div>
      ))}
    </div>

    <div className="db-body">
      {/* Threat feed */}
      <div className="db-panel feed-panel">
        <div className="db-ph">
          <span className="db-pt">Live Threat Feed</span>
          <div className="live-badge" style={{ fontSize: "0.62rem", padding: "3px 8px" }}>
            <span className="live-badge-dot" />
            LIVE
          </div>
        </div>

        <table className="threat-tbl">
          <thead>
            <tr>
              <th>Time</th>
              <th>Threat Type</th>
              <th>Origin IP</th>
              <th>Severity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {threats.map((t) => (
              <tr className="tr-row" key={t.id}>
                <td className="td-mono">{t.time}</td>
                <td className="td-type">{t.type}</td>
                <td className="td-mono" style={{ color: "var(--text-mid)" }}>
                  {t.origin}
                </td>
                <td>
                  <span className={`sev ${SEV_COLOR[t.sev]}`}>{t.sev}</span>
                </td>
                <td>
                  <span className={`st-badge ${ST_COLOR[t.status]}`}>{t.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Right column */}
      <div className="db-right">
        <div className="db-panel">
          <div className="db-ph">
            <span className="db-pt">Threat Breakdown</span>
          </div>

          <div className="bd-list">
            {[
              { name: "Malware & Ransomware", pct: 88, c: "#f87171" },
              { name: "Brute Force", pct: 72, c: "#fb923c" },
              { name: "Phishing / C2", pct: 64, c: "#fbbf24" },
              { name: "DDoS", pct: 45, c: "#60a5fa" },
              { name: "Insider Threats", pct: 28, c: "#a78bfa" },
            ].map((b) => (
              <div className="bd-item" key={b.name}>
                <div className="bd-info">
                  <span className="bd-name">{b.name}</span>
                  <span className="bd-pct" style={{ color: b.c }}>
                    {b.pct}%
                  </span>
                </div>

                <div className="bd-bar">
                  <div
                    className="bd-fill"
                    style={{ width: `${b.pct}%`, background: b.c }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="db-panel">
          <div className="db-ph">
            <span className="db-pt">Active Alerts</span>
            <span className="pb-red">4</span>
          </div>

          <div className="al-list">
            {[
              { title: "Ransomware C2 detected", detail: "host-44 → 198.51.100.4", cls: "al-red", time: "0m ago" },
              { title: "DNS tunnelling suspected", detail: "host-22 — entropy 8.4", cls: "al-red", time: "2m ago" },
              { title: "Unusual egress volume", detail: "host-07 → 3.2GB/hr", cls: "al-amber", time: "8m ago" },
              { title: "Failed logins spike", detail: "host-15 — 342 attempts", cls: "al-amber", time: "14m ago" },
            ].map((a) => (
              <div className={`al-row ${a.cls}`} key={a.title}>
                <div>
                  <div className="al-rtitle">{a.title}</div>
                  <div className="al-detail">{a.detail}</div>
                </div>
                <span className="al-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </main>
</div>
  );}

/* ─── APP ─── */
export default function App() {
  const [page, setPage] = useState("home");

  return (
    <>
      {page === "home" && (
        <>
          <Navbar page={page} setPage={setPage} />
          <HomePage setPage={setPage} />
        </>
      )}

      {page === "login" && <LoginPage setPage={setPage} />}

      {page === "register" && <RegisterPage setPage={setPage} />}

      {page === "dashboard" && <DashboardPage setPage={setPage} />}
    </>
  );
}
