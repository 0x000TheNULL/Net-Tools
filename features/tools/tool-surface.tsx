'use client';

import {
  Binary, Braces, Cable, Code2, FileJson, Fingerprint, Globe2, Hash,
  ListTree, MailCheck, Network, Router, SearchCode, Send, ShieldCheck,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { ToolDefinition } from '@/types/tools';
import { DkimHelper, DmarcChecker, DnsLookup, EmailHeaderAnalyzer, SpfChecker, TxtSpfLookup } from './dns-tools';
import { CidrReference, CidrToMask, IpRangeCalculator, IpReference, MaskToCidr, SubnetCalculator, WildcardCalculator } from './network-tools';
import { Base64Tool, HashGenerator, HttpStatusReference, JsonFormatter, PortReference, PrivateIpReference, UrlCodecTool, VlanReference } from './utility-tools';

const iconById = {
  'subnet-calculator': Network, 'cidr-to-mask': Binary, 'mask-to-cidr': Binary,
  'ip-range': ListTree, 'wildcard-mask': Router, 'dns-lookup': Globe2,
  'reverse-dns': SearchCode, 'mx-lookup': Send, 'txt-spf-lookup': FileJson,
  'spf-checker': ShieldCheck, 'dkim-helper': Fingerprint, 'dmarc-checker': MailCheck,
  'email-header': MailCheck, 'port-reference': Cable, 'cidr-reference': ListTree,
  'ip-reference': Network, 'vlan-reference': Router, 'http-status': Globe2,
  base64: Binary, 'url-codec': Code2, 'hash-generator': Hash, 'json-formatter': Braces,
} as const;

export function ToolIcon({ id, size = 18 }: { id: string; size?: number }) {
  const Icon = iconById[id as keyof typeof iconById] ?? Braces;
  return <Icon size={size} />;
}

function renderTool(id: string) {
  switch (id) {
    case 'subnet-calculator': return <SubnetCalculator />;
    case 'cidr-to-mask': return <CidrToMask />;
    case 'mask-to-cidr': return <MaskToCidr />;
    case 'ip-range': return <IpRangeCalculator />;
    case 'wildcard-mask': return <WildcardCalculator />;
    case 'dns-lookup': return <DnsLookup />;
    case 'reverse-dns': return <DnsLookup reverse />;
    case 'mx-lookup': return <DnsLookup fixedType="MX" />;
    case 'txt-spf-lookup': return <TxtSpfLookup />;
    case 'spf-checker': return <SpfChecker />;
    case 'dkim-helper': return <DkimHelper />;
    case 'dmarc-checker': return <DmarcChecker />;
    case 'email-header': return <EmailHeaderAnalyzer />;
    case 'port-reference': return <PortReference />;
    case 'cidr-reference': return <CidrReference />;
    case 'ip-reference': return <><IpReference /><div className="secondary-reference"><PrivateIpReference /></div></>;
    case 'vlan-reference': return <VlanReference />;
    case 'http-status': return <HttpStatusReference />;
    case 'base64': return <Base64Tool />;
    case 'url-codec': return <UrlCodecTool />;
    case 'hash-generator': return <HashGenerator />;
    case 'json-formatter': return <JsonFormatter />;
    default: return null;
  }
}

export function ToolSurface({
  tool, favorite, onToggleFavorite,
}: {
  tool: ToolDefinition;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <article className="active-tool">
      <header className="active-tool-head">
        <div className="active-tool-icon"><ToolIcon id={tool.id} size={22} /></div>
        <div>
          <div className="active-title-line"><h1>{tool.name}</h1><Badge variant="outline">{tool.category}</Badge></div>
          <p>{tool.description}</p>
        </div>
        <button onClick={onToggleFavorite} className={favorite ? 'pin-action is-pinned' : 'pin-action'} aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}>
          <span>{favorite ? 'Pinned' : 'Pin tool'}</span><ShieldCheck size={15} />
        </button>
      </header>
      <div className="active-tool-body">{renderTool(tool.id)}</div>
    </article>
  );
}
