'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRef, useState } from 'react';
import { Menu, Search, ArrowUpRight, ShoppingBag, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import { navigation, INQUIRY, CONTACT, resources, prices, brands, faqs } from '@/lib/site-content';
import catalog from '@/lib/catalog.json';

export default function SiteHeader() {
  const pathname = usePathname();
  const [panel, setPanel] = useState<'menu' | 'search' | null>(null);
  const [query, setQuery] = useState('');
  const opener = useRef<HTMLButtonElement | null>(null);
  const index = [...navigation.map(x => ({title:x.label, detail:x.description, url:x.href})), ...resources.map(([title,url])=>({title,detail:'Grand Central Watch',url})), ...catalog.map(x=>({title:`${x.name} ${x.model}`,detail:'The collection',url:x.url})), ...prices.map(([title,price])=>({title,detail:`Service from $${price}`,url:'/services#pricing'})), ...brands.map(title=>({title,detail:'Brands serviced',url:'/services#brands'})), ...faqs.map(x=>({title:x.q,detail:x.a,url:'/client-care'}))];
  const results = index.filter(x => `${x.title} ${x.detail}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0,12);
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="concierge-bar"><Link href="/visit">INSIDE GRAND CENTRAL TERMINAL · SINCE 1952</Link><a href={CONTACT.tel}>{CONTACT.phone}</a></div>
    <header className="site-header luxury-header" id="page-top">
      <nav className="header-nav" aria-label="Main navigation"><Link href="/services" aria-current={pathname==='/services'?'page':undefined}>Service & restoration</Link><Link href="/collection" aria-current={pathname==='/collection'?'page':undefined}>The collection</Link></nav>
      <Link className="wordmark" href="/" aria-label="Grand Central Watch home"><span>GRAND CENTRAL</span><strong>WATCH</strong><small>NEW YORK · 1952</small></Link>
      <div className="header-actions"><Link className="visit-nav" href="/visit">Visit us</Link><button aria-label="Search the site" onClick={e=>{opener.current=e.currentTarget;setPanel('search')}}><Search size={19}/></button><a className="bag-nav" href="https://centralwatch.com/shopping-cart" aria-label="Open shopping bag on Grand Central Watch"><ShoppingBag size={19}/></a><button aria-label="Open navigation menu" onClick={e=>{opener.current=e.currentTarget;setPanel('menu')}}><Menu size={23}/></button></div>
    </header>
    <Dialog open={panel!==null} onOpenChange={open=>{if(!open)setPanel(null)}}>
      <DialogContent className={`atelier-dialog ${panel==='menu'?'navigation-dialog':'search-dialog'}`} finalFocus={opener} showCloseButton={false} data-lenis-prevent>
        <div className="dialog-topline"><span className="atelier-label">GRAND CENTRAL WATCH</span><DialogClose className="icon-button" aria-label="Close navigation or search"><X size={24}/></DialogClose></div>
        <DialogTitle className="dialog-heading">{panel==='search'?'What brings you here?':'A lifetime of care.'}</DialogTitle>
        <DialogDescription className="sr-only">{panel==='search'?'Search pages, services, and featured timepieces.':'Explore Grand Central Watch and client services.'}</DialogDescription>
        {panel==='menu'?<><nav className="expanded-nav" aria-label="All pages">{navigation.map((item,i)=><Link key={item.href} href={item.href} onClick={()=>setPanel(null)} aria-current={pathname===item.href?'page':undefined}><span className="nav-index">0{i+1}</span><span>{item.label}<small>{item.description}</small></span><ArrowUpRight size={24}/></Link>)}</nav><div className="dialog-contact"><a className="solid-link" href={INQUIRY}>Begin a repair inquiry <ArrowUpRight size={16}/></a><a href={CONTACT.tel}>{CONTACT.phone}</a></div></>:<><label className="search-field"><Search size={20}/><span className="sr-only">Search services, watches, and pages</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try Rolex, repair, warranty…" type="search"/></label><p className="search-count" aria-live="polite">{query?`${results.length} matching results`:'Explore the atelier'}</p><div className="search-results">{results.map(item=><a key={`${item.url}:${item.title}`} href={item.url} onClick={()=>setPanel(null)}><span><small>{item.detail}</small>{item.title}</span><ArrowUpRight size={18}/></a>)}{!results.length&&<p>No matches yet. Try a brand name or “service”, or <a href={CONTACT.tel}>call the atelier</a>.</p>}</div></>}
      </DialogContent>
    </Dialog>
  </>;
}
