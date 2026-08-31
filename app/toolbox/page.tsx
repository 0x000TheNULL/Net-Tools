import type { Metadata } from 'next';

import { ToolboxApp } from '@/components/toolbox-app';

export const metadata: Metadata = {
  title: 'Toolbox Workspace | Network Engineer Toolbox',
  description: 'Open 22 focused utilities for network, DNS, email, and infrastructure work.',
};

export default function ToolboxPage() {
  return <ToolboxApp />;
}
