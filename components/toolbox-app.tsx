'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight, ChevronRight, Command as CommandIcon, History, Home, Menu,
  Search, Star, X,
} from 'lucide-react';

import {
  Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput,
  CommandItem, CommandList, CommandShortcut,
} from '@/components/ui/command';
import { categories, toolById, tools } from '@/data/tools';
import { ToolIcon, ToolSurface } from '@/features/tools/tool-surface';

function readStoredList(key: string) {
  try { return JSON.parse(localStorage.getItem(key) ?? '[]') as string[]; }
  catch { return []; }
}

export function ToolboxApp() {
  const [activeId, setActiveId] = useState('subnet-calculator');
  const [query, setQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const activeTool = toolById.get(activeId) ?? tools[0];

  useEffect(() => {
    setFavorites(readStoredList('netops:favorites'));
    setRecent(readStoredList('netops:recent'));
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    const requested = new URLSearchParams(window.location.search).get('tool');
    if (requested && toolById.has(requested)) setActiveId(requested);
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
    return tools.filter((tool) => !normalized || [tool.name, tool.description, tool.category, ...tool.tags].join(' ').toLowerCase().includes(normalized));
  }, [query]);

  const openTool = (id: string) => {
    setActiveId(id);
    setCommandOpen(false);
    setNavOpen(false);
    setQuery('');
    window.history.replaceState(null, '', `/toolbox?tool=${id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => {
      const next = current.includes(id) ? current.filter((item) => item !== id) : [...current, id];
      localStorage.setItem('netops:favorites', JSON.stringify(next));
      return next;
    });
  };

  const savedTools = (ids: string[]) => ids.map((id) => toolById.get(id)).filter(Boolean);

  return (
    <main className="toolbox-shell">
      {navOpen && <button className="mobile-scrim" onClick={() => setNavOpen(false)} aria-label="Close navigation" />}
      <aside className={navOpen ? 'toolbox-sidebar is-open' : 'toolbox-sidebar'}>
        <div className="toolbox-brand">
          <Link href="/"><span className="brand-symbol">MS</span><span><b>Network Engineer Toolbox</b><small>Practical network utilities</small></span></Link>
          <button className="mobile-close" onClick={() => setNavOpen(false)} aria-label="Close navigation"><X size={18} /></button>
        </div>

        <div className="sidebar-search">
          <Search size={15} />
          <button onClick={() => setCommandOpen(true)}>Search tools...</button>
          <kbd>⌘K</kbd>
        </div>

        <nav className="side-scroll" aria-label="Tool directory">
          {favorites.length > 0 && (
            <section className="sidebar-group sidebar-saved">
              <h2><Star size={13} /> Favorites</h2>
              {savedTools(favorites).map((tool) => tool && <button key={tool.id} className={activeId === tool.id ? 'side-tool is-active' : 'side-tool'} onClick={() => openTool(tool.id)}><ToolIcon id={tool.id} size={15} /><span>{tool.shortName}</span></button>)}
            </section>
          )}

          {categories.map((category) => (
            <section className="sidebar-group" key={category.name}>
              <h2>{category.name}</h2>
              {tools.filter((tool) => tool.category === category.name).map((tool) => (
                <button key={tool.id} className={activeId === tool.id ? 'side-tool is-active' : 'side-tool'} onClick={() => openTool(tool.id)}>
                  <ToolIcon id={tool.id} size={15} /><span>{tool.shortName}</span>{favorites.includes(tool.id) && <Star size={11} className="saved-star" />}
                </button>
              ))}
            </section>
          ))}

          {recent.length > 0 && (
            <section className="sidebar-group sidebar-saved">
              <h2><History size={13} /> Recent</h2>
              {savedTools(recent.slice(0, 4)).map((tool) => tool && <button key={tool.id} className={activeId === tool.id ? 'side-tool is-active' : 'side-tool'} onClick={() => openTool(tool.id)}><ToolIcon id={tool.id} size={15} /><span>{tool.shortName}</span></button>)}
            </section>
          )}
        </nav>

        <div className="sidebar-footer"><Link href="/">Home</Link><Link href="/about">About</Link><a href="https://msyaddin.cloud" target="_blank" rel="noreferrer">Portfolio <ArrowUpRight size={12} /></a></div>
      </aside>

      <section className="toolbox-main">
        <header className="toolbox-topbar">
          <button className="mobile-menu" onClick={() => setNavOpen(true)} aria-label="Open navigation"><Menu size={19} /></button>
          <div className="mobile-product-name">Network Engineer Toolbox</div>
          <button className="mobile-search-button" onClick={() => setCommandOpen(true)} aria-label="Search tools"><Search size={18} /></button>
          <div className="global-search">
            <Search size={16} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tools..." aria-label="Search tools" />
            <button onClick={() => setCommandOpen(true)} aria-label="Open command palette"><CommandIcon size={13} /><span>⌘K</span></button>
            {query && (
              <div className="search-popover">
                <div><span>{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span><button onClick={() => setQuery('')}>Clear</button></div>
                {filtered.slice(0, 8).map((tool) => <button key={tool.id} onClick={() => openTool(tool.id)}><span className="search-icon"><ToolIcon id={tool.id} size={16} /></span><div><b>{tool.name}</b><small>{tool.category}</small></div><ChevronRight size={14} /></button>)}
                {!filtered.length && <p>No matching tools. Try “DNS” or “CIDR”.</p>}
              </div>
            )}
          </div>
          <nav className="top-links" aria-label="Main navigation"><Link href="/"><Home size={14} /> Home</Link><Link href="/about">About</Link></nav>
        </header>

        <div className="toolbox-content">
          <ToolSurface tool={activeTool} favorite={favorites.includes(activeId)} onToggleFavorite={() => toggleFavorite(activeId)} />
          <footer className="workspace-footer"><span>Network Engineer Toolbox</span><span>Built by Muhammad Syawalludin</span><a href="https://github.com/0x000TheNULL/Net-Tools" target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={12} /></a></footer>
        </div>
      </section>

      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen} title="Search tools and actions">
        <Command>
          <CommandInput placeholder="Search tools and actions" />
          <CommandList>
            <CommandEmpty>No matching tool or action.</CommandEmpty>
            <CommandGroup heading="Navigation">
              <CommandItem onSelect={() => { window.location.href = '/'; }}><Home />Home<CommandShortcut>G H</CommandShortcut></CommandItem>
              <CommandItem onSelect={() => { window.location.href = '/about'; }}>About</CommandItem>
            </CommandGroup>
            {categories.map((category) => (
              <CommandGroup heading={category.name} key={category.name}>
                {tools.filter((tool) => tool.category === category.name).map((tool) => <CommandItem key={tool.id} value={`${tool.name} ${tool.tags.join(' ')}`} onSelect={() => openTool(tool.id)}><ToolIcon id={tool.id} />{tool.name}{favorites.includes(tool.id) && <Star className="ml-auto" />}</CommandItem>)}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </main>
  );
}
