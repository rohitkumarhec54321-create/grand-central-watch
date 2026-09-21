export const OFFICIAL = 'https://centralwatch.com';
export const INQUIRY = `${OFFICIAL}/machform/view.php?id=11883`;
export const REPAIR_FORM = `${OFFICIAL}/images/fileman/Grand%20Central%20Watch%20Repair%20Form%20-%202026.pdf`;
export const CONTACT = { phone: '(212) 685-1689', tel: 'tel:+12126851689', email: 'centralwatchrepair@gmail.com', sms: 'sms:+16467892900' };
export const navigation = [
  { label: 'Service & restoration', href: '/services', description: 'Care for the timepiece you treasure.' },
  { label: 'The collection', href: '/collection', description: 'Vintage, contemporary, and independent.' },
  { label: 'Our story', href: '/our-story', description: 'Three generations. One New York institution.' },
  { label: 'The craft', href: '/craft', description: 'Eight studies in watchmaking.' },
  { label: 'Visit the atelier', href: '/visit', description: 'Find us beside Track 38.' },
  { label: 'The journal', href: '/journal', description: 'In print, on film, and through the years.' },
  { label: 'Client care', href: '/client-care', description: 'Answers, warranties, and purchase information.' },
];
export const prices = [
  ['Vintage restoration', 995], ['Chronograph overhaul', 1250], ['Mechanical overhaul', 650], ['Quartz overhaul', 550],
  ['Ultrasonic band cleaning', 65], ['Case refinishing', 275], ['Bracelet refinishing', 175], ['Bracelet sizing', 25],
  ['Crystal replacement', 75], ['Crystal polishing', 35], ['Battery replacement', 15], ['Appraisal', 125],
] as const;
export const brands = ['A. Lange & Söhne','Audemars Piguet','Baume & Mercier','Breguet','Breitling','Buccellati','Bulgari','Bulova','Cartier','Chopard','ChronoSport','Chronoswiss','Croton','Dunhill','Ebel','Elgin','Hamilton','Hermès','Heuer','Illinois','IWC','Jaeger-LeCoultre','Longines','Montblanc','Omega','Panerai','Patek Philippe','Piaget','Pierce','Roger Dubuis','Rolex','Seiko','TAG Heuer','Tiffany & Co.','Tourneau','Tudor','Tutima','Vacheron Constantin','Van Cleef & Arpels','Waldan Watches','Waltham','Wittnauer','Zodiac'];
export const process = [
  ['Begin a conversation', 'Visit the boutique, or send an inquiry before bringing or mailing your watch.'],
  ['Receive guidance', 'The team reviews your inquiry and advises on the next step.'],
  ['A closer inspection', 'A watchmaker examines the timepiece in person.'],
  ['Approve the estimate', 'Review the proposed work, cost, and timing before deciding.'],
  ['Entrust the work', 'A 50% deposit follows approval. Service and testing then begin.'],
  ['Return to your wrist', 'Collect your watch or arrange its return shipment.'],
];
export const faqs = [
  { category: 'Service', q: 'May I visit without an online inquiry?', a: 'Yes. Bring your watch directly to the boutique. An online inquiry is optional for an in-person visit.' },
  { category: 'Service', q: 'Can you quote from photographs?', a: 'Photographs help with initial review. Final recommendations, parts availability, price, and timing require physical inspection.' },
  { category: 'Service', q: 'What happens if I decline the estimate?', a: 'An evaluation fee of $45–$275 applies, depending on the watch and complexity. Estimates remain on file for three months.' },
  { category: 'Service', q: 'How long does a repair take?', a: 'Most approved services take 1–9 weeks. The estimate confirms the expected timing for your watch.' },
  { category: 'Service', q: 'Can you help with a battery, strap, or sizing?', a: 'Yes. Some simple jobs can be completed quickly, depending on the watch and workshop schedule. Battery replacement alone does not establish water resistance.' },
  { category: 'Service', q: 'Do you work on every watch?', a: 'Many modern and vintage brands are supported. Smartwatches are excluded; certain proprietary models require factory service. Ask about unlisted brands.' },
  { category: 'Service', q: 'Do you provide appraisals?', a: 'Standalone appraisals start at $125. The published FAQ also lists appraisals as complimentary with complete service; confirm with the team when arranging service.' },
  { category: 'Mail-in', q: 'When can I send my watch?', a: 'New clients should submit an inquiry and wait for confirmation and shipping instructions. Familiar returning clients may use the printable repair form.' },
  { category: 'Mail-in', q: 'What should I put in the package?', a: 'Include the repair form, contact details, watch identification, and a description of the issue. Fully insure the shipment. Leave out original boxes, manuals, and unrelated accessories unless requested.' },
  { category: 'Warranty', q: 'What does the service warranty cover?', a: 'Complete movement service has a 24-month limited warranty covering the work performed and installed parts. Partial work does not carry an overall running warranty.' },
  { category: 'Warranty', q: 'What if a serviced watch develops an issue?', a: 'Contact the team with your repair number and a description before another provider opens or adjusts the watch.' },
  { category: 'Shopping', q: 'Can I sell a watch to Grand Central Watch?', a: 'Yes. Bring luxury, vintage, or antique watches to the boutique for a purchase evaluation.' },
  { category: 'Shopping', q: 'Is the entire inventory online?', a: 'No. Ask the team about particular references, styles, or brands. The boutique holds additional inventory.' },
  { category: 'Shopping', q: 'Are microbrand watches new?', a: 'The collection includes new microbrand watches alongside serviced pre-owned pieces. Check the individual product listing for condition and availability.' },
];
export const resources = [
  ['Repair inquiry', INQUIRY], ['Printable repair form', REPAIR_FORM], ['Repair collection login', 'https://repair.centralwatch.com/'],
  ['Shop account / register', `${OFFICIAL}/member-login/login`], ['Shopping bag', `${OFFICIAL}/shopping-cart`],
  ['All pre-owned watches', `${OFFICIAL}/shop/pre-owned`], ['All microbrand watches', `${OFFICIAL}/shop/micro-brand`], ['All straps', `${OFFICIAL}/shop/straps`], ['All fine jewelry', `${OFFICIAL}/shop/affordable-fine-jewelry`],
  ['Contact form', `${OFFICIAL}/contact-us`], ['Customer reviews', `${OFFICIAL}/feedback`], ['Press articles', `${OFFICIAL}/press-articles`], ['Press videos', `${OFFICIAL}/press-videos`], ['70th anniversary', `${OFFICIAL}/70th-anniversary-`],
  ['Instagram', 'https://www.instagram.com/GrandCentralWatch/'], ['YouTube', 'https://www.youtube.com/channel/UCCqoOD29rcYPaXiTpmLNrxA'], ['Facebook', 'https://www.facebook.com/GrandCentralWatch'], ['LinkedIn', 'https://www.linkedin.com/company/central-watch/'],
  ['Return policy', `${OFFICIAL}/return-policy`], ['Terms & conditions', `${OFFICIAL}/terms-conditions`], ['Common questions', `${OFFICIAL}/commonly-asked-questions`],
] as const;
export const press = ['HODINKEE', 'GEAR PATROL', 'ROBB REPORT', 'THE WALL STREET JOURNAL', 'NEW YORK MAGAZINE', 'GQ'];
