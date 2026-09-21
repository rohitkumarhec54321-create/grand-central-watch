import type { Metadata } from 'next';
import GC01Landing from '@/components/GC01Landing';
export const metadata: Metadata = {
  title: 'GC—01 | Grand Central Watch',
  description:
    'An interactive design study in time. Explore the GC—01 in three dimensions, from its sculpted case to the movement within.',
};
export default function Home() {
  return <GC01Landing />;
}
