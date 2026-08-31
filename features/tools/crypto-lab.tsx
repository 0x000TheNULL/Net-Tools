'use client';

import { useMemo, useState } from 'react';
import { Check, KeyRound, LockKeyhole, RefreshCw, ShieldCheck } from 'lucide-react';

import { decodeBase64, encodeBase64 } from '@/lib/codec';
import {
  decryptAes, decryptRsa, derivePbkdf2, digestText, encryptAes, encryptRsa,
  generateRsaKeyPair, hmacSha256, randomHex,
} from '@/lib/crypto';
import type { ResultRow } from '@/types/tools';
import { EmptyState, ErrorState, Results } from './shared';

type MethodId =
  | 'base64' | 'url' | 'sha256' | 'sha384' | 'sha512'
  | 'hmac' | 'aes-gcm' | 'aes-cbc' | 'rsa' | 'pbkdf2';

type Operation = 'encode' | 'decode' | 'digest' | 'sign' | 'encrypt' | 'decrypt' | 'derive';

const methods: Array<{
  id: MethodId;
  name: string;
  family: string;
  detail: string;
  operations: Operation[];
  standard: string;
}> = [
  { id: 'base64', name: 'Base64', family: 'Encoding', detail: 'Binary-to-text transport encoding', operations: ['encode', 'decode'], standard: 'RFC 4648' },
  { id: 'url', name: 'URL Percent', family: 'Encoding', detail: 'URI component escaping', operations: ['encode', 'decode'], standard: 'RFC 3986' },
  { id: 'sha256', name: 'SHA-256', family: 'Hash', detail: '256-bit one-way digest', operations: ['digest'], standard: 'FIPS 180-4' },
  { id: 'sha384', name: 'SHA-384', family: 'Hash', detail: '384-bit one-way digest', operations: ['digest'], standard: 'FIPS 180-4' },
  { id: 'sha512', name: 'SHA-512', family: 'Hash', detail: '512-bit one-way digest', operations: ['digest'], standard: 'FIPS 180-4' },
  { id: 'hmac', name: 'HMAC-SHA-256', family: 'Authentication', detail: 'Keyed integrity signature', operations: ['sign'], standard: 'RFC 2104' },
  { id: 'aes-gcm', name: 'AES-GCM-256', family: 'Encryption', detail: 'Authenticated symmetric encryption', operations: ['encrypt', 'decrypt'], standard: 'NIST SP 800-38D' },
  { id: 'aes-cbc', name: 'AES-CBC-256', family: 'Encryption', detail: 'Legacy symmetric block mode', operations: ['encrypt', 'decrypt'], standard: 'NIST SP 800-38A' },
  { id: 'rsa', name: 'RSA-OAEP-2048', family: 'Encryption', detail: 'Asymmetric encryption with SHA-256', operations: ['encrypt', 'decrypt'], standard: 'RFC 8017' },
  { id: 'pbkdf2', name: 'PBKDF2-SHA-256', family: 'Key derivation', detail: 'Passphrase-to-key derivation', operations: ['derive'], standard: 'RFC 8018' },
];

const samples: Record<MethodId, string> = {
  base64: 'Network engineering, without the noise.',
  url: 'site=network toolbox&mode=utility',
  sha256: 'network-engineer-toolbox',
  sha384: 'network-engineer-toolbox',
  sha512: 'network-engineer-toolbox',
  hmac: 'event=link_up&interface=Gi0/1',
  'aes-gcm': 'Change window: 2026-08-31 22:00 WIB',
  'aes-cbc': 'Legacy interoperability payload',
  rsa: 'Wrap this short session key.',
  pbkdf2: 'correct horse battery staple',
};

function operationLabel(operation: Operation) {
  return ({ encode: 'Encode', decode: 'Decode', digest: 'Generate digest', sign: 'Sign message', encrypt: 'Encrypt', decrypt: 'Decrypt', derive: 'Derive key' })[operation];
}

