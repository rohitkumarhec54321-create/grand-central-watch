import * as T from 'three';
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import {
  mergeGeometries,
  mergeVertices,
} from 'three/addons/utils/BufferGeometryUtils.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import fs from 'node:fs';
// Node's Blob is available; GLTFExporter only needs this small FileReader surface.
globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = b;
      this.onloadend?.();
    });
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then((b) => {
      this.result = `data:${blob.type};base64,${Buffer.from(b).toString('base64')}`;
      this.onloadend?.();
    });
  }
};
const font = new FontLoader().parse(
  JSON.parse(
    fs.readFileSync('scripts/assets/helvetiker_regular.typeface.json', 'utf8'),
  ),
);
const root = new T.Group();
root.name = 'GC01_ATELIER_STUDY';
const steel = new T.MeshStandardMaterial({
  name: 'steel',
  color: '#aeb2b4',
  metalness: 1,
  roughness: 0.3,
});
const polished = new T.MeshStandardMaterial({
  name: 'polished',
  color: '#e0e1e0',
  metalness: 1,
  roughness: 0.13,
});
const accent = new T.MeshStandardMaterial({
  name: 'accent',
  color: '#b2b6b8',
  metalness: 1,
  roughness: 0.23,
});
const dialMat = new T.MeshStandardMaterial({
  name: 'dial',
  color: '#24282a',
  metalness: 0.12,
  roughness: 0.58,
});
const print = new T.MeshStandardMaterial({
  name: 'print',
  color: '#c9c5b9',
  metalness: 0.1,
  roughness: 0.65,
});
const gold = new T.MeshStandardMaterial({
  name: 'movement_gold',
  color: '#bb9659',
  metalness: 0.92,
  roughness: 0.3,
});
const dark = new T.MeshStandardMaterial({
  name: 'recess',
  color: '#17191a',
  metalness: 0.6,
  roughness: 0.5,
});
const jewel = new T.MeshStandardMaterial({
  name: 'jewel',
  color: '#733444',
  metalness: 0.45,
  roughness: 0.22,
});
const glass = new T.MeshPhysicalMaterial({
  name: 'crystal',
  color: '#ffffff',
  metalness: 0,
  roughness: 0.04,
  transparent: true,
  opacity: 0.075,
  depthWrite: false,
  side: T.DoubleSide,
});
const part = (name, explode) => {
  const group = new T.Group();
  group.name = name;
  group.userData.explode = explode;
  root.add(group);
  return group;
};
function mesh(parent, geometry, material, name, x = 0, y = 0, z = 0) {
  const object = new T.Mesh(geometry, material);
  object.name = name;
  object.position.set(x, y, z);
  parent.add(object);
  return object;
}
function disk(parent, r, depth, z, mat, name, x = 0, y = 0) {
  const m = mesh(
    parent,
    new T.CylinderGeometry(r, r, depth, 96),
    mat,
    name,
    x,
    y,
    z,
  );
  m.rotation.x = Math.PI / 2;
  return m;
}
function ring(parent, r, inner, depth, z, mat, name) {
  const s = new T.Shape();
  s.absarc(0, 0, r, 0, Math.PI * 2, false);
  const hole = new T.Path();
  hole.absarc(0, 0, inner, 0, Math.PI * 2, true);
  s.holes.push(hole);
  return mesh(
    parent,
    new T.ExtrudeGeometry(s, {
      depth,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.012,
      bevelThickness: 0.012,
      curveSegments: 64,
    }),
    mat,
    name,
    0,
    0,
    z,
  );
}
function label(parent, text, size, y, z, mat = print, x = 0) {
  const g = new TextGeometry(text, {
    font,
    size,
    depth: 0.001,
    curveSegments: 2,
  });
  g.computeBoundingBox();
  g.translate(-(g.boundingBox.max.x - g.boundingBox.min.x) / 2, 0, 0);
  return mesh(parent, g, mat, 'engraving_' + text, x, y, z);
}
const casePart = part('case', [0, 0, 0]);
const outer = new T.Shape();
const w = 1.17,
  h = 1.31,
  r = 0.3;
