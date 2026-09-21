import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import type { Finish } from './config';
// One deterministic timeline is shared by the interactive film and still-render pipeline.
const poses = [
  {
    p: 0,
    rotation: [-0.18, -0.4, -0.3],
    camera: [0, 0, 14.2],
    target: [0, 0, 0],
    explode: 0,
  },
  {
    p: 0.1,
    rotation: [-0.12, 0.12, -0.2],
    camera: [0, 0, 14.2],
    target: [0, 0, 0],
    explode: 0,
  },
  {
    p: 0.25,
    rotation: [-0.27, -0.64, -0.28],
    camera: [0.3, 0.1, 17],
    target: [0, 0, 0],
    explode: 1,
  },
  {
    p: 0.33,
    rotation: [-0.27, -0.64, -0.28],
    camera: [0.3, 0.1, 17],
    target: [0, 0, 0],
    explode: 1,
  },
  {
    p: 0.42,
    rotation: [-0.05, -1.32, -0.08],
    camera: [0, 0.1, 6.9],
    target: [0.15, 0, 0],
    explode: 0,
  },
  {
    p: 0.51,
    rotation: [-0.05, -1.15, 0.1],
    camera: [1.1, 0, 5],
    target: [0.5, 0, 0],
    explode: 0,
  },
  {
    p: 0.62,
    rotation: [0.1, -0.14, -0.14],
    camera: [0, 0.15, 4.65],
    target: [0, 0, 0],
    explode: 0,
  },
  {
    p: 0.74,
    rotation: [0.2, -3.05, -0.22],
    camera: [0, 0, 5.9],
    target: [0, 0, 0],
    explode: 0,
  },
  {
    p: 0.82,
    rotation: [-0.22, -5.5, -0.3],
    camera: [0, 0, 17],
    target: [0, 0, 0],
    explode: 0.8,
  },
  {
    p: 0.95,
    rotation: [-0.18, -6.68, -0.3],
    camera: [0, 0, 14.2],
    target: [0, 0, 0],
    explode: 0,
  },
  {
    p: 1,
    rotation: [-0.18, -6.68, -0.3],
    camera: [0, 0, 14.2],
    target: [0, 0, 0],
    explode: 0,
  },
];
export function samplePose(progress: number) {
  const p = Math.max(0, Math.min(1, Number.isFinite(progress) ? progress : 0));
  const index = Math.max(
    0,
    poses.findLastIndex((k) => k.p <= p),
  );
  const a = poses[index],
    b = poses[Math.min(index + 1, poses.length - 1)];
  const t = a === b ? 0 : (p - a.p) / (b.p - a.p);
  const blend = t * t * (3 - 2 * t); // Spatial choreography, not time-based scroll lag.
  const lerp = (x: number, y: number) => x + (y - x) * blend;
  return {
    rotation: a.rotation.map((n, i) => lerp(n, b.rotation[i])),
    camera: a.camera.map((n, i) => lerp(n, b.camera[i])),
    target: a.target.map((n, i) => lerp(n, b.target[i])),
    explode: lerp(a.explode, b.explode),
  };
}
export async function createWatchStudio(
  canvas: HTMLCanvasElement,
  options: {
    signal?: AbortSignal;
    transparent?: boolean;
    pixelRatio?: number;
  } = {},
) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
  });
  renderer.setPixelRatio(
    Math.min(options.pixelRatio ?? window.devicePixelRatio, 1.5),
  );
  renderer.setClearColor(0xf4f2ee, options.transparent ? 0 : 1);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  const scene = new THREE.Scene();
  const environmentScene = new THREE.Scene();
  environmentScene.background = new THREE.Color('#141617');
  const softbox = (
    w: number,
    h: number,
    x: number,
    y: number,
    z: number,
    intensity: number,
  ) => {
    const light = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        color: new THREE.Color().setRGB(intensity, intensity, intensity),
        side: THREE.DoubleSide,
      }),
    );
    light.position.set(x, y, z);
    light.lookAt(0, 0, 0);
    environmentScene.add(light);
  };
  softbox(3, 9, -4, 2, 5, 4);
  softbox(1.5, 7, 4, 1, 3, 3);
  softbox(7, 2, 0, 5, 1, 3);
  softbox(3, 5, -1, -3, -5, 2);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(environmentScene, 0.025);
  scene.environment = env.texture;
  scene.environmentIntensity = 0.8;
  environmentScene.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.geometry.dispose();
      (o.material as THREE.Material).dispose();
    }
  });
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
  camera.position.set(0, 0, 14.2);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x4a4540, 0.65));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(-4, 6, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xf0e8dc, 1.2);
  rim.position.set(4, 1, -4);
  scene.add(rim);
  const fill = new THREE.DirectionalLight(0xffffff, 0.8);
  fill.position.set(3, -4, 6);
  scene.add(fill);
  let model: THREE.Group | undefined;
  const geometries = new Set<THREE.BufferGeometry>(),
    materials = new Set<THREE.Material>();
  const dispose = () => {
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    env.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  };
  try {
    const response = await fetch('/gc01/gc01.glb', { signal: options.signal });
    if (!response.ok) throw new Error('Watch model unavailable');
    const gltf = await new GLTFLoader().parseAsync(
      await response.arrayBuffer(),
      '',
    );
    model = gltf.scene;
    model.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        geometries.add(o.geometry);
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
          materials.add(m),
        );
      }
    });
    if (options.signal?.aborted)
      throw new DOMException('Aborted', 'AbortError');
    scene.add(model);
  } catch (error) {
    dispose();
    throw error;
  }
  const assembly = model.getObjectByName('GC01_ATELIER_STUDY') ?? model;
  const parts = assembly.children.map((object) => ({
    object,
    base: object.position.clone(),
    explode: new THREE.Vector3(
      ...((object.userData.explode ?? [0, 0, 0]) as [number, number, number]),
    ),
  }));
  let progress = 0,
    compact = false;
  function setFinish(finish: Finish) {
    const metal =
      finish === 'noir' ? '#393c40' : finish === 'gold' ? '#c3a06b' : '#b7bbbe';
    const bright =
      finish === 'noir' ? '#5b6065' : finish === 'gold' ? '#dec28d' : '#e0e2e3';
    for (const raw of materials) {
      const mat = raw as THREE.MeshStandardMaterial;
      if (mat.name === 'steel') mat.color.set(metal);
      if (mat.name === 'polished')
        mat.color.set(finish === 'two-tone' ? '#cfb07a' : bright);
      if (mat.name === 'accent')
        mat.color.set(finish === 'two-tone' ? '#c7a36a' : metal);
      if (mat.name === 'dial')
        mat.color.set(
          finish === 'gold'
            ? '#37322c'
            : finish === 'noir'
              ? '#131619'
              : '#24282a',
        );
    }
  }
  function resize(width: number, height: number) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    compact = width / height < 1;
  }
  function render(time = 0, idle = true) {
    if (!model) return;
    const pose = samplePose(progress);
    const breathing = idle ? Math.sin(time * 0.00042) * 0.018 : 0;
    model.rotation.set(
      pose.rotation[0] + breathing,
      pose.rotation[1] + breathing * 0.6,
      pose.rotation[2],
    );
    model.position.set(compact ? 0 : 0.65, 0, 0);
    for (const p of parts)
      p.object.position.copy(p.base).addScaledVector(p.explode, pose.explode);
    camera.position.set(
      pose.camera[0],
      pose.camera[1],
      pose.camera[2] * (compact ? 1.05 : 1),
    );
    camera.lookAt(
      pose.target[0] + (compact ? 0 : 0.2),
      pose.target[1],
      pose.target[2],
    );
    renderer.render(scene, camera);
  }
  setFinish('steel');
  return {
    resize,
    render,
    setFinish,
    setProgress: (p: number) => {
      progress = p;
    },
    dispose,
    renderer,
    scene,
    camera,
    model,
  };
}
