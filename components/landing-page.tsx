import { ArrowRight, ArrowUpRight, Copy } from 'lucide-react';

import { categories, tools } from '@/data/tools';

const featuredIds = new Set(['subnet-calculator', 'dns-lookup', 'spf-checker', 'hash-generator']);

export function LandingPage() {
  return (
    <main className="product-home">
      <header className="home-nav">
        <a className="home-brand" href="/">
          <span className="home-brand-mark">MS</span>
          <span><strong>Network Engineer Toolbox</strong><small>Practical network utilities</small></span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#tools">Tools</a>
          <a href="/about">About</a>
          <a href="https://msyaddin.cloud" target="_blank" rel="noreferrer">Portfolio <ArrowUpRight size={13} /></a>
        </nav>
        <a className="home-nav-action" href="/toolbox">Open toolbox <ArrowRight size={14} /></a>
      </header>

      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-kicker">Network Engineer Toolbox</p>
          <h1>Practical network calculations, diagnostics, and references.</h1>
          <p className="home-intro">A collection of tools for subnetting, DNS, email authentication, encoding, cryptography, and everyday network engineering tasks.</p>
          <div className="home-actions">
            <a className="home-primary-action" href="/toolbox">Open toolbox <ArrowRight size={15} /></a>
            <a className="home-secondary-action" href="#tools">Browse tools</a>
          </div>
        </div>

        <div className="subnet-preview" aria-label="Subnet calculator preview">
          <div className="preview-heading"><div><h2>Subnet calculator</h2><p>Calculate an IPv4 network from CIDR notation.</p></div></div>
          <div className="preview-field"><span>IP address</span><div className="preview-input"><code>192.168.10.42/24</code></div></div>
          <div className="preview-primary-result"><span>Network</span><code>192.168.10.0/24</code></div>
          <dl className="preview-results">
            <div><dt>Broadcast address</dt><dd><code>192.168.10.255</code><Copy size={13} /></dd></div>
            <div><dt>Subnet mask</dt><dd><code>255.255.255.0</code><Copy size={13} /></dd></div>
            <div><dt>Usable host range</dt><dd><code>192.168.10.1 – 192.168.10.254</code><Copy size={13} /></dd></div>
            <div><dt>Usable hosts</dt><dd><code>254</code></dd></div>
          </dl>
        </div>
      </section>

      <section className="home-directory" id="tools">
        <div className="home-section-heading"><div><p>Tools</p><h2>Everything in one clear directory.</h2></div><p>Choose a category, then open the workspace to use any of the {tools.length} available tools.</p></div>
        <div className="directory-groups">
          {categories.map((category) => {
            const group = tools.filter((tool) => tool.category === category.name);
            return (
              <section className="directory-group" key={category.name}>
                <header><h3>{category.name}</h3><p>{category.description}</p></header>
                <div>
                  {group.map((tool) => (
                    <a href={`/toolbox?tool=${tool.id}`} key={tool.id}>
                      <span><strong>{tool.name}</strong><small>{tool.description}</small></span>
                      {featuredIds.has(tool.id) && <em>Popular</em>}
                      <ArrowRight size={15} />
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="home-note">
        <div><p>Built for everyday work</p><h2>Engineering depth, without the visual noise.</h2></div>
        <p>Calculations stay detailed, technical values stay readable, and every screen is designed to help you reach the next useful answer.</p>
        <a href="/toolbox">Start with the subnet calculator <ArrowRight size={14} /></a>
      </section>

      <footer className="home-footer">
        <div><strong>Network Engineer Toolbox</strong><span>Built by Muhammad Syawalludin</span></div>
        <nav><a href="https://msyaddin.cloud" target="_blank" rel="noreferrer">msyaddin.cloud</a><a href="https://github.com/0x000TheNULL/Net-Tools" target="_blank" rel="noreferrer">GitHub</a></nav>
      </footer>
    </main>
  );
}
