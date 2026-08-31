import Link from 'next/link';
import {
  ArrowRight, Binary, Braces, Cable, Check, ChevronRight, Command,
  Copy, Gauge, Globe2, MailCheck, Network, Search, ShieldCheck, Star,
  TerminalSquare, Zap,
} from 'lucide-react';

import { categories, tools } from '@/data/tools';
import { ToolIcon } from '@/features/tools/tool-surface';

const categoryIcons = { 'IP & Subnet': Network, DNS: Globe2, Email: MailCheck, Network: Cable, Encoding: Braces };

export function LandingPage() {
  const featured = tools.filter((tool) => tool.featured).slice(0, 6);
  return (
    <main className="landing">
      <header className="landing-nav">
        <Link className="landing-brand" href="/"><span><Network size={17} /></span><b>NETWORK ENGINEER <em>TOOLBOX</em></b></Link>
        <nav aria-label="Main navigation"><a href="#features">Features</a><a href="#categories">Categories</a><Link href="/about">About</Link></nav>
        <Link className="nav-cta" href="/toolbox">Open toolbox <ArrowRight size={14} /></Link>
      </header>

      <section className="hero-section">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="hero-kicker"><span /><b>22 ENGINEERING UTILITIES</b><small>READY</small></div>
          <h1>Your network workbench.<br /><em>Sharper by design.</em></h1>
          <p>A precision command center for IP calculations, DNS diagnostics, email authentication, and daily infrastructure work.</p>
          <div className="hero-actions"><Link className="primary-cta" href="/toolbox">Launch toolbox <ArrowRight size={15} /></Link><a className="secondary-cta" href="#features">Explore the system <ChevronRight size={14} /></a></div>
          <div className="hero-trust"><span><Check size={12} /> Local-first calculations</span><span><Check size={12} /> Live encrypted DNS</span><span><Check size={12} /> Keyboard-driven</span></div>
        </div>

        <div className="hero-console" aria-label="Toolbox interface preview">
          <div className="console-chrome"><div><span /><span /><span /></div><b>NETOPS / SUBNET</b><div><Search size={12} /><kbd>⌘ K</kbd></div></div>
          <div className="console-body">
            <aside><span className="preview-brand"><Network size={15} /></span>{[Network, Globe2, MailCheck, Cable, Binary].map((Icon, index) => <i className={index === 0 ? 'active' : ''} key={index}><Icon size={14} /></i>)}</aside>
            <div className="console-work">
              <div className="preview-head"><div><span>IP & SUBNET / 01</span><h2>Subnet Calculator</h2></div><Star size={14} /></div>
              <div className="preview-inputs"><label><span>IP ADDRESS</span><b>192.168.10.42</b></label><label><span>PREFIX</span><b>/24</b></label><button>CALCULATE <ArrowRight size={11} /></button></div>
              <div className="preview-result">
                <div className="preview-result-head"><span>RESOLVED NETWORK</span><b><Check size={10} /> VALID</b></div>
                <div className="preview-matrix">
                  {[['NETWORK','192.168.10.0'],['BROADCAST','192.168.10.255'],['MASK','255.255.255.0'],['USABLE HOSTS','254']].map(([label,value]) => <div key={label}><span>{label}</span><code>{value}</code><Copy size={10} /></div>)}
                </div>
              </div>
            </div>
            <div className="console-rail">
              <span>PINNED</span>
              {[[Globe2,'DNS lookup'],[ShieldCheck,'DMARC'],[TerminalSquare,'Port reference']].map(([Icon,name]) => { const ItemIcon = Icon as typeof Globe2; return <div key={String(name)}><i><ItemIcon size={12} /></i><b>{String(name)}</b><ChevronRight size={10} /></div>; })}
              <span className="trace-label">AUTH TRACE</span>
              <div className="auth-mini"><b>SPF <em>PASS</em></b><b>DKIM <em>PASS</em></b><b>DMARC <em>PASS</em></b></div>
              <div className="node-trace"><i /><i /><i /><i /></div>
            </div>
          </div>
          <div className="console-foot"><span><i /> WORKSPACE READY</span><b>LOCAL / SECURE / FAST</b></div>
        </div>
      </section>

      <section className="signal-strip"><div><span>01</span><b>IP PLANNING</b></div><div><span>02</span><b>DNS OPERATIONS</b></div><div><span>03</span><b>MAIL AUTH</b></div><div><span>04</span><b>QUICK REFERENCE</b></div><div><span>05</span><b>ENCODING</b></div></section>

      <section id="features" className="landing-section features-section">
        <div className="section-heading"><div><span>01 / CORE SYSTEM</span><h2>Everything you reach for.<br />Nothing you don’t.</h2></div><p>Each utility is designed as a focused engineering surface—not a generic form dropped into a card.</p></div>
        <div className="feature-grid">
          {featured.map((tool, index) => (
            <Link className={index === 0 ? 'feature-card feature-primary' : 'feature-card'} href="/toolbox" key={tool.id}>
              <div className="feature-top"><span><ToolIcon id={tool.id} size={19} /></span><small>0{index + 1}</small></div>
              <h3>{tool.name}</h3><p>{tool.description}</p><div><b>{tool.category}</b><ArrowRight size={14} /></div>
            </Link>
          ))}
        </div>
      </section>

      <section id="categories" className="landing-section category-section">
        <div className="section-heading"><div><span>02 / INFORMATION ARCHITECTURE</span><h2>Organized like an<br />engineer thinks.</h2></div><p>Search globally, move by category, pin daily tools, or use the command palette. Your recent work stays one click away.</p></div>
        <div className="category-grid">
          {categories.map((category, index) => { const Icon = categoryIcons[category.name]; return (
            <div className="category-card" key={category.name}><div><span>0{index + 1}</span><Icon size={20} /></div><h3>{category.name}</h3><p>{category.description}</p><small>{tools.filter((tool) => tool.category === category.name).length} UTILITIES</small></div>
          ); })}
        </div>
      </section>

      <section className="landing-section workflow-section">
        <div className="workflow-copy"><span>03 / BUILT FOR FLOW</span><h2>Less hunting.<br />More resolving.</h2><p>Fast inputs, structured outputs, clear validation, and one-click copy actions. Every interaction is tuned for the few minutes between identifying a problem and fixing it.</p><Link href="/toolbox">Enter the workspace <ArrowRight size={14} /></Link></div>
        <div className="workflow-metrics">
          <div><Gauge size={18} /><span>INTERACTION</span><b>Instant</b><small>Local tools update without server round trips.</small></div>
          <div><Command size={18} /><span>NAVIGATION</span><b>⌘ K</b><small>Every tool is available from the keyboard.</small></div>
          <div><Zap size={18} /><span>RESULTS</span><b>Structured</b><small>Readable rows, badges, tables, and exports.</small></div>
          <div><ShieldCheck size={18} /><span>POSTURE</span><b>Local-first</b><small>Payload utilities stay in your browser.</small></div>
        </div>
      </section>

      <section className="landing-cta">
        <div><span>COMMAND CENTER / READY</span><h2>Start with the tool.<br />Stay in the flow.</h2></div><Link href="/toolbox">Launch Network Engineer Toolbox <ArrowRight size={16} /></Link>
      </section>

      <footer className="landing-footer"><div className="landing-brand"><span><Network size={16} /></span><b>NETWORK ENGINEER <em>TOOLBOX</em></b></div><p>A practical engineering product built for clarity, speed, and everyday infrastructure work.</p><nav><Link href="/toolbox">Toolbox</Link><Link href="/about">About</Link><a href="#features">Features</a></nav></footer>
    </main>
  );
}
