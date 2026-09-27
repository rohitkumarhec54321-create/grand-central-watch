import type { Metadata } from 'next';
import PageIntro from '@/components/PageIntro';
import CollectionExplorer from '@/components/CollectionExplorer';
export const metadata: Metadata = { title: 'Shop | Grand Central Watch — Portfolio Concept', description: 'Fourteen curated listings: featured timepieces, independent microbrands and considered accessories. An unaffiliated portfolio concept.' };
export default function Shop() { return <main id="main-content" className="paper-page"><PageIntro label="THE SHOP" title="Objects of" em="appreciation.">Established icons. Independent voices. The details that make them yours. Explore 14 official listings, then continue to Grand Central Watch for availability and purchase.</PageIntro><section className="content-section collection-section"><CollectionExplorer/></section></main>; }
