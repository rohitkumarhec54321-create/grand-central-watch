"""Refresh the explicitly featured catalog snapshot from saved official homepage HTML."""
from pathlib import Path
import re, html, json, urllib.request, urllib.parse, io
from PIL import Image
source=Path('/private/tmp/gcw-home.html').read_text()
pattern=r'<a href="(/shop/[^\"]+)">\s*<img src="([^\"]+)"\s*>\s*<strong>(.*?)</strong>.*?<p>(?:<strong>)?\$([\d,.]+)'
items=[]
for i,(url,image,title,price) in enumerate(re.findall(pattern,source,re.S)):
    parts=[html.unescape(re.sub('<[^>]+>','',x)).strip() for x in re.split(r'<br\s*/?>',title)]
    items.append(dict(id=url.split('/')[-1],name=parts[0],model=' '.join(parts[1:]),price=float(price.replace(',','')),category=url.split('/')[2],url='https://centralwatch.com'+url,image=f'/official/product-{i+1:02}.webp',sourceImage='https://centralwatch.com'+image))
assert len(items)==14, f'Expected 14 featured items, found {len(items)}'
assets=[(p['sourceImage'],p['image']) for p in items]+[('https://centralwatch.com/images/fileman/2023/b056ef0f_4e91_4d12_9f9d_c8c85971.jpg','/official/workshop.webp')]
for url,dest in assets:
    request=urllib.request.Request(urllib.parse.quote(url,safe=':/%'),headers={'User-Agent':'Mozilla/5.0'})
    raw=urllib.request.urlopen(request,timeout=30).read()
    image=Image.open(io.BytesIO(raw)); image.thumbnail((1440,1440) if 'workshop' in dest else (900,1100))
    image.convert('RGB').save(Path('public'+dest),'WEBP',quality=85,method=6)
Path('lib/catalog.json').write_text(json.dumps(items,indent=2,ensure_ascii=False)+'\n')
print(f'Imported {len(items)} featured products and workshop image from the official site.')
