import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Network Engineer Toolbox',
    template: '%s | Network Engineer Toolbox',
  },
  description:
    'A precision workspace for IP, DNS, email authentication, and infrastructure utilities.',
  keywords: [
    'network engineer tools',
    'subnet calculator',
    'DNS lookup',
    'SPF DKIM DMARC',
    'infrastructure utilities',
  ],
  openGraph: {
    type: 'website',
    title: 'Network Engineer Toolbox',
    description:
      'A precision workspace for IP, DNS, email authentication, and infrastructure utilities.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Network Engineer Toolbox' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Network Engineer Toolbox',
    description:
      'A precision workspace for IP, DNS, email authentication, and infrastructure utilities.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
