import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google';
import './globals.css';
const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const display = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'], style: ['normal','italic'] });
export const metadata: Metadata = { title: 'Inside the Movement | Grand Central Watch', description: 'Unfold. Inspect. Reassemble. Seal. Explore the craft beneath the dial with Grand Central Watch.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${sans.variable} ${mono.variable} ${display.variable} antialiased`}>{children}</body></html>; }
