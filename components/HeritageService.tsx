import Link from 'next/link';
import KineticHeading from './KineticHeading';
import PressStrip from './PressStrip';
import { process, INQUIRY } from '@/lib/site-content';
export default function HeritageService() {
  return <section className="heritage-cinema" id="heritage" aria-labelledby="heritage-title">
    <div className="section-register"><span>03 / HERITAGE & SERVICE</span><span>NEW YORK · SINCE 1952</span></div>
    <KineticHeading text={'Time.\nWell kept.'} id="heritage-title" />
    <div className="heritage-story"><span className="heritage-year" aria-hidden="true">1952</span><div><h3>Nearly 75 Years of<br/>Watchmaking Expertise</h3><p>Inside Grand Central Terminal since 1952. An enduring New York address for the watches that mark our lives, and the people who care for them.</p><Link className="editorial-link" href="/our-story">Discover Our Story <span>↗</span></Link></div></div>
    <div className="heritage-service-heading"><span className="atelier-label">A CONSIDERED APPROACH TO CARE</span><p>Three steps. A personal conversation.</p></div>
    <ol className="heritage-process">{process.map(([title, description], i) => <li key={title} data-editorial-reveal><span>0{i + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
    <div className="heritage-visit"><address>45th Street Passageway<br/>Grand Central Terminal<br/>New York, NY 10017</address><Link className="solid-link" href="/visit">Visit the Atelier <span>↗</span></Link><a className="editorial-link" href={INQUIRY}>Start a repair inquiry <span>↗</span></a></div>
    <PressStrip />
  </section>;
}
