import type { ToolCategory, ToolDefinition } from '@/types/tools';

export const categories: Array<{
  name: ToolCategory;
  description: string;
}> = [
  { name: 'IP & Subnet', description: 'Address planning, masks, ranges, and wildcard math.' },
  { name: 'DNS', description: 'Live DNS-over-HTTPS record inspection and reverse lookup.' },
  { name: 'Email', description: 'SPF, DKIM, DMARC, and mail-path diagnostics.' },
  { name: 'Network', description: 'Ports, VLANs, CIDR, IP, and HTTP quick references.' },
  { name: 'Utilities', description: 'Encoding, cryptography, hashes, and structured-data utilities.' },
];

export const tools: ToolDefinition[] = [
  { id: 'subnet-calculator', name: 'Subnet Calculator', shortName: 'Subnet', description: 'Calculate network boundaries, masks, and usable host ranges.', category: 'IP & Subnet', tags: ['ipv4', 'cidr', 'mask', 'hosts'], featured: true },
  { id: 'cidr-to-mask', name: 'CIDR to Subnet Mask', shortName: 'CIDR → mask', description: 'Convert a prefix length to dotted-decimal notation.', category: 'IP & Subnet', tags: ['cidr', 'prefix', 'mask'] },
  { id: 'mask-to-cidr', name: 'Subnet Mask to CIDR', shortName: 'Mask → CIDR', description: 'Validate a subnet mask and resolve its prefix length.', category: 'IP & Subnet', tags: ['mask', 'cidr', 'validate'] },
  { id: 'ip-range', name: 'IP Range Calculator', shortName: 'IP range', description: 'Measure a start/end range and total address capacity.', category: 'IP & Subnet', tags: ['range', 'hosts', 'capacity'] },
  { id: 'wildcard-mask', name: 'Wildcard Mask Calculator', shortName: 'Wildcard', description: 'Generate the inverse mask used by ACLs and routing protocols.', category: 'IP & Subnet', tags: ['wildcard', 'acl', 'ospf'] },
  { id: 'dns-lookup', name: 'DNS Lookup', shortName: 'DNS lookup', description: 'Query A, AAAA, CNAME, MX, TXT, NS, SOA, and PTR records.', category: 'DNS', tags: ['dns', 'records', 'doh'], featured: true },
  { id: 'reverse-dns', name: 'Reverse DNS Lookup', shortName: 'Reverse DNS', description: 'Resolve the PTR hostname associated with an IPv4 address.', category: 'DNS', tags: ['ptr', 'reverse', 'ip'] },
  { id: 'mx-lookup', name: 'MX Lookup', shortName: 'MX lookup', description: 'Inspect mail exchange priorities for a domain.', category: 'DNS', tags: ['mx', 'mail', 'priority'] },
  { id: 'txt-spf-lookup', name: 'TXT / SPF Lookup', shortName: 'TXT & SPF', description: 'Retrieve TXT records and isolate SPF policy.', category: 'DNS', tags: ['txt', 'spf', 'verification'] },
  { id: 'spf-checker', name: 'SPF Record Checker', shortName: 'SPF checker', description: 'Inspect mechanisms, lookup pressure, and terminal policy.', category: 'Email', tags: ['spf', 'sender', 'email'], featured: true },
  { id: 'dkim-helper', name: 'DKIM Selector Helper', shortName: 'DKIM helper', description: 'Build and query selector-specific DKIM record names.', category: 'Email', tags: ['dkim', 'selector', 'public key'] },
  { id: 'dmarc-checker', name: 'DMARC Record Checker', shortName: 'DMARC checker', description: 'Inspect DMARC policy, reporting, and alignment settings.', category: 'Email', tags: ['dmarc', 'policy', 'alignment'] },
  { id: 'email-header', name: 'Email Header Analyzer', shortName: 'Header analyzer', description: 'Parse authentication verdicts, identities, and received hops.', category: 'Email', tags: ['headers', 'received', 'forensics'], featured: true },
  { id: 'port-reference', name: 'Port Reference', shortName: 'Ports', description: 'Search common TCP and UDP ports and service notes.', category: 'Network', tags: ['tcp', 'udp', 'service'], featured: true },
  { id: 'cidr-reference', name: 'CIDR Reference Table', shortName: 'CIDR table', description: 'Compare masks, address capacity, and usable host counts.', category: 'Network', tags: ['cidr', 'hosts', 'table'] },
  { id: 'ip-reference', name: 'Private / Public IP Reference', shortName: 'IP reference', description: 'Classify IPv4 ranges and reserved address space.', category: 'Network', tags: ['private', 'public', 'reserved'] },
  { id: 'vlan-reference', name: 'VLAN ID Reference', shortName: 'VLAN IDs', description: 'Quick guidance for normal, reserved, and extended VLAN ranges.', category: 'Network', tags: ['vlan', '802.1q', 'switching'] },
  { id: 'http-status', name: 'HTTP Status Reference', shortName: 'HTTP status', description: 'Search response codes by class, meaning, or number.', category: 'Network', tags: ['http', 'status', 'web'] },
  { id: 'base64', name: 'Base64 Encode / Decode', shortName: 'Base64', description: 'Transform UTF-8 text locally in your browser.', category: 'Utilities', tags: ['base64', 'encode', 'decode'], featured: true },
  { id: 'url-codec', name: 'URL Encode / Decode', shortName: 'URL codec', description: 'Encode or decode query values and URL components.', category: 'Utilities', tags: ['url', 'percent', 'decode'] },
  { id: 'hash-generator', name: 'Encode & Crypto Lab', shortName: 'Crypto lab', description: 'Work with ten encoding, hashing, authentication, encryption, and key-derivation methods.', category: 'Utilities', tags: ['base64', 'url', 'sha256', 'sha384', 'sha512', 'hmac', 'aes', 'gcm', 'cbc', 'rsa', 'oaep', 'pbkdf2', 'encrypt', 'decrypt'], featured: true },
  { id: 'json-formatter', name: 'JSON Formatter / Validator', shortName: 'JSON', description: 'Validate, format, and minify JSON payloads.', category: 'Utilities', tags: ['json', 'format', 'validate'] },
];

export const toolById = new Map(tools.map((tool) => [tool.id, tool]));

const codeByCategory: Record<ToolCategory, string> = {
  'IP & Subnet': 'IP', DNS: 'DNS', Email: 'MAIL', Network: 'NET', Utilities: 'UTIL',
};

export function toolCode(tool: ToolDefinition) {
  const position = tools.filter((item) => item.category === tool.category).findIndex((item) => item.id === tool.id) + 1;
  return `${codeByCategory[tool.category]}/${position.toString().padStart(3, '0')}`;
}
