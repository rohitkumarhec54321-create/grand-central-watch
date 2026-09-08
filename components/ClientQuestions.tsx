'use client';
import { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './ui/accordion';
import { faqs } from '@/lib/site-content';
export default function ClientQuestions(){const [filter,setFilter]=useState('All');const rows=faqs.filter(x=>filter==='All'||x.category===filter);return <div><fieldset className="filter-categories" aria-label="Question categories">{['All','Service','Mail-in','Warranty','Shopping'].map(x=><button key={x} aria-pressed={filter===x} onClick={()=>setFilter(x)}>{x}</button>)}</fieldset><Accordion className="client-accordion" key={filter}>{rows.map((x,i)=><AccordionItem key={x.q} value={x.q}><AccordionTrigger><span className="question-index">{String(i+1).padStart(2,'0')}</span><span>{x.q}</span></AccordionTrigger><AccordionContent>{x.a}</AccordionContent></AccordionItem>)}</Accordion></div>}
