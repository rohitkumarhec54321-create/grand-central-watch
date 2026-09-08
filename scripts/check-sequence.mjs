import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import ts from 'typescript';
// Evaluate the actual exported pure mappings without loading DOM-only imports.
const source = fs.readFileSync('components/ScrollWatchSequence.tsx', 'utf8');
const file = ts.createSourceFile('sequence.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
const wanted = new Set(['frameForProgress', 'chapterForFrame', 'WATCH_CHAPTERS']);
const declarations = file.statements.filter(statement => ts.isVariableStatement(statement) && statement.declarationList.declarations.some(d => wanted.has(d.name.getText(file))));
const code = declarations.map(statement => statement.getText(file).replace(/^export /, '')).join('\n');
const js = ts.transpileModule(code, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
const {frameForProgress, chapterForFrame, WATCH_CHAPTERS: chapters} = vm.runInNewContext(`${js}\n({frameForProgress,chapterForFrame,WATCH_CHAPTERS})`);
assert.equal(frameForProgress(0,131),0);
assert.equal(frameForProgress(1,131),130);
assert.equal(frameForProgress(.5,131),65);
assert.equal(frameForProgress(-1,131),0);
assert.equal(frameForProgress(2,131),130);
for(let frame=0;frame<131;frame++) assert.equal(frameForProgress(frame/130,131),frame);
for(let frame=130;frame>=0;frame--) assert.equal(frameForProgress(frame/130,131),frame);
chapters.forEach((chapter,index) => {
 assert.equal(chapterForFrame(chapter.frame,chapters),index);
 if(index) assert.equal(chapterForFrame(chapter.frame-1,chapters),index-1);
 assert(chapter.frame>=0 && chapter.frame<131);
});
assert.equal(chapterForFrame(130,chapters),5);
assert(!/scrub\s*:/.test(source), 'No eased scrub tween should exist');
console.log('Passed: all frame indices forward/backward, clamping, chapter boundaries, final frame, and no scrub tween.');
