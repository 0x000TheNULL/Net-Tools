'use client';

import { useState } from 'react';

import { cleanDnsData, parseDmarc, parseEmailHeaders, parseSpf, queryDns, type DnsAnswer } from '@/lib/dns';
import { reverseName } from '@/lib/network';
import type { ResultRow } from '@/types/tools';
import { EmptyState, ErrorState, Field, FormActions, Results, SelectField, WorkForm } from './shared';

function LoadingResult() {
  return <div className="loading-result" role="status"><span /><span /><span /><p>Querying authoritative DNS path…</p></div>;
}

function answersToRows(answers: DnsAnswer[]): ResultRow[] {
  return answers.map((answer, index) => ({
    label: `Answer ${index + 1} · TTL ${answer.TTL}s`,
    value: cleanDnsData(answer.data),
    tone: 'success',
  }));
}

export function DnsLookup({
  fixedType,
  reverse = false,
}: {
  fixedType?: 'MX' | 'TXT';
  reverse?: boolean;
}) {
  const [name, setName] = useState(reverse ? '8.8.8.8' : 'example.com');
  const [type, setType] = useState(fixedType ?? 'A');
  const [answers, setAnswers] = useState<DnsAnswer[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const lookup = async () => {
    setLoading(true); setError('');
    try {
      const queryName = reverse ? reverseName(name) : name;
      const result = await queryDns(queryName, reverse ? 'PTR' : type);
      setAnswers(result);
    } catch (reason) {
      setAnswers(null); setError(reason instanceof Error ? reason.message : 'DNS request failed.');
    } finally { setLoading(false); }
  };
  return (
    <>
      <WorkForm onSubmit={lookup}>
        <Field label={reverse ? 'IPv4 address' : 'Domain name'} value={name} onChange={(event) => setName(event.target.value)} />
        {!fixedType && !reverse && (
          <SelectField label="Record type" value={type} onChange={setType}>
            {['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'PTR'].map((recordType) => <option key={recordType}>{recordType}</option>)}
          </SelectField>
        )}
        <FormActions loading={loading} onRun={lookup} onReset={() => { setName(''); setAnswers(null); setError(''); }} runLabel="Run lookup" />
      </WorkForm>
      {loading ? <LoadingResult /> : error ? <ErrorState message={error} /> : answers?.length ? (
        <Results rows={answersToRows(answers)} title={`${reverse ? 'PTR' : type} answers for ${name}`} exportName="dns-result.txt" />
      ) : answers ? <EmptyState>No records returned. The name may exist without this record type.</EmptyState> : <EmptyState />}
    </>
  );
}

export function TxtSpfLookup() {
  const [domain, setDomain] = useState('example.com');
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const lookup = async () => {
    setLoading(true); setError('');
    try {
      const answers = await queryDns(domain, 'TXT');
      setRows(answers.map((answer, index) => {
        const value = cleanDnsData(answer.data);
        return { label: value.toLowerCase().startsWith('v=spf1') ? 'SPF policy' : `TXT record ${index + 1}`, value, tone: value.toLowerCase().startsWith('v=spf1') ? 'success' : 'default' };
      }));
    } catch (reason) { setRows(null); setError(reason instanceof Error ? reason.message : 'DNS request failed.'); }
    finally { setLoading(false); }
  };
  return (
    <>
      <WorkForm onSubmit={lookup}><Field label="Domain name" value={domain} onChange={(event) => setDomain(event.target.value)} /><FormActions loading={loading} onRun={lookup} onReset={() => { setDomain(''); setRows(null); setError(''); }} runLabel="Inspect TXT" /></WorkForm>
      {loading ? <LoadingResult /> : error ? <ErrorState message={error} /> : rows?.length ? <Results rows={rows} title="TXT record set" /> : rows ? <EmptyState>No TXT records returned.</EmptyState> : <EmptyState />}
    </>
  );
}

export function SpfChecker() {
  const [domain, setDomain] = useState('google.com');
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const check = async () => {
    setLoading(true); setError('');
    try {
      const answers = await queryDns(domain, 'TXT');
      const record = answers.map((answer) => cleanDnsData(answer.data)).find((value) => value.toLowerCase().startsWith('v=spf1'));
      if (!record) throw new Error('No SPF record found in the domain TXT set.');
      const analysis = parseSpf(record);
      setRows([
        { label: 'SPF record', value: record, tone: 'success' },
        { label: 'DNS lookup mechanisms', value: `${analysis.lookupCount} / 10`, tone: analysis.lookupCount > 10 ? 'danger' : analysis.lookupCount > 7 ? 'warning' : 'success' },
        { label: 'Terminal policy', value: analysis.terminal, tone: analysis.terminal === '-all' ? 'success' : 'warning' },
        { label: 'Mechanisms', value: analysis.mechanisms.join(' · ') },
      ]);
    } catch (reason) { setRows(null); setError(reason instanceof Error ? reason.message : 'SPF check failed.'); }
    finally { setLoading(false); }
  };
  return (
    <>
      <WorkForm onSubmit={check}><Field label="Sending domain" value={domain} onChange={(event) => setDomain(event.target.value)} /><FormActions loading={loading} onRun={check} onReset={() => { setDomain(''); setRows(null); setError(''); }} runLabel="Check SPF" /></WorkForm>
      {loading ? <LoadingResult /> : error ? <ErrorState message={error} /> : rows ? <Results rows={rows} title="SPF posture" note="Lookup count is a surface-level estimate. Nested includes may add further DNS lookups." /> : <EmptyState />}
    </>
  );
}

export function DkimHelper() {
  const [domain, setDomain] = useState('example.com');
  const [selector, setSelector] = useState('default');
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const check = async () => {
    setLoading(true); setError('');
    const queryName = `${selector.trim()}._domainkey.${domain.trim()}`;
    try {
      const answers = await queryDns(queryName, 'TXT');
      if (!answers.length) throw new Error('No DKIM TXT record found for this selector.');
      setRows([
        { label: 'Lookup name', value: queryName },
        ...answers.map((answer, index) => ({ label: `DKIM record ${index + 1}`, value: cleanDnsData(answer.data), tone: 'success' as const })),
      ]);
    } catch (reason) { setRows(null); setError(reason instanceof Error ? reason.message : 'DKIM request failed.'); }
    finally { setLoading(false); }
  };
  return (
    <>
      <WorkForm onSubmit={check}>
        <Field label="Domain name" value={domain} onChange={(event) => setDomain(event.target.value)} />
        <Field label="Selector" value={selector} onChange={(event) => setSelector(event.target.value)} />
        <FormActions loading={loading} onRun={check} onReset={() => { setDomain(''); setSelector('default'); setRows(null); setError(''); }} runLabel="Query selector" />
      </WorkForm>
      {loading ? <LoadingResult /> : error ? <ErrorState message={error} /> : rows ? <Results rows={rows} title="DKIM selector result" /> : <EmptyState />}
    </>
  );
}

export function DmarcChecker() {
  const [domain, setDomain] = useState('google.com');
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const check = async () => {
    setLoading(true); setError('');
    try {
      const answers = await queryDns(`_dmarc.${domain.trim()}`, 'TXT');
      const record = answers.map((answer) => cleanDnsData(answer.data)).find((value) => value.toLowerCase().startsWith('v=dmarc1'));
      if (!record) throw new Error('No DMARC policy record found.');
      const tags = parseDmarc(record);
      setRows([
        { label: 'DMARC record', value: record, tone: 'success' },
        { label: 'Policy', value: tags.p ?? 'none', tone: tags.p === 'reject' ? 'success' : tags.p === 'quarantine' ? 'warning' : 'danger' },
        { label: 'Subdomain policy', value: tags.sp ?? 'inherits p=' },
        { label: 'DKIM alignment', value: tags.adkim === 's' ? 'Strict' : 'Relaxed' },
        { label: 'SPF alignment', value: tags.aspf === 's' ? 'Strict' : 'Relaxed' },
        { label: 'Aggregate reports', value: tags.rua ?? 'Not configured' },
        { label: 'Enforcement percentage', value: `${tags.pct ?? '100'}%` },
      ]);
    } catch (reason) { setRows(null); setError(reason instanceof Error ? reason.message : 'DMARC request failed.'); }
    finally { setLoading(false); }
  };
  return (
    <>
      <WorkForm onSubmit={check}><Field label="Domain name" value={domain} onChange={(event) => setDomain(event.target.value)} /><FormActions loading={loading} onRun={check} onReset={() => { setDomain(''); setRows(null); setError(''); }} runLabel="Check DMARC" /></WorkForm>
      {loading ? <LoadingResult /> : error ? <ErrorState message={error} /> : rows ? <Results rows={rows} title="DMARC posture" /> : <EmptyState />}
    </>
  );
}

const sampleHeader = `From: alerts@example.net
Return-Path: <bounce@example.net>
Subject: Infrastructure alert
Message-ID: <ops-2026@example.net>
Authentication-Results: mx.example.org; spf=pass smtp.mailfrom=example.net; dkim=pass header.d=example.net; dmarc=pass header.from=example.net
Received: from relay.example.net (192.0.2.24) by mx.example.org with ESMTPS
Received: from app.internal (10.24.4.18) by relay.example.net with SMTP`;

export function EmailHeaderAnalyzer() {
  const [raw, setRaw] = useState(sampleHeader);
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const analyze = () => {
    const parsed = parseEmailHeaders(raw);
    setRows([
      { label: 'From', value: parsed.from },
      { label: 'Return-Path', value: parsed.returnPath },
      { label: 'Message-ID', value: parsed.messageId },
      { label: 'SPF', value: parsed.spf, tone: parsed.spf === 'PASS' ? 'success' : 'warning' },
      { label: 'DKIM', value: parsed.dkim, tone: parsed.dkim === 'PASS' ? 'success' : 'warning' },
      { label: 'DMARC', value: parsed.dmarc, tone: parsed.dmarc === 'PASS' ? 'success' : 'warning' },
      ...parsed.received.map((hop, index) => ({ label: `Received hop ${index + 1}`, value: hop })),
    ]);
  };
  return (
    <>
      <WorkForm onSubmit={analyze}>
        <label className="work-field textarea-field"><span>Raw message headers</span><textarea value={raw} onChange={(event) => setRaw(event.target.value)} rows={10} spellCheck={false} /></label>
        <FormActions onRun={analyze} onReset={() => { setRaw(''); setRows(null); }} runLabel="Analyze headers" />
      </WorkForm>
      {rows ? <Results rows={rows} title="Header authentication trace" exportName="header-analysis.txt" /> : <EmptyState>Paste message headers to map sender identity, authentication verdicts, and relay hops.</EmptyState>}
    </>
  );
}
