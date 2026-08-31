'use client';

import { useMemo, useState } from 'react';

import { decodeBase64, encodeBase64 } from '@/lib/codec';
import { commonPorts, httpStatuses, ipRanges, vlanRanges } from '@/lib/reference-data';
import type { ResultRow } from '@/types/tools';
import { EmptyState, ErrorState, Field, FormActions, ReferenceTable, Results, SelectField, WorkForm } from './shared';
import { CryptoLab } from './crypto-lab';

export function PortReference() {
  const [query, setQuery] = useState('');
  const rows = useMemo(() => commonPorts.filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <>
      <div className="reference-search"><Field label="Search ports and services" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try 443, DNS, RADIUS…" /></div>
      {rows.length ? <ReferenceTable headings={['Port', 'Protocol', 'Service', 'Engineering note']} rows={[...rows]} /> : <EmptyState>No matching port or service.</EmptyState>}
    </>
  );
}

export function HttpStatusReference() {
  const [query, setQuery] = useState('');
  const rows = useMemo(() => httpStatuses.filter((row) => row.join(' ').toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <>
      <div className="reference-search"><Field label="Search code or meaning" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="404, gateway, redirect…" /></div>
      {rows.length ? <ReferenceTable headings={['Code', 'Meaning', 'Class']} rows={[...rows]} /> : <EmptyState>No matching HTTP status.</EmptyState>}
    </>
  );
}

export function VlanReference() {
  return <ReferenceTable headings={['VLAN IDs', 'Class', 'Operational guidance']} rows={[...vlanRanges]} />;
}

export function PrivateIpReference() {
  return <ReferenceTable headings={['Range', 'Classification', 'Purpose']} rows={[...ipRanges]} />;
}

function CodecTool({ mode }: { mode: 'base64' | 'url' }) {
  const [operation, setOperation] = useState<'encode' | 'decode'>('encode');
  const [value, setValue] = useState(mode === 'base64' ? 'Network engineering, without the noise.' : 'site=network toolbox&mode=fast');
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState('');
  const run = () => {
    try {
      const output = mode === 'base64'
        ? operation === 'encode' ? encodeBase64(value) : decodeBase64(value)
        : operation === 'encode' ? encodeURIComponent(value) : decodeURIComponent(value);
      setRows([{ label: `${operation === 'encode' ? 'Encoded' : 'Decoded'} output`, value: output, tone: 'success' }]);
      setError('');
    } catch { setRows(null); setError(`Input is not valid ${mode === 'base64' ? 'Base64' : 'percent-encoded text'}.`); }
  };
  return (
    <>
      <WorkForm onSubmit={run}>
        <SelectField label="Operation" value={operation} onChange={(next) => setOperation(next as 'encode' | 'decode')}>
          <option value="encode">Encode</option><option value="decode">Decode</option>
        </SelectField>
        <label className="work-field textarea-field"><span>Input text</span><textarea value={value} onChange={(event) => setValue(event.target.value)} rows={7} spellCheck={false} /></label>
        <FormActions onRun={run} onReset={() => { setValue(''); setRows(null); setError(''); }} runLabel={operation === 'encode' ? 'Encode text' : 'Decode text'} />
      </WorkForm>
      {error ? <ErrorState message={error} /> : rows ? <Results rows={rows} title={mode === 'base64' ? 'Base64 result' : 'URL component result'} /> : <EmptyState />}
    </>
  );
}

export function Base64Tool() { return <CodecTool mode="base64" />; }
export function UrlCodecTool() { return <CodecTool mode="url" />; }

export function HashGenerator() {
  return <CryptoLab />;
}

const sampleJson = `{
  "tool": "Network Engineer Toolbox",
  "status": "ready",
  "categories": ["IP", "DNS", "Email", "Network"]
}`;

export function JsonFormatter() {
  const [value, setValue] = useState(sampleJson);
  const [indent, setIndent] = useState('2');
  const [output, setOutput] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState('');
  const run = (minify = false) => {
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, minify ? 0 : Number(indent));
      setOutput([
        { label: minify ? 'Minified JSON' : 'Formatted JSON', value: formatted, tone: 'success' },
        { label: 'Root type', value: Array.isArray(parsed) ? 'Array' : parsed === null ? 'null' : typeof parsed },
        { label: 'Characters', value: formatted.length.toLocaleString() },
      ]);
      setError('');
    } catch (reason) { setOutput(null); setError(reason instanceof Error ? reason.message : 'Invalid JSON.'); }
  };
  return (
    <>
      <WorkForm onSubmit={() => run(false)}>
        <SelectField label="Indentation" value={indent} onChange={setIndent}><option value="2">2 spaces</option><option value="4">4 spaces</option></SelectField>
        <label className="work-field textarea-field code-area"><span>JSON payload</span><textarea value={value} onChange={(event) => setValue(event.target.value)} rows={12} spellCheck={false} /></label>
        <div className="form-actions">
          <button type="submit" className="native-primary">Format & validate</button>
          <button type="button" className="native-secondary" onClick={() => run(true)}>Minify</button>
          <button type="button" className="native-secondary" onClick={() => { setValue(''); setOutput(null); setError(''); }}>Reset</button>
        </div>
      </WorkForm>
      {error ? <ErrorState message={error} /> : output ? <Results rows={output} title="Valid JSON" exportName="formatted.json" /> : <EmptyState />}
    </>
  );
}
