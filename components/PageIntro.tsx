import Link from 'next/link';
import KineticHeading from './KineticHeading';
export default function PageIntro({label,title,em,children}:{label:string;title:string;em:string;children?:React.ReactNode}) {
  return <section className="page-intro"><nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/">Grand Central Watch</Link><span aria-hidden="true">/</span><span aria-current="page">{label}</span></nav><div><span className="atelier-label">{label}</span><KineticHeading as="h1" text={`${title}\n${em}`} className="kinetic-page"/>{children&&<p>{children}</p>}</div></section>;
}