outer.moveTo(-w + r, -h);
outer.lineTo(w - r, -h);
outer.quadraticCurveTo(w, -h, w, -h + r);
outer.lineTo(w, h - r);
outer.quadraticCurveTo(w, h, w - r, h);
outer.lineTo(-w + r, h);
outer.quadraticCurveTo(-w, h, -w, h - r);
outer.lineTo(-w, -h + r);
outer.quadraticCurveTo(-w, -h, -w + r, -h);
const hole = new T.Path();
hole.absarc(0, 0, 0.955, 0, Math.PI * 2, true);
outer.holes.push(hole);
mesh(
  casePart,
  new T.ExtrudeGeometry(outer, {
    depth: 0.31,
    bevelEnabled: true,
    bevelSegments: 3,
    bevelSize: 0.06,
    bevelThickness: 0.06,
    curveSegments: 24,
  }),
  steel,
  'sculpted_case',
  0,
  0,
  -0.13,
);
for (const side of [-1, 1])
  for (const x of [-0.79, 0.79]) {
    mesh(
      casePart,
      new RoundedBoxGeometry(0.3, 0.58, 0.26, 2, 0.06),
      steel,
      'integrated_lug',
      x,
      side * 1.32,
      0.02,
    );
  }
const bezel = part('bezel', [-0.6, 0.1, 1.3]);
ring(bezel, 1.14, 1.013, 0.09, 0.22, polished, 'polished_bezel');
ring(bezel, 1.09, 1.025, 0.025, 0.32, accent, 'bezel_chamfer');
const crystal = part('crystal', [-1.3, 0.35, 2.5]);
disk(crystal, 1.013, 0.024, 0.367, glass, 'sapphire_crystal');
ring(crystal, 1.02, 1.01, 0.012, 0.36, polished, 'crystal_edge');
const dial = part('dial', [-0.3, 0, 0.66]);
disk(dial, 1.013, 0.065, 0.22, dialMat, 'sunray_dial');
ring(dial, 0.999, 0.965, 0.012, 0.254, polished, 'minute_chapter_ring');
for (let i = 0; i < 60; i++) {
  const a = (i * Math.PI) / 30;
  const major = i % 5 === 0;
  const m = mesh(
    dial,
    new T.BoxGeometry(major ? 0.026 : 0.009, major ? 0.13 : 0.04, 0.008),
    major ? polished : print,
    'minute_' + i,
    Math.sin(a) * 0.925,
    Math.cos(a) * 0.925,
    0.265,
  );
  m.rotation.z = -a;
}
for (let i = 0; i < 12; i++) {
  const a = (i * Math.PI) / 6;
  if (i === 6) continue;
  for (const offset of i === 0 ? [-0.032, 0.032] : [0]) {
    const m = mesh(
      dial,
      new RoundedBoxGeometry(0.036, 0.17, 0.024, 1, 0.007),
      polished,
      'applied_index_' + i,
      Math.sin(a) * 0.81 + offset,
      Math.cos(a) * 0.81,
      0.281,
    );
    m.rotation.z = -a;
  }
}
// Fine concentric turning in the small-seconds register.
disk(dial, 0.235, 0.009, 0.265, dark, 'small_seconds', 0, -0.47);
for (let i = 0; i < 7; i++)
  mesh(
    dial,
    new T.TorusGeometry(0.12 + i * 0.016, 0.0015, 3, 60),
    polished,
    'register_etch',
    0,
    -0.47,
    0.272,
  );
