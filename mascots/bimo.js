/*
  Bimo — robot belajar putih: visor LED gelap, headphone ungu, buku biru terbuka.
  (JS polos dari bimo.ts — tanpa anotasi TS, untuk di-import langsung oleh halaman HTML.)

  Dunia: lantai y = 0, +y ke atas, +z ke kamera. 1 unit ≈ tinggi maskot kecil.
  Tinggi dunia kira-kira: badan pusat 0.20 · kepala pusat 0.54 · kepala atas 0.79
  · puncak antena ~0.90.
*/

/* An arm reaching forward-down to the open book; side -1 is screen left. */
function arm(side) {
  const s = side < 0 ? 'L' : 'R';
  return [
    { name: `shoulder${s}`, parent: 'body', pivot: [0.17 * side, 0.28, 0.04], drive: { rz: [['flap', 0.55 * side]] } },
  ];
}

function armParts(side) {
  const s = side < 0 ? 'L' : 'R';
  return [
    { bone: `shoulder${s}`, shape: 'sphere', radius: 0.055, material: 'shell' },
    { bone: `shoulder${s}`, shape: 'capsule', from: [0, -0.01, 0], to: [0.03 * side, -0.09, 0.1], radius: 0.045, blend: 0.04, material: 'shell' },
    { bone: `shoulder${s}`, shape: 'sphere', at: [0.04 * side, -0.11, 0.14], radius: 0.05, material: 'shell' },
  ];
}

