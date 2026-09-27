import Link from 'next/link';
import KineticHeading from './KineticHeading';
import CollectionExplorer from './CollectionExplorer';
export default function ShopSection() {
  return <section className="shop-cinema" id="shop" aria-labelledby="shop-title">
    <div className="section-register"><span>02 / THE CURATED COLLECTION</span><span>14 PIECES · THREE POINTS OF VIEW</span></div>
    <KineticHeading text={'Objects of\nappreciation.'} id="shop-title" />
    <div className="shop-introduction"><p>Established icons. Independent voices.<br/>The considered details that make them yours.</p><Link className="solid-link" href="/shop">Shop Watches <span>↗</span></Link></div>
    <CollectionExplorer />
  </section>;
}
