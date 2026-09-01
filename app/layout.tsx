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
    'Practical network calculations, diagnostics, references, and browser-native cryptography in one place.',
  keywords: [
    'network engineer tools',
    'subnet calculator',
    'DNS lookup',
    'SPF DKIM DMARC',
    'infrastructure utilities',
    'AES RSA SHA-256 tools',
  ],
  icons: {
    icon: '/brand-mark.png',
    shortcut: '/brand-mark.png',
    apple: '/brand-mark.png',
  },
  openGraph: {
    type: 'website',
    title: 'Network Engineer Toolbox',
    description:
      'Practical network calculations, diagnostics, and references in one place.',
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
      'Practical network calculations, diagnostics, and references in one place.',
    images: ['https://network-engineer-toolbox-eikon.diskoginza.chatgpt.site/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