export function CryptoLab() {
  const [methodId, setMethodId] = useState<MethodId>('sha256');
  const method = useMemo(() => methods.find((item) => item.id === methodId) ?? methods[2], [methodId]);
  const [operation, setOperation] = useState<Operation>('digest');
  const [input, setInput] = useState(samples.sha256);
  const [secret, setSecret] = useState('');
  const [salt, setSalt] = useState('netops-2026');
  const [iterations, setIterations] = useState('210000');
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [rows, setRows] = useState<ResultRow[] | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const chooseMethod = (id: MethodId) => {
    const next = methods.find((item) => item.id === id) ?? methods[0];
    setMethodId(id);
    setOperation(next.operations[0]);
    setInput(samples[id]);
    setRows(null);
    setError('');
    if ((id === 'aes-gcm' || id === 'aes-cbc') && !secret) setSecret(randomHex());
  };

  const generateKeys = async () => {
    setLoading(true);
    setError('');
    try {
      const pair = await generateRsaKeyPair();
      setPublicKey(pair.publicKey);
      setPrivateKey(pair.privateKey);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'RSA key generation failed.');
    } finally { setLoading(false); }
  };

  const run = async () => {
    setLoading(true);
    setError('');
    try {
      let output = '';
      let outputLabel = 'Output';
      if (methodId === 'base64') {
        output = operation === 'encode' ? encodeBase64(input) : decodeBase64(input);
        outputLabel = operation === 'encode' ? 'Encoded text' : 'Decoded text';
      } else if (methodId === 'url') {
        output = operation === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
        outputLabel = operation === 'encode' ? 'Encoded component' : 'Decoded component';
      } else if (methodId === 'sha256' || methodId === 'sha384' || methodId === 'sha512') {
        const algorithm = methodId === 'sha256' ? 'SHA-256' : methodId === 'sha384' ? 'SHA-384' : 'SHA-512';
        output = await digestText(input, algorithm);
        outputLabel = 'Hex digest';
      } else if (methodId === 'hmac') {
        output = await hmacSha256(input, secret);
        outputLabel = 'Hex signature';
      } else if (methodId === 'aes-gcm' || methodId === 'aes-cbc') {
        const algorithm = methodId === 'aes-gcm' ? 'AES-GCM' : 'AES-CBC';
        output = operation === 'encrypt'
          ? await encryptAes(input, secret, algorithm)
          : await decryptAes(input, secret, algorithm);
        outputLabel = operation === 'encrypt' ? 'Encrypted envelope' : 'Recovered plaintext';
      } else if (methodId === 'rsa') {
        output = operation === 'encrypt'
          ? await encryptRsa(input, publicKey)
          : await decryptRsa(input, privateKey);
        outputLabel = operation === 'encrypt' ? 'Base64 ciphertext' : 'Recovered plaintext';
      } else {
        output = await derivePbkdf2(input, salt, Number(iterations));
        outputLabel = '256-bit derived key';
      }
      setRows([
        { label: 'Method', value: method.name },
        { label: outputLabel, value: output, tone: 'success' },
        { label: 'Classification', value: method.family },
        { label: 'Output size', value: `${new TextEncoder().encode(output).byteLength.toLocaleString()} bytes` },
      ]);
    } catch (reason) {
      setRows(null);
      setError(reason instanceof Error ? reason.message : 'The operation could not be completed.');
    } finally { setLoading(false); }
  };

  const reset = () => {
    setInput(samples[methodId]);
    setRows(null);
    setError('');
  };

  const note = methodId === 'aes-cbc'
    ? 'AES-CBC does not authenticate ciphertext. Prefer AES-GCM; use CBC only for compatibility and pair it with an independent MAC.'
    : method.family === 'Hash'
      ? 'A cryptographic hash is one-way. It can be verified, but it cannot be decoded or decrypted.'
      : methodId === 'rsa'
        ? 'RSA is intended for short payloads such as symmetric keys. Hybrid encryption should handle larger data.'
        : 'The operation runs locally through the browser Web Crypto API. Inputs and keys are not sent to this site.';

  return (
    <div className="crypto-manual">
      <aside className="crypto-index" aria-label="Cryptography method index">
        <div className="crypto-index-head"><span>Methods</span><b>10 options</b></div>
        {methods.map((item) => (
          <button key={item.id} aria-label={`${item.name}, ${item.family}`} className={item.id === methodId ? 'crypto-method is-active' : 'crypto-method'} onClick={() => chooseMethod(item.id)}>
            <div><b>{item.name}</b><small>{item.family}</small></div>
          </button>
        ))}
      </aside>

      <section className="crypto-workbench">
        <header className="crypto-method-head">
          <div><span>{method.family}</span><h2>{method.name}</h2><p>{method.detail}</p></div>
          <code>{method.standard}</code>
        </header>

        <form className="crypto-form" onSubmit={(event) => { event.preventDefault(); void run(); }}>
          {method.operations.length > 1 && (
            <div className="operation-switch" aria-label="Operation">
              {method.operations.map((item) => <button key={item} type="button" className={operation === item ? 'is-active' : ''} onClick={() => { setOperation(item); setRows(null); setError(''); }}>{operationLabel(item)}</button>)}
            </div>
          )}

          <label className="work-field crypto-input"><span>{operation === 'decrypt' ? 'Ciphertext / envelope' : methodId === 'pbkdf2' ? 'Passphrase' : 'Input text'}</span><textarea value={input} onChange={(event) => setInput(event.target.value)} rows={7} spellCheck={false} /></label>

          {(methodId === 'hmac' || methodId === 'aes-gcm' || methodId === 'aes-cbc') && (
            <label className="work-field crypto-secret"><span>{methodId === 'hmac' ? 'HMAC secret' : 'AES-256 key / 64 hex characters'}</span><div className="inline-key"><input value={secret} onChange={(event) => setSecret(event.target.value)} spellCheck={false} /><button type="button" onClick={() => setSecret(methodId === 'hmac' ? randomHex(16) : randomHex())}><RefreshCw size={13} /> Generate</button></div></label>
          )}

          {methodId === 'pbkdf2' && <div className="crypto-pair"><label className="work-field"><span>Salt</span><input value={salt} onChange={(event) => setSalt(event.target.value)} /></label><label className="work-field"><span>Iterations</span><input type="number" min="10000" max="2000000" value={iterations} onChange={(event) => setIterations(event.target.value)} /></label></div>}

          {methodId === 'rsa' && (
            <div className="rsa-keyset">
              <div className="rsa-keyset-head"><span>Key material</span><button type="button" onClick={() => void generateKeys()} disabled={loading}><KeyRound size={13} /> {publicKey ? 'Regenerate pair' : 'Generate RSA pair'}</button></div>
              <label className="work-field"><span>Public key / SPKI PEM</span><textarea value={publicKey} onChange={(event) => setPublicKey(event.target.value)} rows={5} spellCheck={false} /></label>
              <label className="work-field"><span>Private key / PKCS8 PEM</span><textarea value={privateKey} onChange={(event) => setPrivateKey(event.target.value)} rows={5} spellCheck={false} /></label>
            </div>
          )}

          <div className="crypto-actions">
            <button className="crypto-run" type="submit" disabled={loading}>{loading ? <><span className="spinner" /> Working…</> : <><LockKeyhole size={14} /> {operationLabel(operation)}</>}</button>
            <button className="crypto-reset" type="button" onClick={reset}>Reset</button>
            <span><ShieldCheck size={13} /> Runs in this browser</span>
          </div>
        </form>

        <div className="crypto-note"><Check size={13} /><p>{note}</p></div>
        {error ? <ErrorState message={error} /> : rows ? <Results rows={rows} title={`${method.name} result`} exportName="crypto-result.txt" note="Treat generated keys and output as sensitive when using them outside this browser session." /> : <EmptyState>Select a method, add the input, then run the documented operation.</EmptyState>}
      </section>
    </div>
  );
}