export const bimo = {
  id: 'bimo',
  name: 'Bimo',
  tagline: 'A round white study bot with an LED smile, purple headphones and a blue book',
  accent: '#6355e0',
  frame: { target: 0.44, radius: 0.6 },
  bound: { y: 0.44, radius: 0.64 },
  motion: { hop: 0.1, squash: 1.08, snap: 1.15, talkSquash: 0.6, float: 0.07 },
  glowPool: 0.3,

  materials: {
    /* soft moulded shell — a touch bluer than white so highlights read */
    shell: { color: '#e4eaf6', f0: 0.05, spec: 1.1, shininess: 110, rim: 0.6, gloss: 0.65, sss: 0.08, sssColor: '#ffffff' },
    /* glossy headphone plastic */
    purple: { color: '#6355e0', f0: 0.05, spec: 1.4, shininess: 140, rim: 0.5, gloss: 0.75 },
    /* the visor glass the LED face is drawn on */
    screen: { color: '#12162b', f0: 0.05, spec: 1.7, shininess: 240, rim: 0.15, gloss: 0.95 },
    book: { color: '#3d66db', f0: 0.04, spec: 0.5, shininess: 40, rim: 0.5, gloss: 0.3 },
    page: { color: '#dbe4ff', f0: 0.03, spec: 0.3, shininess: 30, rim: 0.6, gloss: 0.2 },
  },

  bones: [
    { name: 'body', pivot: [0, 0, 0], drive: { ry: [['yaw', 0.22]], rz: [['roll', 0.3]] } },
    { name: 'head', parent: 'body', pivot: [0, 0.34, 0], drive: { rx: [['pitch', -0.75]], ry: [['yaw', 0.7]], rz: [['roll', 0.6]] } },
    /* the little nub on top springs when it moves */
    { name: 'antenna', parent: 'head', pivot: [0, 0.47, 0], jiggle: { axis: [0, 1, 0], length: 0.1, freq: 2.6, damping: 0.14 } },
    { name: 'book', parent: 'body', pivot: [0, 0.17, 0.2] },
    ...arm(-1),
    ...arm(1),
  ],

  parts: [
    /* body: a small rounded torso under the big head (world top ≈ 0.37) */
    { bone: 'body', shape: 'ellipsoid', at: [0, 0.2, 0], radii: [0.19, 0.17, 0.17], material: 'shell' },
    /* purple feet */
    ...[-1, 1].map((s) => ({
      bone: 'body', shape: 'ellipsoid', at: [s * 0.11, 0.05, 0.05], radii: [0.09, 0.05, 0.11], blend: 0.04, material: 'purple',
    })),

    /* head: wide and round, melted onto the torso (world centre y ≈ 0.54, top ≈ 0.79) */
    { bone: 'head', shape: 'ellipsoid', at: [0, 0.2, 0], radii: [0.27, 0.25, 0.25], blend: 0.1, material: 'shell' },
    /* recess for the visor, then the dark glass */
    { bone: 'head', shape: 'roundBox', op: 'sub', blend: 0.03, at: [0, 0.18, 0.28], half: [0.19, 0.14, 0.08], round: 0.07, material: 'shell' },
    { bone: 'head', shape: 'plate', at: [0, 0.18, 0.235], half: [0.175, 0.125], corner: 0.055, depth: 0.01, material: 'screen' },

    /* headphone cups on both sides, plus a band arcing over the top */
    ...[-1, 1].flatMap((s) => [
      { bone: 'head', shape: 'cylinder', at: [s * 0.26, 0.16, 0], rot: [0, 0, 1.5708], radius: 0.1, half: 0.035, round: 0.02, material: 'purple' },
      { bone: 'head', shape: 'sphere', at: [s * 0.285, 0.16, 0], radius: 0.04, material: 'purple' },
    ]),
    /* a smooth band arcs from cup to cup over the crown, clear of the antenna at centre */
    ...([
      [[-0.26, 0.27], [-0.18, 0.38]],
      [[-0.18, 0.38], [-0.075, 0.435]],
      [[0.075, 0.435], [0.18, 0.38]],
      [[0.18, 0.38], [0.26, 0.27]],
    ]).map(([from, to]) => ({
      bone: 'head', shape: 'capsule', from: [from[0], from[1], 0], to: [to[0], to[1], 0], radius: 0.04, blend: 0.03, material: 'purple',
    })),

    /* antenna nub rising through the band */
    { bone: 'head', shape: 'cylinder', at: [0, 0.47, 0], radius: 0.03, half: 0.018, round: 0.01, material: 'shell' },
    { bone: 'antenna', shape: 'capsule', from: [0, 0.01, 0], to: [0, 0.06, 0], radius: 0.016, material: 'shell' },
    { bone: 'antenna', shape: 'sphere', at: [0, 0.095, 0], radius: 0.045, material: 'shell' },

    ...armParts(-1),
    ...armParts(1),

    /* the open book held in front: the fold (spine) bulges OUT toward the camera, the panels
       splay back toward Bimo's chin — pages line the inside so white never shows from outside */
    { bone: 'book', shape: 'roundBox', at: [-0.085, 0.05, 0], rot: [0.55, -0.45, -0.12], half: [0.1, 0.09, 0.014], round: 0.014, material: 'book' },
    { bone: 'book', shape: 'roundBox', at: [0.085, 0.05, 0], rot: [0.55, 0.45, 0.12], half: [0.1, 0.09, 0.014], round: 0.014, material: 'book' },
    { bone: 'book', shape: 'roundBox', at: [-0.075, 0.06, -0.026], rot: [0.55, -0.45, -0.12], half: [0.08, 0.068, 0.01], round: 0.01, material: 'page' },
    { bone: 'book', shape: 'roundBox', at: [0.075, 0.06, -0.026], rot: [0.55, 0.45, 0.12], half: [0.08, 0.068, 0.01], round: 0.01, material: 'page' },
  ],

  paints: [
    /* a small chest indicator */
    { bone: 'body', on: ['shell'], kind: 'sphere', at: [0, 0.24, 0.165], radius: 0.035, color: '#a8b4f0', soft: 0.5, opacity: 0.75 },
  ],

  /* the LED face draws eyes and mouth itself — no separate eyes */
  face: {
    kind: 'screen',
    bone: 'head',
    material: 'screen',
    center: [0, 0.18],
    half: [0.17, 0.12],
    corner: 0.055,
    cell: 0.03,
    color: '#6ec8ff',
  },

  anchors: {
    top: { bone: 'head', at: [0.1, 0.5, 0.05] },
    mouth: { bone: 'head', at: [0, 0.1, 0.28] },
    ear: { bone: 'head', at: [-0.31, 0.16, 0] },
    feet: { bone: 'root', at: [0, 0.02, 0.12] },
  },

  acting: {
    idle: { book: { rx: [0, 0.04, 0.8, 0] } },
    /* thinking: right hand up at the chin, head tilted, antenna ticking over ideas —
       a classic ponder, not a reach (there is no shelf in this rig) */
    thinking: {
      body: { ry: [-0.06, 0.04, 0.5, 0], rz: [0.05, 0.03, 0.5, 0] },
      head: { rz: 0.16, ry: [0.1, 0.05, 0.5, 0], rx: [-0.06, 0.04, 0.5, 0] },
      antenna: { rz: [0, 0.32, 1.7, 0] },
      shoulderR: { rz: [1, 0.06, 1.1, 0], rx: [-0.65, 0.06, 1.1, 0] },
      shoulderL: { rz: [0.1, 0.05, 1.1, Math.PI] },
      book: { rx: [0, 0.035, 0.9, 0] },
    },
    listening: { head: { rz: -0.1, ry: -0.18 }, antenna: { rx: [-0.2, 0.1, 1, 0] } },
    speaking: { head: { rx: [-0.04, 0.05, 2.2, 0] }, book: { rx: [0, 0.06, 1.6, 0] } },
    /* reading with the chin toward the pages, nodding off at a slow 2.5s rhythm */
    working: {
      head: { rx: [0.3, 0.09, 0.4, 0] },
      book: { rx: [-0.1, 0.04, 0.4, 0] },
      shoulderL: { rx: [-0.12, 0.03, 0.4, 0] }, shoulderR: { rx: [-0.12, 0.03, 0.4, 0] },
    },
    /* dozed off: deeper chin tuck, book sinking in the lap, slow breath sway */
    sleeping: { head: { rx: [0.3, 0.05, 0.25, 0], rz: 0.12 }, book: { rx: -0.3 }, shoulderL: { rx: 0.14 }, shoulderR: { rx: 0.14 } },
    error: { shoulderL: { rz: [-0.28, 0.15, 11, 0] }, shoulderR: { rz: [0.28, 0.15, 11, 1] }, head: { rz: -0.08 } },
    surprised: { shoulderL: { rz: -0.55 }, shoulderR: { rz: 0.55 }, head: { rx: -0.15 }, antenna: { rx: [-0.25, 0.2, 8, 0] } },
    /* dancing: wide hip sway + torso twist, arms pumping high out of phase, book and head bopping along */
    celebrating: {
      body: { rz: [0, 0.26, 1.7, 1.57], ry: [0, 0.3, 1.15, 1.57] },
      head: { rz: [0, 0.12, 1.7, 0] },
      shoulderL: { rz: [-1, 0.35, 4, 0] }, shoulderR: { rz: [1, 0.35, 4, Math.PI] },
      book: { rz: [0, 0.3, 3.2, 0], rx: [0, 0.12, 3.2, 0] },
      antenna: { rz: [0, 0.4, 6, 0] },
    },
    sad: { head: { rx: 0.2, rz: 0.1 }, shoulderL: { rx: 0.15 }, shoulderR: { rx: 0.15 }, book: { rx: -0.25 } },
    happy: {
      shoulderL: { rz: [-0.7, 0.18, 2.4, 0] }, shoulderR: { rz: [0.7, 0.18, 2.4, Math.PI] },
      antenna: { rz: [0, 0.2, 4, 0] },
    },
  },

  fx: {
    /* purple and gold sparks, like the sparkles on the app hero */
    celebrating: [{ glyph: 'spark', anchor: 'top', rate: 7, velocity: [0.2, 0.55, 0], jitter: 1.2, gravity: 1.6, life: [0.35, 0.65], size: [0.045, 0.02], color: '#ffd166', glow: true, align: true }],
    'enter:happy': [{ glyph: 'spark', anchor: 'top', rate: 8, velocity: [0, 0.5, 0], jitter: 1.4, gravity: 1.8, life: [0.3, 0.55], size: [0.04, 0.02], color: '#b48cff', glow: true, align: true }],
    land: [{ glyph: 'spark', anchor: 'feet', rate: 5, spread: 0.1, velocity: [0, 0.5, 0], jitter: 1, gravity: 3, life: [0.22, 0.4], size: [0.03, 0.018], color: '#a8b4f0', glow: true, align: true }],
  },
};

export default bimo;
