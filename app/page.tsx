import type { Metadata } from 'next';
import LonginesLanding from '@/components/LonginesLanding';
export const metadata: Metadata = {
  title: 'Longines — A Study in Steel & Leather | Grand Central Watch',
  description:
    'Explore the supplied Longines watch through a scroll-controlled film: dial, fluted bezel, case, crown and brown leather strap.',
};
export default function Home() {
  return <LonginesLanding />;
}
