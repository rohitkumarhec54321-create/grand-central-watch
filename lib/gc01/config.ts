export type Finish = 'steel' | 'noir' | 'gold' | 'two-tone';
export const finishes: {
  id: Finish;
  name: string;
  description: string;
  swatch: string;
}[] = [
  {
    id: 'steel',
    name: 'Brushed steel',
    description: 'Cool silver. Charcoal dial.',
    swatch: '#b7b9b9',
  },
  {
    id: 'noir',
    name: 'Midnight PVD',
    description: 'Blackened metal. Quiet contrast.',
    swatch: '#353638',
  },
  {
    id: 'gold',
    name: 'Champagne gold',
    description: 'Warm metal. A softer light.',
    swatch: '#b49a69',
  },
  {
    id: 'two-tone',
    name: 'Steel & gold',
    description: 'Two tones. One considered whole.',
    swatch: 'linear-gradient(90deg,#b7b9b9 50%,#b49a69 50%)',
  },
];
export const chapters = [
  {
    at: 0,
    tag: 'A STUDY IN TIME',
    title: 'Considered.\nIn every dimension.',
    copy: 'A sculpted case. A quiet dial.\nAn appreciation of everything within.',
    word: 'GC—01',
    image: 'hero',
  },
  {
    at: 0.16,
    tag: 'THE ARCHITECTURE',
    title: 'Nothing without\npurpose.',
    copy: 'From crystal to caseback, every layer finds its place. The whole begins with the smallest part.',
    word: 'IN DETAIL',
    image: 'exploded',
  },
  {
    at: 0.36,
    tag: 'CASE & CROWN',
    title: 'A slim\nprofile.',
    copy: 'A softened square meets a circular bezel. Brushed planes give way to polished edges.',
    word: 'PROFILE',
    image: 'profile',
  },
  {
    at: 0.46,
    tag: 'THE POINT OF CONTACT',
    title: 'Elegant\ncontours.',
    copy: 'A finely fluted crown. An unbroken line. Small gestures, considered from every angle.',
    word: 'CONTOUR',
    image: 'crown',
  },
  {
    at: 0.56,
    tag: 'DIAL & COMPLICATION',
    title: 'Clarity,\nby design.',
    copy: 'Applied hour markers. Faceted hands. A small-seconds register that leaves room to breathe.',
    word: 'CLARITY',
    image: 'dial',
  },
  {
    at: 0.68,
    tag: 'BENEATH THE SURFACE',
    title: 'A rhythm\nwithin.',
    copy: 'Gears, bridges and jewel-toned pivots form a mechanical landscape beneath the exhibition back.',
    word: 'PRECISION',
    image: 'movement',
  },
  {
    at: 0.82,
    tag: 'RETURN TO THE ESSENTIAL',
    title: 'Many parts.\nOne expression.',
    copy: 'The assembly returns to its quiet silhouette. A single form, ready for a different character.',
    word: 'GC—01',
    image: 'reassembled',
  },
] as const;
