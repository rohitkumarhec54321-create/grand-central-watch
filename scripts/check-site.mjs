import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import ts from 'typescript';
const src=fs.readFileSync('components/CollectionExplorer.tsx','utf8');
const ast=ts.createSourceFile('collection.tsx',src,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
const fn=ast.statements.find(s=>ts.isFunctionDeclaration(s)&&s.name?.text==='filterProducts');
assert(fn);
const js=ts.transpileModule(fn.getText(ast).replace(/^export /,''),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
const filter=vm.runInNewContext(js+'\nfilterProducts');
const catalog=JSON.parse(fs.readFileSync('lib/catalog.json','utf8'));
const original=JSON.stringify(catalog);
assert.equal(catalog.length,14);
assert.equal(filter(catalog,'pre-owned','rolex','featured').length,1);
assert.equal(filter(catalog,'pre-owned','rolex 8469','featured').length,1);
assert.equal(filter(catalog,'micro-brand','rolex','featured').length,0);
assert.equal(filter(catalog,'all','no matching reference','featured').length,0);
assert.equal(filter(catalog,'all','  PATEK  ','featured')[0].id,'patek-philippe-calatrava-2906');
const low=filter(catalog,'all','','low'),high=filter(catalog,'all','','high');
for(let i=1;i<low.length;i++)assert(low[i].price>=low[i-1].price);
for(let i=1;i<high.length;i++)assert(high[i].price<=high[i-1].price);
assert.equal(JSON.stringify(catalog),original,'Filtering and sorting must not mutate the shared catalog');
for(const product of catalog) assert(fs.existsSync(`public${product.image}`),product.image);
const routes=['/','/services','/collection','/our-story','/visit','/journal','/client-care','/craft'];
const filename=route=>route==='/'?'out/index.html':`out${route}.html`;
const pages=new Map(routes.map(route=>[route,fs.readFileSync(filename(route),'utf8')]));
const ids=html=>[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
for(const [route,html] of pages){
 const anchors=ids(html);
 assert.equal(new Set(anchors).size,anchors.length,`Duplicate IDs on ${route}`);
 assert(html.includes('id="main-content"'),`Missing skip target: ${route}`);
 assert.equal((html.match(/<main\b/g)||[]).length,1,`One main landmark: ${route}`);
 for(const match of html.matchAll(/<a\b[^>]*href="([^"?]+)"/g)){
   const url=match[1];if(!url.startsWith('/')&&!url.startsWith('#'))continue;
   const [path,hash]=url.split('#');const target=path||route;
   assert(pages.has(target),`Broken route ${route} -> ${url}`);
   if(hash)assert(ids(pages.get(target)).includes(hash),`Broken anchor ${route} -> ${url}`);
 }
 for(const match of html.matchAll(/<img\b[^>]*src="([^"]+)"/g)){
   const path=match[1];if(path.startsWith('/'))assert(fs.existsSync(`out${path}`),`Missing image: ${path}`);
 }
}
assert.equal((pages.get('/craft').match(/data-gallery-id=/g)||[]).length,16,'All 16 supplied studies must render');
assert(pages.get('/services').includes('52 Vanderbilt Avenue'),'Dedicated shipping address');
assert(pages.get('/visit').includes('45th Street Passageway'),'Boutique address');
console.log('Passed: 8 routes, all internal links and anchors, image paths, 16 study images, 14 catalog items, query/category/sort/empty states, and distinct mail-in/boutique addresses.');
