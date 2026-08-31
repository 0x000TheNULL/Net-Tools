import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';

import { categories, tools } from '@/data/tools';

export const metadata: Metadata = {
  title: 'About | Network Engineer Toolbox',
  description: 'Why Network Engineer Toolbox exists and how it supports everyday network engineering work.',
};

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-nav">
        <Link href="/"><ArrowLeft size={14} /> Back home</Link>
        <Link href="/toolbox">Open toolbox <ArrowRight size={14} /></Link>
      </header>

      <section className="about-hero">
        <p>About the project</p>
        <h1>Practical utilities for network engineers.</h1>
        <div><p>Network Engineer Toolbox brings common calculations, diagnostics, and references into one focused workspace. It is made for everyday use: clear inputs, readable results, and enough context to understand what the output means.</p><p>The engineering logic remains detailed. The interface stays calm, direct, and easy to navigate.</p></div>
      </section>

      <section className="about-principles">
        <article><h2>Clear by default</h2><p>Every screen explains what it needs and keeps technical detail close to the result.</p></article>
        <article><h2>Useful in context</h2><p>Tools cover common network, DNS, email, reference, and cryptography workflows.</p></article>
        <article><h2>Private where it matters</h2><p>Calculations, encoding, hashing, and cryptographic operations run in the browser. DNS checks use DNS-over-HTTPS.</p></article>
      </section>

      <section className="about-categories">
        <header className="about-section-head"><p>What is included</p><h2>{tools.length} tools across five categories.</h2></header>
        <div className="about-category-list">
          {categories.map((category) => (
            <div key={category.name}><h3>{category.name}</h3><p>{category.description}</p><span>{tools.filter((tool) => tool.category === category.name).length} tools</span></div>
          ))}
        </div>
      </section>

      <section className="about-final">
        <div><h2>Ready when the next network question shows up.</h2><p>Start with the subnet calculator, or search the full directory.</p></div>
        <Link href="/toolbox">Open toolbox <ArrowRight size={14} /></Link>
      </section>

      <footer className="home-footer about-footer">
        <div><strong>Network Engineer Toolbox</strong><span>Built by Muhammad Syawalludin</span></div>
        <nav><a href="https://msyaddin.cloud" target="_blank" rel="noreferrer">msyaddin.cloud <ArrowUpRight size={11} /></a><a href="https://github.com/0x000TheNULL/Net-Tools" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={11} /></a></nav>
      </footer>
    </main>
  );
}
