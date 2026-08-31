'use client';

import { useMemo, useState } from 'react';

import { cidrToMask, classifyIPv4, maskToCidr, rangeRows, subnetRows, wildcardFromCidr } from '@/lib/network';
import type { ResultRow } from '@/types/tools';
import { EmptyState, ErrorState, Field, FormActions, ReferenceTable, Results, WorkForm } from './shared';

function useToolResult(initial?: ResultRow[]) {
  const [rows, setRows] = useState<ResultRow[] | null>(initial ?? null);
  const [error, setError] = useState('');
  const run = (calculation: () => ResultRow[]) => {
    try { setRows(calculation()); setError(''); } catch (reason) {
      setRows(null); setError(reason instanceof Error ? reason.message : 'Invalid input.');
    }
  };
  const clear = () => { setRows(null); setError(''); };
  return { rows, error, run, clear };
}

export function SubnetCalculator() {
  const [ip, setIp] = useState('192.168.10.42');
  const [cidr, setCidr] = useState('24');
  const result = useToolResult(subnetRows(ip, Number(cidr)));
  const calculate = () => result.run(() => subnetRows(ip, Number(cidr)));
  return (
    <>
      <WorkForm onSubmit={calculate}>
        <Field label="IPv4 address" value={ip} onChange={(event) => setIp(event.target.value)} placeholder="192.168.10.42" />
        <Field label="CIDR prefix" value={cidr} onChange={(event) => setCidr(event.target.value)} placeholder="24" inputMode="numeric" />
        <FormActions onRun={calculate} onReset={() => { setIp(''); setCidr('24'); result.clear(); }} runLabel="Calculate subnet" />
      </WorkForm>
      {result.error ? <ErrorState message={result.error} /> : result.rows ? <Results rows={result.rows} title={`${ip}/${cidr}`} exportName="subnet-result.txt" /> : <EmptyState />}
    </>
  );
}

export function CidrToMask() {
  const [cidr, setCidr] = useState('24');
  const result = useToolResult();
  const calculate = () => result.run(() => {
    const prefix = Number(cidr);
    return [
      { label: 'CIDR prefix', value: `/${prefix}` },
      { label: 'Subnet mask', value: cidrToMask(prefix), tone: 'success' },
      { label: 'Wildcard mask', value: wildcardFromCidr(prefix) },
      { label: 'Address capacity', value: (2 ** (32 - prefix)).toLocaleString() },
    ];
  });
  return (
    <>
      <WorkForm onSubmit={calculate}><Field label="CIDR prefix" value={cidr} onChange={(event) => setCidr(event.target.value)} inputMode="numeric" /><FormActions onRun={calculate} onReset={() => { setCidr('24'); result.clear(); }} runLabel="Convert" /></WorkForm>
      {result.error ? <ErrorState message={result.error} /> : result.rows ? <Results rows={result.rows} title="CIDR conversion" /> : <EmptyState />}
    </>
  );
}

export function MaskToCidr() {
  const [mask, setMask] = useState('255.255.255.0');
  const result = useToolResult();
  const calculate = () => result.run(() => {
    const prefix = maskToCidr(mask);
    return [
      { label: 'Subnet mask', value: mask },
      { label: 'CIDR prefix', value: `/${prefix}`, tone: 'success' },
      { label: 'Wildcard mask', value: wildcardFromCidr(prefix) },
      { label: 'Address capacity', value: (2 ** (32 - prefix)).toLocaleString() },
    ];
  });
  return (
    <>
      <WorkForm onSubmit={calculate}><Field label="Dotted-decimal mask" value={mask} onChange={(event) => setMask(event.target.value)} /><FormActions onRun={calculate} onReset={() => { setMask('255.255.255.0'); result.clear(); }} runLabel="Validate & convert" /></WorkForm>
      {result.error ? <ErrorState message={result.error} /> : result.rows ? <Results rows={result.rows} title="Mask conversion" /> : <EmptyState />}
    </>
  );
}

export function IpRangeCalculator() {
  const [start, setStart] = useState('10.24.8.1');
  const [end, setEnd] = useState('10.24.8.254');
  const result = useToolResult();
  const calculate = () => result.run(() => rangeRows(start, end));
  return (
    <>
      <WorkForm onSubmit={calculate}>
        <Field label="Start address" value={start} onChange={(event) => setStart(event.target.value)} />
        <Field label="End address" value={end} onChange={(event) => setEnd(event.target.value)} />
        <FormActions onRun={calculate} onReset={() => { setStart(''); setEnd(''); result.clear(); }} runLabel="Measure range" />
      </WorkForm>
      {result.error ? <ErrorState message={result.error} /> : result.rows ? <Results rows={result.rows} title="Range analysis" /> : <EmptyState />}
    </>
  );
}

export function WildcardCalculator() {
  const [cidr, setCidr] = useState('24');
  const result = useToolResult();
  const calculate = () => result.run(() => {
    const prefix = Number(cidr);
    return [
      { label: 'Prefix', value: `/${prefix}` },
      { label: 'Subnet mask', value: cidrToMask(prefix) },
      { label: 'Wildcard mask', value: wildcardFromCidr(prefix), tone: 'success' },
      { label: 'ACL form', value: `any ${wildcardFromCidr(prefix)}` },
    ];
  });
  return (
    <>
      <WorkForm onSubmit={calculate}><Field label="CIDR prefix" value={cidr} onChange={(event) => setCidr(event.target.value)} inputMode="numeric" /><FormActions onRun={calculate} onReset={() => { setCidr('24'); result.clear(); }} runLabel="Generate wildcard" /></WorkForm>
      {result.error ? <ErrorState message={result.error} /> : result.rows ? <Results rows={result.rows} title="Wildcard result" /> : <EmptyState />}
    </>
  );
}

export function IpReference() {
  const [ip, setIp] = useState('192.168.1.42');
  const result = useToolResult();
  const calculate = () => result.run(() => classifyIPv4(ip));
  return (
    <>
      <WorkForm onSubmit={calculate}><Field label="IPv4 address" value={ip} onChange={(event) => setIp(event.target.value)} /><FormActions onRun={calculate} onReset={() => { setIp(''); result.clear(); }} runLabel="Classify address" /></WorkForm>
      {result.error ? <ErrorState message={result.error} /> : result.rows ? <Results rows={result.rows} title="Address classification" /> : <EmptyState />}
    </>
  );
}

export function CidrReference() {
  const rows = useMemo(() => [8, 10, 12, 16, 20, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32].map((cidr) => [
    `/${cidr}`, cidrToMask(cidr), (2 ** (32 - cidr)).toLocaleString(),
    (cidr === 32 ? 1 : cidr === 31 ? 2 : Math.max(0, 2 ** (32 - cidr) - 2)).toLocaleString(),
  ]), []);
  return <ReferenceTable headings={['Prefix', 'Subnet mask', 'Addresses', 'Usable hosts']} rows={rows} />;
}
