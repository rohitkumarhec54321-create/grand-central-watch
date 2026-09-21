"""Optimize the 8 user-supplied reference images, retaining their full compositions."""
from pathlib import Path
from PIL import Image, ImageOps
import json
source=Path('/Users/khushikumari/Downloads')
items=[(item['id'],item['source']) for item in json.loads(Path('public/watch-gallery/manifest.json').read_text())]
root=Path('public/watch-gallery');root.mkdir(exist_ok=True)
manifest=[]
for name,filename in items:
 with Image.open(source/filename) as src:
  im=ImageOps.exif_transpose(src).convert('RGB'); original=im.size
  im.thumbnail((1920,1920));im.save(root/f'{name}.webp','WEBP',quality=86,method=6)
  im.thumbnail((900,900));im.save(root/f'{name}-small.webp','WEBP',quality=81,method=6)
  manifest.append({'id':name,'source':filename,'width':original[0],'height':original[1]})
(root/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Prepared',len(manifest),'unique images; full and compact versions:',round(sum(p.stat().st_size for p in root.glob('*.webp'))/1024/1024,2),'MiB')
