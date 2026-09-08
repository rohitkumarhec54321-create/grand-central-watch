'use client';
import { useState } from 'react';
import { brands, INQUIRY } from '@/lib/site-content';
export default function BrandDirectory(){const [query,setQuery]=useState('');const shown=brands.filter(b=>b.toLowerCase().includes(query.toLowerCase().trim()));return <><label className="brand-search">Find your watchmaker<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search a brand…"/></label><div className="brand-directory" aria-live="polite">{shown.map(b=><span key={b}>{b}</span>)}{!shown.length&&<p>No match in this directory. <a href={INQUIRY}>Ask about your watch ↗</a></p>}</div><p className="fine-print">Service depends on the model and parts availability. Smartwatches are excluded; certain proprietary models require factory service.</p></>}
