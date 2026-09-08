'use client';
import ScrollWatchSequence from './ScrollWatchSequence';
import { usePageScroll } from './EditorialMotion';
export default function WatchExperience(){const lenis=usePageScroll();return <ScrollWatchSequence lenisInstance={lenis} smoothScroll={false} showPageProgress={false}/>}
