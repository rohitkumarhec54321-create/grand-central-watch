import type { Metadata } from 'next';
import { Geist, Geist_Mono, Playfair_Display, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import './atelier.css';
import SiteShell from '@/components/SiteShell';
const sans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const mono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });
const display = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'], style: ['normal','italic'] });
const editorial = Cormorant_Garamond({ variable: '--font-editorial', subsets: ['latin'], weight: ['300','400','500'], style: ['normal','italic'] });
export const metadata: Metadata = { title: 'Grand Central Watch | New York Watchmakers Since 1952', description: 'Watch repair, vintage restoration, curated timepieces, and three generations of care inside Grand Central Terminal. Explore the craft and visit the atelier.' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${sans.variable} ${mono.variable} ${display.variable} ${editorial.variable} antialiased`}><SiteShell>{children}</SiteShell></body></html>; }
