import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight, Braces, Cable, Globe2, MailCheck, Network, ShieldCheck } from 'lucide-react';

import { categories, tools } from '@/data/tools';

export const metadata: Metadata = {
  title: 'About | Network Engineer Toolbox',
  description: 'Why Network Engineer Toolbox exists and how it serves infrastructure professionals.',
};

const icons = [Network, Globe2, MailCheck, Cable, Braces];

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-nav"><Link href="/"><ArrowLeft size={14} /> Back home</Link><Link href="/toolbox">Open toolbox <ArrowRight size={14} /></Link></header>
      <section className="about-hero"><span>PROJECT / 2026</span><h1>Infrastructure utilities,<br /><em>treated like a product.</em></h1><p>Network Engineer Toolbox is a daily-use workbench for network, systems, cloud, and security-minded engineers who want reliable utilities without a messy interface.</p></section>
      <section className="about-principles">
        <div><span>01</span><ShieldCheck size={19} /><h2>Precise</h2><p>Strong validation, structured output, and engineering context where it matters.</p></div>
        <div><span>02</span><Network size={19} /><h2>Practical</h2><p>Twenty-two focused utilities selected around real infrastructure workflows.</p></div>
        <div><span>03</span><Braces size={19} /><h2>Extensible</h2><p>A central registry and modular tool surfaces make new capabilities easy to add.</p></div>
      </section>
      <section className="about-categories"><div className="about-section-head"><span>AVAILABLE SYSTEMS</span><h2>Five focused categories</h2></div>{categories.map((item,index) => { const Icon=icons[index]; return <div key={item.name}><span>0{index+1}</span><Icon size={18}/><b>{item.name}</b><p>{item.description}</p><small>{tools.filter((tool)=>tool.category===item.name).length} TOOLS</small></div>; })}</section>
      <section className="about-final"><div><span>BUILT FOR</span><p>Network engineers · Systems engineers · Cloud engineers · Infrastructure teams · Security-minded admins</p></div><Link href="/toolbox">Enter the workspace <ArrowRight size={14} /></Link></section>
    </main>
  );
}
