export type DnsAnswer = {
  name: string;
  type: number;
  TTL: number;
  data: string;
};

const TYPE_CODES: Record<string, number> = {
  A: 1, NS: 2, CNAME: 5, SOA: 6, PTR: 12, MX: 15, TXT: 16, AAAA: 28,
};

export async function queryDns(name: string, type: string): Promise<DnsAnswer[]> {
  const trimmed = name.trim().replace(/\.$/, '');
  if (!trimmed) throw new Error('Enter a domain or reverse lookup name.');
  const response = await fetch(
    `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(trimmed)}&type=${encodeURIComponent(type)}`,
    { headers: { accept: 'application/dns-json' } },
  );
  if (!response.ok) throw new Error(`DNS provider returned HTTP ${response.status}.`);
  const payload = await response.json() as { Status: number; Answer?: DnsAnswer[]; Comment?: string };
  if (payload.Status !== 0 && payload.Status !== 3) throw new Error(payload.Comment || `DNS status ${payload.Status}.`);
  return (payload.Answer ?? []).filter((answer) => answer.type === TYPE_CODES[type] || type === 'ANY');
}

export function cleanDnsData(value: string) {
  return value.replace(/^"|"$/g, '').replace(/"\s+"/g, '');
}

export function parseSpf(record: string) {
  const mechanisms = cleanDnsData(record).split(/\s+/).slice(1);
  const lookups = mechanisms.filter((item) => /^(?:[+?~-])?(include|a|mx|ptr|exists|redirect)(?::|=|$)/.test(item));
  const terminal = mechanisms.find((item) => /[+?~-]all$/.test(item)) ?? 'No all mechanism';
  return { mechanisms, lookupCount: lookups.length, terminal };
}

export function parseDmarc(record: string) {
  return Object.fromEntries(
    cleanDnsData(record)
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const [key, ...rest] = part.split('=');
        return [key.toLowerCase(), rest.join('=')];
      }),
  );
}

export function parseEmailHeaders(raw: string) {
  const unfolded = raw.replace(/\r?\n[\t ]+/g, ' ');
  const fields = new Map<string, string[]>();
  for (const line of unfolded.split(/\r?\n/)) {
    const separator = line.indexOf(':');
    if (separator < 1) continue;
    const name = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    fields.set(name, [...(fields.get(name) ?? []), value]);
  }
  const authentication = (fields.get('authentication-results') ?? []).join(' ');
  const verdict = (key: string) => authentication.match(new RegExp(`${key}=([a-z]+)`, 'i'))?.[1]?.toUpperCase() ?? 'NOT FOUND';
  return {
    from: fields.get('from')?.[0] ?? 'Not found',
    returnPath: fields.get('return-path')?.[0] ?? 'Not found',
    messageId: fields.get('message-id')?.[0] ?? 'Not found',
    subject: fields.get('subject')?.[0] ?? 'Not found',
    spf: verdict('spf'),
    dkim: verdict('dkim'),
    dmarc: verdict('dmarc'),
    received: fields.get('received') ?? [],
  };
}
