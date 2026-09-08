"""Optimize the 16 user-supplied reference images, retaining their full compositions."""
from pathlib import Path
from PIL import Image, ImageOps
import json
source=Path('/Users/khushikumari/Downloads')
items=[
('movement-overview','3D_watch_with_geometric_casing_202608240423.jpeg'),
('crystal-lift','ChatGPT Image Aug 27, 2026, 10_21_06 AM.png'),
('exploded-perspective','ChatGPT Image Aug 27, 2026, 10_21_26 AM.png'),
('exploded-axis','ChatGPT Image Aug 27, 2026, 10_21_34 AM.png'),
('carbon-hero','ChatGPT Image Aug 30, 2026, 06_30_49 PM.png'),
('longines-front','ChatGPT Image Sep 2, 2026, 06_57_18 AM.png'),
('iwc-portrait','ChatGPT Image Sep 2, 2026, 06_57_10 AM.png'),
('longines-perspective','ChatGPT Image Sep 2, 2026, 07_01_16 AM.png'),
('longines-views','ChatGPT Image Sep 2, 2026, 06_57_26 AM.png'),
('iwc-orbit','ChatGPT Image Sep 2, 2026, 06_52_30 AM.png'),
('iwc-views','ChatGPT Image Sep 2, 2026, 06_35_39 AM.png'),
('hublot-views','ChatGPT Image Sep 2, 2026, 06_35_32 AM.png'),
('movement-architecture','Watch_movement_assembly_diagram_2K_202608240432 (1).jpeg'),
('movement-energy','Watch_movement_assembly_diagram_2K_202608240432.jpeg'),
('movement-balance','Watch_movement_interior_view_ass…_202608240432.jpeg'),
('movement-hairspring','Watch_movement_schematic_view_2K_202608240432.jpeg'),
]
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
