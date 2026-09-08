/* eslint-disable next/no-img-element -- Images are pre-optimized WebP assets for the static export. */
'use client';
import { useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from './ui/dialog';
import catalog from '@/lib/catalog.json';
export type Product = typeof catalog[number];
export const currency = (value:number) => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:Number.isInteger(value)?0:2}).format(value);
export function filterProducts(items:Product[],category:string,query:string,sort:string){
  const words=query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  const result=items.filter(p=>(category==='all'||p.category===category)&&words.every(word=>`${p.name} ${p.model}`.toLowerCase().includes(word)));
  return sort==='low'?result.sort((a,b)=>a.price-b.price):sort==='high'?result.sort((a,b)=>b.price-a.price):result;
}
export default function CollectionExplorer({preview=false}:{preview?:boolean}) {
  const [category,setCategory]=useState('all'),[query,setQuery]=useState(''),[sort,setSort]=useState('featured');
  const [selected,setSelected]=useState<Product|null>(null);
  const opener=useRef<HTMLButtonElement|null>(null);
  const shown=preview?catalog.slice(0,3):filterProducts(catalog,category,query,sort);
  const categories=[['all','All pieces'],['pre-owned','Pre-owned'],['micro-brand','Microbrands'],['straps','Straps'],['affordable-fine-jewelry','Fine jewelry']];
  return <div className="collection-explorer">
    {!preview&&<><fieldset className="filter-categories" aria-label="Filter collection">{categories.map(([id,label])=><button key={id} aria-pressed={category===id} onClick={()=>setCategory(id)}>{label}</button>)}</fieldset><div className="collection-controls"><label className="inline-search"><Search size={18}/><span className="sr-only">Search featured collection</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search by brand or reference"/></label><label className="sort-control">Sort by <select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div><p className="result-count" aria-live="polite">{shown.length} {shown.length===1?'piece':'pieces'} in this selection</p></>}
    <div className="product-grid">{shown.map((p,i)=><article key={p.id} className="product-card" style={{'--item-delay':`${Math.min(i,5)*55}ms`} as React.CSSProperties}><button className="product-image" onClick={e=>{opener.current=e.currentTarget;setSelected(p)}} aria-label={`Inspect ${p.name} ${p.model}`}><img src={p.image} alt={`${p.name} ${p.model}`} width={900} height={1100} loading="lazy"/><span>Inspect the piece <span>↗</span></span></button><div className="product-meta"><div><small>{categories.find(([id])=>id===p.category)?.[1]}</small><h3><a href={p.url}>{p.name}</a></h3><p>{p.model||'Grand Central Watch selection'}</p></div><span>{currency(p.price)}</span></div></article>)}</div>
    {!shown.length&&<div className="empty-selection"><h3>A different reference?</h3><p>Try another search, or ask the atelier about pieces beyond the online collection.</p><button className="solid-link" onClick={()=>{setCategory('all');setQuery('');setSort('featured')}}>Reset the selection</button></div>}
    <p className="catalog-note">Featured selection recorded September 9, 2026. Prices are in USD. Confirm current price, condition, and availability on the individual listing.</p>
    <Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null)}}><DialogContent className="atelier-dialog product-dialog" finalFocus={opener} showCloseButton={false} data-lenis-prevent><DialogClose className="product-close icon-button" aria-label="Close product details"><X size={23}/></DialogClose>{selected&&<><div className="product-dialog-image"><img src={selected.image} alt={`${selected.name} ${selected.model}`} width={900} height={1100}/></div><div className="product-dialog-copy"><span className="atelier-label">THE GRAND CENTRAL WATCH COLLECTION</span><DialogTitle>{selected.name}</DialogTitle><DialogDescription>{selected.model||'Selected by Grand Central Watch'}</DialogDescription><p className="product-price">{currency(selected.price)}</p><p>Explore the full listing for specifications, condition, and current availability.</p><a className="solid-link" href={selected.url}>View & purchase <ArrowUpRight size={17}/></a><small>Continue to centralwatch.com</small></div></>}</DialogContent></Dialog>
  </div>;
}
