import type { Metadata } from 'next';

import { ToolboxApp } from '@/components/toolbox-app';

export const metadata: Metadata = {
  title: 'Toolbox',
  description: 'Open 22 tools for network calculations, DNS, email authentication, encoding, cryptography, and quick references.',
};

export default function ToolboxPage() {
  return <ToolboxApp />;
}
