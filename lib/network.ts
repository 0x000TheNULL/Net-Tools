import type { ResultRow } from '@/types/tools';

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

export function isValidIPv4(value: string) {
  const match = value.trim().match(IPV4);
  return Boolean(match && match.slice(1).every((part) => Number(part) <= 255));
}

export function ipToInt(value: string) {
  if (!isValidIPv4(value)) throw new Error('Enter a valid IPv4 address.');
  return value.split('.').reduce((result, octet) => ((result << 8) | Number(octet)) >>> 0, 0);
}

export function intToIp(value: number) {
  const unsigned = value >>> 0;
  return [24, 16, 8, 0].map((shift) => (unsigned >>> shift) & 255).join('.');
}

export function cidrToMask(cidr: number) {
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) throw new Error('CIDR must be between 0 and 32.');
  return intToIp(cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0);
}

export function maskToCidr(mask: string) {
  if (!isValidIPv4(mask)) throw new Error('Enter a valid dotted-decimal mask.');
  const binary = mask.split('.').map((part) => Number(part).toString(2).padStart(8, '0')).join('');
  if (!/^1*0*$/.test(binary)) throw new Error('Subnet mask bits must be contiguous.');
  return binary.indexOf('0') === -1 ? 32 : binary.indexOf('0');
}

export function wildcardFromCidr(cidr: number) {
  return cidrToMask(cidr).split('.').map((part) => 255 - Number(part)).join('.');
}

export function subnetRows(ip: string, cidr: number): ResultRow[] {
  const ipNumber = ipToInt(ip);
  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) throw new Error('CIDR must be between 0 and 32.');
  const mask = cidr === 0 ? 0 : (0xffffffff << (32 - cidr)) >>> 0;
  const network = (ipNumber & mask) >>> 0;
  const wildcard = (~mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;
  const total = 2 ** (32 - cidr);
  const first = cidr >= 31 ? network : network + 1;
  const last = cidr >= 31 ? broadcast : broadcast - 1;
  const usable = cidr === 32 ? 1 : cidr === 31 ? 2 : Math.max(0, total - 2);
  return [
    { label: 'Network address', value: intToIp(network) },
    { label: 'Broadcast address', value: intToIp(broadcast) },
    { label: 'Subnet mask', value: intToIp(mask) },
    { label: 'Wildcard mask', value: intToIp(wildcard) },
    { label: 'First host', value: intToIp(first) },
    { label: 'Last host', value: intToIp(last) },
    { label: 'Total addresses', value: total.toLocaleString() },
    { label: 'Usable hosts', value: usable.toLocaleString(), tone: 'success' },
  ];
}

export function rangeRows(start: string, end: string): ResultRow[] {
  const startNumber = ipToInt(start);
  const endNumber = ipToInt(end);
  if (startNumber > endNumber) throw new Error('Start address must be lower than the end address.');
  const count = endNumber - startNumber + 1;
  const common = Math.clz32((startNumber ^ endNumber) >>> 0);
  return [
    { label: 'Start address', value: start },
    { label: 'End address', value: end },
    { label: 'Address count', value: count.toLocaleString(), tone: 'success' },
    { label: 'Smallest covering block', value: `${intToIp((startNumber & (common === 0 ? 0 : (0xffffffff << (32 - common)))) >>> 0)}/${common}` },
  ];
}

export function reverseName(ip: string) {
  if (!isValidIPv4(ip)) throw new Error('Enter a valid IPv4 address.');
  return `${ip.split('.').reverse().join('.')}.in-addr.arpa`;
}

export function classifyIPv4(ip: string): ResultRow[] {
  const value = ipToInt(ip);
  const first = Number(ip.split('.')[0]);
  let classification = 'Public unicast';
  let note = 'Globally routable unless filtered by your provider or policy.';
  if ((value >= ipToInt('10.0.0.0') && value <= ipToInt('10.255.255.255')) ||
      (value >= ipToInt('172.16.0.0') && value <= ipToInt('172.31.255.255')) ||
      (value >= ipToInt('192.168.0.0') && value <= ipToInt('192.168.255.255'))) {
    classification = 'Private RFC 1918'; note = 'Not routed on the public internet.';
  } else if (first === 127) { classification = 'Loopback'; note = 'Local host only.'; }
  else if (value >= ipToInt('169.254.0.0') && value <= ipToInt('169.254.255.255')) { classification = 'Link-local'; note = 'Self-assigned on the local segment.'; }
  else if (value >= ipToInt('224.0.0.0') && value <= ipToInt('239.255.255.255')) { classification = 'Multicast'; note = 'One-to-many delivery group.'; }
  return [
    { label: 'Classification', value: classification, tone: classification.startsWith('Public') ? 'success' : 'warning' },
    { label: 'Address', value: ip },
    { label: 'Context', value: note },
  ];
}
