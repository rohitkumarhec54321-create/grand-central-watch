import type { Metadata } from 'next';
import PageIntro from '@/components/PageIntro';
import WatchDetails from '@/components/WatchDetails';
export const metadata: Metadata = {
  title: 'The Collected Studies | Grand Central Watch',
  description:
    'Eight supplied visual studies: movement anatomy, Longines, IWC, and a gold-tone dress watch. Inspect every image in detail.',
};
export default function Craft() {
  return (
    <main id="main-content">
      <div className="paper-page">
        <PageIntro
          label="THE COLLECTED STUDIES"
          title="Look closer."
          em="There is always more."
        >
          Eight visual studies in form, assembly, and the mechanics beneath the
          dial.
        </PageIntro>
      </div>
      <WatchDetails />
    </main>
  );
}
