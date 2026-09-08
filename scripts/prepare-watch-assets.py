"""Extract a supplied reel evenly into WebP frames; requires FFmpeg and Pillow.
Usage: python scripts/prepare-watch-assets.py SOURCE.mp4 --ffmpeg /path/to/ffmpeg
"""
import argparse,json,math,re,subprocess
from pathlib import Path
from PIL import Image
p=argparse.ArgumentParser(); p.add_argument('source'); p.add_argument('--ffmpeg',default='ffmpeg'); args=p.parse_args()
probe=subprocess.run([args.ffmpeg,'-i',args.source],capture_output=True,text=True)
m=re.search(r'Duration: (\d+):(\d+):([\d.]+)',probe.stderr)
if not m: raise SystemExit('Cannot read source duration')
duration=int(m[1])*3600+int(m[2])*60+float(m[3]); count=min(150,max(120,round(duration*5)))
out=Path('public/watch-sequence'); frames=out/'frames'; mobile=out/'mobile'
frames.mkdir(parents=True,exist_ok=True); mobile.mkdir(parents=True,exist_ok=True)
subprocess.run([args.ffmpeg,'-y','-i',args.source,'-vf',f'fps={count/duration},scale=720:-2','-frames:v',str(count),'-c:v','libwebp','-quality','78','-compression_level','5',str(frames/'frame_%04d.webp')],check=True)
for path in sorted(frames.glob('frame_*.webp'))[:count]:
 with Image.open(path) as im:
  im.thumbnail((480,480)); im.save(mobile/path.name,'WEBP',quality=74,method=5)
with Image.open(frames/'frame_0001.webp') as im: im.save(out/'poster.webp','WEBP',quality=85)
manifest={'source':Path(args.source).name,'duration':duration,'totalFrames':count,'fps':count/duration,'format':'webp','desktopWidth':720,'mobileWidth':480}
(out/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
print(manifest)