for (let i = 0; i < 12; i++) {
  const a = (i * Math.PI) / 6;
  const m = mesh(
    dial,
    new T.BoxGeometry(0.008, 0.025, 0.005),
    print,
    'seconds_marker',
    Math.sin(a) * 0.208,
    -0.47 + Math.cos(a) * 0.208,
    0.275,
  );
  m.rotation.z = -a;
}
label(dial, 'GRAND CENTRAL', 0.079, 0.34, 0.27);
label(dial, 'WATCH', 0.061, 0.232, 0.27);
label(dial, 'GC - 01', 0.053, -0.08, 0.27);
label(dial, 'NEW YORK', 0.038, -0.82, 0.27);
const hands = part('hands', [-0.7, 0.1, 1.85]);
function hand(name, length, width, angle, z, mat) {
  const s = new T.Shape();
  s.moveTo(-width / 2, -0.12);
  s.lineTo(width / 2, -0.12);
  s.lineTo(width * 0.42, length * 0.68);
  s.lineTo(0, length);
  s.lineTo(-width * 0.42, length * 0.68);
  s.closePath();
  const h = mesh(
    hands,
    new T.ExtrudeGeometry(s, {
      depth: 0.012,
      bevelEnabled: true,
      bevelSize: 0.003,
      bevelThickness: 0.003,
      bevelSegments: 1,
    }),
    mat,
    name,
    0,
    0,
    z,
  );
  h.rotation.z = angle;
  return h;
}
hand('hour_hand', 0.58, 0.084, Math.PI / 3, 0.302, polished);
hand('minute_hand', 0.77, 0.053, -Math.PI / 3, 0.323, polished);
disk(hands, 0.046, 0.03, 0.343, polished, 'hand_hub');
const seconds = mesh(
  dial,
  new T.BoxGeometry(0.008, 0.18, 0.006),
  print,
  'seconds_hand',
  0.03,
  -0.41,
  0.286,
);
seconds.rotation.z = -0.35;
disk(dial, 0.017, 0.012, 0.29, polished, 'seconds_hub', 0, -0.47);
const movement = part('movement', [0.8, -0.15, -1.45]);
ring(movement, 0.935, 0.74, 0.1, -0.13, steel, 'mainplate');
// Modelled gear wheels and bridges remain independent meshes within the movement.
for (const [i, x, y, r] of [
  [0, -0.37, 0.27, 0.31],
  [1, 0.3, 0.25, 0.25],
  [2, 0.12, -0.4, 0.28],
  [3, -0.44, -0.37, 0.2],
  [4, 0.48, -0.25, 0.19],
]) {
  disk(movement, r, 0.025, -0.177, gold, 'gear_' + i, x, y);
  disk(movement, r * 0.58, 0.028, -0.196, dark, 'gear_well_' + i, x, y);
  for (let t = 0; t < 24; t++) {
    const a = (t * Math.PI) / 12;
    const m = mesh(
      movement,
      new T.BoxGeometry(0.045, 0.045, 0.029),
      gold,
      'gear_tooth_' + i + '_' + t,
      x + Math.sin(a) * r,
      y + Math.cos(a) * r,
      -0.18,
    );
    m.rotation.z = -a;
  }
  for (let t = 0; t < 5; t++) {
    const a = (t * Math.PI * 2) / 5;
    const spoke = mesh(
      movement,
      new T.BoxGeometry(0.045, r * 1.6, 0.026),
      gold,
      'gear_spoke_' + i + '_' + t,
      x,
      y,
      -0.211,
    );
    spoke.rotation.z = a;
  }
  disk(movement, 0.039, 0.036, -0.236, jewel, 'jewel_' + i, x, y);
  disk(movement, 0.012, 0.039, -0.256, polished, 'pivot_' + i, x, y);
}
const bridge = mesh(
  movement,
  new RoundedBoxGeometry(1.4, 0.12, 0.05, 2, 0.035),
  steel,
  'movement_bridge',
  0,
  0.08,
  -0.267,
);
bridge.rotation.z = 0.25;
for (const [x, y] of [
  [-0.64, 0.54],
  [0.65, 0.51],
  [-0.58, -0.65],
  [0.48, -0.62],
]) {
  disk(movement, 0.055, 0.02, -0.19, polished, 'movement_screw', x, y);
  mesh(
    movement,
    new T.BoxGeometry(0.055, 0.008, 0.004),
    dark,
    'screw_slot',
    x,
    y,
    -0.203,
  );
}
const back = part('caseback', [1.6, -0.3, -2.6]);
ring(back, 1.01, 0.83, 0.06, -0.29, polished, 'exhibition_caseback');
disk(back, 0.83, 0.015, -0.295, glass, 'caseback_glass');
const backLabel = label(back, 'GC - 01', 0.065, -0.94, -0.32, polished);
backLabel.rotation.y = Math.PI;
const crown = part('crown', [1.9, 0, 0]);
const core = disk(crown, 0.198, 0.29, 0, polished, 'crown_body');
core.rotation.z = Math.PI / 2;
core.rotation.x = 0;
core.position.set(1.39, 0, 0.035);
for (let i = 0; i < 40; i++) {
  const a = (i * Math.PI) / 20;
  const k = mesh(
    crown,
    new T.BoxGeometry(0.27, 0.009, 0.019),
    steel,
    'crown_flute_' + i,
    1.39,
    Math.sin(a) * 0.195,
    0.035 + Math.cos(a) * 0.195,
  );
  k.rotation.x = -a;
}
const cap = disk(crown, 0.165, 0.015, 0, accent, 'crown_cap');
cap.rotation.x = 0;
cap.rotation.z = Math.PI / 2;
cap.position.set(1.545, 0, 0.035);
for (const side of [-1, 1])
  for (let i = 0; i < 10; i++) {
    const g = part(
      `bracelet_${side > 0 ? 'upper' : 'lower'}_${String(i).padStart(2, '0')}`,
      [side * (0.18 + i * 0.05), side * (0.45 + i * 0.115), -0.1 - i * 0.025],
    );
    const width = 1.4 - i * 0.022,
      y = side * (1.58 + i * 0.255),
      z = -(Math.max(0, i - 3) ** 2) * 0.013;
    g.position.set(0, y, z);
    g.rotation.x = side * Math.max(0, i - 3) * -0.045;
    for (const [n, x, w, mat] of [
      ['left', -width * 0.36, width * 0.27, steel],
      ['center', 0, width * 0.41, accent],
      ['right', width * 0.36, width * 0.27, steel],
    ])
      mesh(
        g,
        new RoundedBoxGeometry(w, 0.237, 0.16, 2, 0.04),
        mat,
        `link_${n}`,
        x,
        0,
        0,
      );
  }
