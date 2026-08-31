'use client';

import { useState, type ReactNode } from 'react';
import { Check, Copy, Download, RotateCcw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { ResultRow } from '@/types/tools';

export function Field({
  label, hint, className = '', ...props
}: React.ComponentProps<typeof Input> & { label: string; hint?: string }) {
  return (
    <label className={`work-field ${className}`}>
      <span>{label}</span>
      <Input {...props} />
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function SelectField({
  label, value, onChange, children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="work-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select>
    </label>
  );
}

export function WorkForm({ children, onSubmit }: { children: ReactNode; onSubmit?: () => void }) {
  return (
    <form className="work-form" onSubmit={(event) => { event.preventDefault(); onSubmit?.(); }}>
      {children}
    </form>
  );
}

export function FormActions({
  onRun, onReset, loading = false, runLabel = 'Run',
}: {
  onRun: () => void;
  onReset: () => void;
  loading?: boolean;
  runLabel?: string;
}) {
  return (
    <div className="form-actions">
      <Button type="button" onClick={onRun} disabled={loading}>
        {loading ? <><span className="spinner" /> Working…</> : runLabel}
      </Button>
      <Button type="button" variant="outline" onClick={onReset}><RotateCcw size={14} /> Reset</Button>
    </div>
  );
}

export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      aria-label={copied ? 'Copied' : label || 'Copy value'}
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? 'Copied' : label}
    </Button>
  );
}

export function EmptyState({ children = 'Run the tool to generate a structured result.' }: { children?: ReactNode }) {
  return <div className="empty-result"><b>No results yet</b><p>{children}</p></div>;
}

export function ErrorState({ message }: { message: string }) {
  return <div className="tool-error" role="alert"><b>Unable to complete request</b><span>{message}</span></div>;
}

export function Results({
  rows, title = 'Result', note, exportName,
}: {
  rows: ResultRow[];
  title?: string;
  note?: string;
  exportName?: string;
}) {
  const plain = rows.map((row) => `${row.label}: ${row.value}`).join('\n');
  return (
    <section className="structured-results" aria-live="polite">
      <div className="result-toolbar">
        <div><h3>{title}</h3></div>
        <div>
          {exportName && (
            <Button type="button" size="sm" variant="ghost" onClick={() => {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(new Blob([plain], { type: 'text/plain' }));
              link.download = exportName;
              link.click();
              URL.revokeObjectURL(link.href);
            }}><Download size={13} /> Export</Button>
          )}
          <CopyButton value={plain} label="Copy all" />
        </div>
      </div>
      <dl className="result-matrix">
        {rows.map((row) => (
          <div className="matrix-row" data-tone={row.tone ?? 'default'} key={row.label}>
            <dt>{row.label}</dt>
            <dd><code>{row.value}</code></dd>
            <CopyButton value={row.value} label="" />
          </div>
        ))}
      </dl>
      {note && <p className="result-note">{note}</p>}
    </section>
  );
}

export function ReferenceTable({
  headings, rows,
}: {
  headings: string[];
  rows: Array<readonly (string | number)[]>;
}) {
  return (
    <div className="reference-table">
      <table>
        <thead><tr>{headings.map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => <tr key={`${row[0]}-${index}`}>{row.map((cell, cellIndex) => <td key={cellIndex}>{String(cell)}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}
