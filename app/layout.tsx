import type { Metadata } from 'next';
import { Manrope, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Manrope({
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
    'An interactive engineering field manual for IP, DNS, email, networking, encoding, and browser-native cryptography.',
  keywords: [
    'network engineer tools',
    'subnet calculator',
    'DNS lookup',
    'SPF DKIM DMARC',
    'infrastructure utilities',
    'AES RSA SHA-256 tools',
  ],
  openGraph: {
    type: 'website',
    title: 'Network Engineer Toolbox',
    description:
      'An interactive engineering field manual for networking, diagnostics, and browser-native cryptography.',
    images: [{
      url: 'https://network-engineer-toolbox-eikon.diskoginza.chatgpt.site/og.png',
      width: 1200,
      height: 630,
      alt: 'Network Engineer Toolbox',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Network Engineer Toolbox',
    description:
      'An interactive engineering field manual for networking, diagnostics, and browser-native cryptography.',
    images: ['https://network-engineer-toolbox-eikon.diskoginza.chatgpt.site/og.png'],
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
