import Link from 'next/link';
import { CONTACT, INQUIRY, REPAIR_FORM, OFFICIAL } from '@/lib/site-content';
export default function SiteFooter(){return <footer className="full-footer">
  <div className="footer-invitation" data-editorial-reveal><span className="atelier-label">TIME DESERVES CARE.</span><h2>Let’s begin<br/><em>with your watch.</em></h2><a href={INQUIRY} className="editorial-link">Start a repair inquiry <span>↗</span></a></div>
  <div className="footer-columns"><div><Link className="footer-signature" href="/">Grand Central Watch</Link><p>45th Street Passageway, beside Track 38<br/>Grand Central Terminal<br/>New York, NY 10017</p><a href={CONTACT.tel}>{CONTACT.phone}</a><a className="footer-email" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></div>
    <div><h3>The atelier</h3><Link href="/our-story">Our story</Link><Link href="/craft">The collected studies</Link><Link href="/journal">News & media</Link><Link href="/visit">Location & hours</Link><a href={`${OFFICIAL}/contact-us`}>Contact us</a></div>
    <div><h3>Client services</h3><Link href="/services">Repair & restoration</Link><Link href="/services#mail-in">Mail-in service</Link><a href={REPAIR_FORM}>Download repair form ↗</a><Link href="/client-care">Warranty & questions</Link><a href="https://repair.centralwatch.com/">Your repair collection ↗</a></div>
    <div><h3>The collection</h3><Link href="/shop">Featured timepieces</Link><a href={`${OFFICIAL}/shop/micro-brand`}>All microbrands ↗</a><a href={`${OFFICIAL}/shop/straps`}>All straps ↗</a><a href={`${OFFICIAL}/shop/affordable-fine-jewelry`}>All fine jewelry ↗</a><a href={`${OFFICIAL}/member-login/login`}>Account / register ↗</a></div>
  </div><div className="footer-bottom"><span>UNAFFILIATED PORTFOLIO CONCEPT · GRAND CENTRAL WATCH</span><Link href="/client-care#purchase-care">Returns & terms</Link><a href={`${OFFICIAL}/`}>Join the mailing list ↗</a><a href="#page-top">Back to top ↑</a></div>
</footer>}