// Batch sub-meshes by material inside each independently animated assembly.
for (const group of root.children) {
  const batches = new Map();
  for (const child of [...group.children]) {
    if (!child.isMesh) continue;
    child.updateMatrix();
    const geometry = (
      child.geometry.index
        ? child.geometry.toNonIndexed()
        : child.geometry.clone()
    ).applyMatrix4(child.matrix);
    const list = batches.get(child.material) ?? [];
    list.push(geometry);
    batches.set(child.material, list);
    group.remove(child);
  }
  for (const [material, geometries] of batches) {
    const merged = mergeVertices(mergeGeometries(geometries));
    mesh(group, merged, material, group.name + '_' + material.name);
    geometries.forEach((g) => g.dispose());
  }
}
root.updateMatrixWorld(true);
const binary = await new GLTFExporter().parseAsync(root, {
  binary: true,
  onlyVisible: true,
});
fs.writeFileSync('public/gc01/gc01.glb', Buffer.from(binary));
let triangles = 0,
  meshes = 0;
root.traverse((o) => {
  if (o.isMesh) {
    meshes++;
    triangles +=
      (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3;
  }
});
const manifest = {
  name: 'GC—01 / Atelier study',
  concept: true,
  units: 'Design proportions; not a manufacturing specification',
  parts: root.children.map((p) => ({
    name: p.name,
    explode: p.userData.explode,
  })),
  meshes,
  triangles,
  bytes: binary.byteLength,
};
fs.writeFileSync(
  'public/gc01/model-manifest.json',
  JSON.stringify(manifest, null, 2),
);
console.log(
  manifest.name,
  meshes + ' meshes',
  triangles + ' triangles',
  (binary.byteLength / 1024 / 1024).toFixed(2) + ' MiB',
);
