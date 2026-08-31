import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Check, Copy, Network } from 'lucide-react';

import { categories, toolById, toolCode, tools } from '@/data/tools';

const quickIds = ['subnet-calculator', 'dns-lookup', 'email-header', 'hash-generator'];
const quickTools = quickIds.map((id) => toolById.get(id)).filter(Boolean);

export function LandingPage() {
  return (
    <main className="landing editorial-landing">
      <header className="landing-nav editorial-nav">
        <Link className="editorial-brand" href="/"><span>MS</span><div><b>MUHAMMAD SYAWALLUDIN</b><small>NETWORK ENGINEER TOOLBOX</small></div></Link>
        <nav aria-label="Main navigation"><a href="#toolbox">Toolbox</a><a href="#quick">Quick tools</a><a href="#philosophy">Philosophy</a><Link href="/about">Project note</Link></nav>
        <a className="personal-link" href="https://msyaddin.cloud" target="_blank" rel="noreferrer">PERSONAL SITE / msyaddin.cloud <ArrowUpRight size={13} /></a>
        <Link className="nav-cta" href="/toolbox">OPEN FIELD MANUAL <ArrowRight size={13} /></Link>
      </header>

      <section className="editorial-hero">
        <div className="hero-index"><span>00 / INTRODUCTION</span><span>FIELD MANUAL / 2026</span></div>
        <div className="editorial-hero-grid">
          <div className="editorial-hero-copy">
            <p className="hero-discipline">NETWORKING / DNS / EMAIL / CRYPTOGRAPHY</p>
            <h1>Tools for the part<br />of networking that<br />usually takes <em>five tabs.</em></h1>
            <p className="hero-summary">A local-first collection of calculations, diagnostics, references, and cryptographic utilities—organized like an engineer’s field notes.</p>
            <div className="hero-actions"><Link className="primary-cta" href="/toolbox">Open the toolbox <ArrowRight size={15} /></Link><Link className="text-cta" href="/about">Read the project note <ArrowRight size={13} /></Link></div>
          </div>

          <div className="hero-datasheet" aria-label="Real subnet calculation example">
            <div className="datasheet-head"><span>REAL OUTPUT / SUBNET</span><b><i /> RESOLVED</b></div>
            <div className="datasheet-address"><span>INPUT / IPv4</span><code>192.168.10.42/24</code></div>
            <div className="datasheet-grid">
              <div><span>NETWORK</span><code>192.168.10.0</code><Copy size={12} /></div>
              <div><span>BROADCAST</span><code>192.168.10.255</code><Copy size={12} /></div>
              <div><span>MASK</span><code>255.255.255.0</code><Copy size={12} /></div>
              <div className="data-emphasis"><span>USABLE HOSTS</span><strong>254</strong><small>/ 256 ADDRESSES</small></div>
            </div>
            <div className="binary-trace"><span>11000000</span><i /><span>10101000</span><i /><span>00001010</span><i /><span>00000000</span></div>
            <div className="datasheet-foot"><span>IP/001</span><span>CALCULATED LOCALLY</span><span>0 ms NETWORK ROUND TRIP</span></div>
          </div>
        </div>
        <div className="hero-ledger"><div><span>UTILITIES</span><b>{tools.length.toString().padStart(2, '0')}</b><small>FOCUSED TOOLS</small></div><div><span>PROCESSING</span><b>LOCAL</b><small>WHERE POSSIBLE</small></div><div><span>DNS TRANSPORT</span><b>DoH</b><small>ENCRYPTED LOOKUPS</small></div><div><span>CRYPTO METHODS</span><b>10</b><small>WEB CRYPTO + CODECS</small></div></div>
      </section>

      <section id="toolbox" className="editorial-section toolbox-index-section">
        <div className="editorial-section-head"><div><span>01 / TOOLBOX</span><h2>Choose a chapter.<br /><em>Get to the answer.</em></h2></div><p>Grouped by operational intent, numbered for fast recall, and searchable from anywhere in the workspace.</p></div>
        <div className="category-ledger">
          {categories.map((category, index) => (
            <Link href="/toolbox" className="category-ledger-row" key={category.name}>
              <span>{(index + 1).toString().padStart(2, '0')}</span><h3>{category.name}</h3><p>{category.description}</p><small>{tools.filter((tool) => tool.category === category.name).length.toString().padStart(2, '0')} UTILITIES</small><ArrowRight size={18} />
            </Link>
          ))}
          <Link href="/about" className="category-ledger-row"><span>06</span><h3>References</h3><p>Standards, operating principles, and the decisions behind the manual.</p><small>PROJECT NOTE</small><ArrowRight size={18} /></Link>
        </div>
      </section>

      <section id="quick" className="editorial-section quick-section">
        <div className="editorial-section-head"><div><span>02 / QUICK TOOLS</span><h2>Selected field notes.</h2></div><p>Four frequent workflows, surfaced before the rest of the index. Open the workspace for the complete set.</p></div>
        <div className="quick-ledger">
          {quickTools.map((tool, index) => tool && (
            <Link href="/toolbox" className="quick-note" key={tool.id}>
              <div className="quick-note-meta"><span>{(index + 1).toString().padStart(2, '0')}</span><small>{toolCode(tool)}</small></div>
              <div><h3>{tool.name}</h3><p>{tool.description}</p></div>
              <div className="quick-note-status"><span>{tool.category.toUpperCase()}</span>{tool.id === 'hash-generator' && <b>10 METHODS</b>}<ArrowUpRight size={16} /></div>
            </Link>
          ))}
        </div>
      </section>

      <section id="philosophy" className="editorial-section philosophy-section">
        <div className="philosophy-copy"><span>03 / PHILOSOPHY</span><h2>The interface gets quiet.<br /><em>The data gets louder.</em></h2><p>No decorative dashboards, no fake telemetry, and no sensitive crypto payloads leaving the browser. Just enough structure to move from question to defensible answer.</p><Link href="/toolbox">ENTER THE FIELD MANUAL <ArrowRight size={14} /></Link></div>
        <div className="principle-ledger">
          <div><span>01 / LOCAL FIRST</span><Check size={16} /><h3>Keep inputs close.</h3><p>IP math, formatting, encoding, hashing, and cryptography execute in your browser.</p></div>
          <div><span>02 / EXPLICIT</span><Network size={16} /><h3>Name what the method does.</h3><p>Hashes are one-way, encodings are reversible, and encryption requires keys. The UI says so.</p></div>
          <div><span>03 / OPERATIONAL</span><ArrowRight size={16} /><h3>Design for the next action.</h3><p>Structured values, one-click copy, clear failures, and references that hold up during a change window.</p></div>
        </div>
      </section>

      <footer className="editorial-footer"><div><span>DESIGNED &amp; ENGINEERED BY</span><b>MUHAMMAD SYAWALLUDIN</b></div><p>NETWORK ENGINEER TOOLBOX / INTERACTIVE ENGINEERING FIELD MANUAL</p><nav><Link href="/toolbox">Toolbox</Link><Link href="/about">Project note</Link><a href="https://msyaddin.cloud" target="_blank" rel="noreferrer">Personal site ↗</a></nav></footer>
    </main>
  );
}
