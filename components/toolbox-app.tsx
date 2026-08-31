'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Activity, ChevronRight, Command as CommandIcon, History, Home, Menu, Moon,
  Search, Star, Sun, X,
} from 'lucide-react';

import {
  Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandShortcut,
} from '@/components/ui/command';
import { categories, toolById, toolCode, tools } from '@/data/tools';
import { ToolIcon, ToolSurface } from '@/features/tools/tool-surface';
import type { ToolCategory } from '@/types/tools';

const categoryNumber = { 'IP & Subnet': '01', DNS: '02', Email: '03', Network: '04', Utilities: '05' } as const;

function readStoredList(key: string) {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') as string[]; }
  catch { return []; }
}

export function ToolboxApp() {
  const [activeId, setActiveId] = useState('subnet-calculator');
  const [category, setCategory] = useState<ToolCategory | 'All'>('All');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [light, setLight] = useState(false);
  const activeTool = toolById.get(activeId) ?? tools[0];

  useEffect(() => {
    setFavorites(readStoredList('netops:favorites'));
    setRecent(readStoredList('netops:recent'));
    const savedLight = localStorage.getItem('netops:theme') === 'light';
    setLight(savedLight);
    document.documentElement.classList.toggle('light', savedLight);
    const keyboard = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault(); setCommandOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', keyboard);
    return () => window.removeEventListener('keydown', keyboard);
  }, []);

  useEffect(() => {
    setRecent((current) => {
      const next = [activeId, ...current.filter((id) => id !== activeId)].slice(0, 5);
      localStorage.setItem('netops:recent', JSON.stringify(next));
      return next;
    });
  }, [activeId]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tools.filter((tool) =>
      (category === 'All' || tool.category === category) &&
      (!normalized || [tool.name, tool.description, tool.category, ...tool.tags].join(' ').toLowerCase().includes(normalized)),
    );
  }, [category, query]);

  const openTool = (id: string) => {
    setActiveId(id); setCommandOpen(false); setNavOpen(false); setQuery('');
    const nextTool = toolById.get(id);
    if (nextTool) setCategory(nextTool.category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('netops:favorites', JSON.stringify(next));
      return next;
    });
  };

  const toggleTheme = () => {
    const next = !light;
    setLight(next); document.documentElement.classList.toggle('light', next);
    localStorage.setItem('netops:theme', next ? 'light' : 'dark');
  };

  return (
    <main className="toolbox-shell">
      {navOpen && <button className="mobile-scrim" onClick={() => setNavOpen(false)} aria-label="Close navigation" />}
      <aside className={navOpen ? 'toolbox-sidebar is-open' : 'toolbox-sidebar'}>
        <div className="toolbox-brand"><span className="brand-symbol">MS</span><div><b>MUHAMMAD SYAWALLUDIN</b><small>NETWORK ENGINEER TOOLBOX</small></div><button className="mobile-close" onClick={() => setNavOpen(false)} aria-label="Close navigation"><X size={16} /></button></div>
        <div className="side-scroll">
          <p className="side-label">Field manual / chapters</p>
          <button className={category === 'All' ? 'side-link is-active' : 'side-link'} onClick={() => setCategory('All')}><i>00</i><span>Overview</span><small>{tools.length}</small></button>
          {categories.map((item) => {
            return <button key={item.name} className={category === item.name ? 'side-link is-active' : 'side-link'} onClick={() => { setCategory(item.name); const first = tools.find((tool) => tool.category === item.name); if (first) openTool(first.id); }}><i>{categoryNumber[item.name]}</i><span>{item.name}</span><small>{tools.filter((tool) => tool.category === item.name).length}</small></button>;
          })}
          <div className="side-divider" />
          <p className="side-label"><Star size={11} /> Favorites</p>
          {favorites.length ? favorites.slice(0, 5).map((id) => {
            const tool = toolById.get(id); if (!tool) return null;
            return <button key={id} className={activeId === id ? 'side-tool is-active' : 'side-tool'} onClick={() => openTool(id)}><i>{toolCode(tool)}</i><span>{tool.shortName}</span></button>;
          }) : <p className="side-empty">Pin tools you use every day.</p>}
          <p className="side-label recent-label"><History size={11} /> Recent</p>
          {recent.slice(0, 4).map((id) => {
            const tool = toolById.get(id); if (!tool) return null;
            return <button key={id} className={activeId === id ? 'side-tool is-active' : 'side-tool'} onClick={() => openTool(id)}><i>{toolCode(tool)}</i><span>{tool.shortName}</span></button>;
          })}
        </div>
        <a className="side-status" href="https://msyaddin.cloud" target="_blank" rel="noreferrer"><span>↗</span><div><b>Personal site</b><small>msyaddin.cloud</small></div></a>
      </aside>

      <section className="toolbox-main">
        <header className="toolbox-topbar">
          <button className="mobile-menu" onClick={() => setNavOpen(true)} aria-label="Open navigation"><Menu size={18} /></button>
          <div className="global-search">
            <Search size={15} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools, protocols, or tasks…" aria-label="Search tools" />
            <button onClick={() => setCommandOpen(true)}><CommandIcon size={12} /><span>⌘ K</span></button>
            {query && (
              <div className="search-popover">
                <div><span>{filtered.length} matches</span><button onClick={() => setQuery('')}>Clear</button></div>
                {filtered.slice(0, 7).map((tool) => <button key={tool.id} onClick={() => openTool(tool.id)}><span className="search-icon"><ToolIcon id={tool.id} size={15} /></span><div><b>{tool.name}</b><small>{tool.category}</small></div><ChevronRight size={14} /></button>)}
                {!filtered.length && <p>No matching tools. Try “DNS” or “CIDR”.</p>}
              </div>
            )}
          </div>
          <nav className="top-links" aria-label="Main navigation"><Link href="/"><Home size={14} /> Overview</Link><Link href="/about">Project note</Link><a href="https://msyaddin.cloud" target="_blank" rel="noreferrer">Personal site ↗</a></nav>
          <button className="icon-action" onClick={toggleTheme} aria-label={light ? 'Use dark theme' : 'Use light theme'}>{light ? <Moon size={16} /> : <Sun size={16} />}</button>
        </header>

        <div className="toolbox-content">
          <div className="workspace-meta">
            <div><span>FIELD MANUAL / {activeTool.category.toUpperCase()}</span><b>Practical utilities for the part of networking that usually takes five tabs.</b></div>
            <div className="workspace-pulse"><span /><small>Ready</small></div>
          </div>
          <div className="toolbox-layout">
            <ToolSurface tool={activeTool} favorite={favorites.includes(activeId)} onToggleFavorite={() => toggleFavorite(activeId)} />
            <aside className="tool-rail">
              <section className="rail-module">
                <div className="module-head"><span>{category === 'All' ? 'ALL TOOLS' : category.toUpperCase()}</span><b>{filtered.length.toString().padStart(2, '0')}</b></div>
                <div className="catalog-list">
                  {filtered.map((tool) => <button key={tool.id} className={activeId === tool.id ? 'catalog-tool is-active' : 'catalog-tool'} onClick={() => openTool(tool.id)}><span>{toolCode(tool)}</span><div><b>{tool.shortName}</b><small>{tool.description}</small></div>{favorites.includes(tool.id) && <Star size={11} className="catalog-star" />}</button>)}
                </div>
              </section>
              <section className="rail-module rail-insight">
                <div className="module-head"><span>ENGINEERING NOTE</span><Activity size={13} /></div>
                <p>Calculations and cryptographic operations stay on this device. DNS checks use encrypted DNS-over-HTTPS.</p>
                <div className="signal-meter"><span /><span /><span /><span /><span /></div>
              </section>
            </aside>
          </div>
        </div>
      </section>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen} title="Network Engineer Toolbox">
        <Command>
          <CommandInput placeholder="Jump to a tool or page…" />
          <CommandList>
            <CommandEmpty>No matching command.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => { window.location.href = '/'; }}><Home />Home<CommandShortcut>G H</CommandShortcut></CommandItem>
              <CommandItem onSelect={toggleTheme}>{light ? <Moon /> : <Sun />}{light ? 'Switch to dark mode' : 'Switch to light mode'}</CommandItem>
            </CommandGroup>
            {categories.map((item) => (
              <CommandGroup heading={item.name} key={item.name}>
                {tools.filter((tool) => tool.category === item.name).map((tool) => <CommandItem key={tool.id} value={`${tool.name} ${tool.tags.join(' ')}`} onSelect={() => openTool(tool.id)}><ToolIcon id={tool.id} />{tool.name}{favorites.includes(tool.id) && <Star className="ml-auto" />}</CommandItem>)}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </main>
  );
}
