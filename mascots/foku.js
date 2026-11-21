
/*
  Foku — burung hantu biru: siluet telur bulat, dua tanduk telinga lancip,
  mata besar putih dengan pupil gelap, paruh oranye kecil, sirip samping.

  Dunia: lantai y = 0, +y ke atas, +z ke kamera. 1 unit � tinggi maskot kecil.
  Tinggi dunia kira-kira: badan atas 0.38 · kepala pusat 0.50 · kepala atas 0.77
  · puncak tanduk ~0.86.
*/
export const foku = {
  id: 'foku',
  name: 'Foku',
  tagline: 'Burung hantu biru yang ikut fokus belajar',
  accent: '#4392F0',
  frame: { target: 0.45, radius: 0.62 },
  bound: { y: 0.45, radius: 0.68 },
  motion: { hop: 0.14, squash: 1.15, snap: 1, talkSquash: 0.7 },

  materials: {
    // vinil lembut — biru lebih pekat agar tampil lebih cerah di layar
    skin: { color: '#3579cf', f0: 0.04, spec: 0.8, shininess: 60, rim: 0.8, sss: 0.2, sssColor: '#8fc2f5' },
    wing: { color: '#2f6fc0', shadeOf: 'skin', f0: 0.04, spec: 0.7, shininess: 50, rim: 0.7 },
    tuft: { color: '#2a63b5', shadeOf: 'skin', f0: 0.04, spec: 0.7, shininess: 50, rim: 0.8 },
    foot: { color: '#e08a2e', shadeOf: 'skin', f0: 0.04, spec: 0.6, shininess: 40, rim: 0.5 },
    beak: { color: '#e89a35', f0: 0.05, spec: 0.9, shininess: 70, rim: 0.4, gloss: 0.6 },
    mouth: { color: '#6b1a26', f0: 0.04, spec: 0.6, shininess: 40, rim: 0 },
    tongue: { color: '#ff7f91', f0: 0.05, spec: 1, shininess: 60, rim: 0.2, gloss: 0.6 },
  },

  bones: [
    { name: 'body', pivot: [0, 0, 0], drive: { ry: [['yaw', 0.3]], rz: [['roll', 0.4]] } },
    { name: 'head', parent: 'body', pivot: [0, 0.3, 0], drive: { rx: [['pitch', -0.6]], ry: [['yaw', 0.6]], rz: [['roll', 0.5]] } },
    // paruh buka dua arah seperti pip: rahang bawah turun, atas sedikit naik
    { name: 'beak', parent: 'head', pivot: [0, 0.1, 0.27], drive: { rx: [['talk', -0.24]] } },
    { name: 'jaw', parent: 'head', pivot: [0, 0.1, 0.27], drive: { rx: [['talk', 0.8]] } },
    // dua tanduk telinga lancip, kiri (x negatif) dulu
    { name: 'tuftL', parent: 'head', pivot: [-0.15, 0.4, 0], rest: { rz: 0.18 }, jiggle: { axis: [0, 1, 0], length: 0.14, freq: 2.6, damping: 0.13 } },
    { name: 'tuftR', parent: 'head', pivot: [0.15, 0.4, 0], rest: { rz: -0.18 }, jiggle: { axis: [0, 1, 0], length: 0.14, freq: 2.6, damping: 0.13, phase: 0.5 } },
    // sirip samping mengepak
    { name: 'wingL', parent: 'body', pivot: [-0.25, 0.26, 0], drive: { rz: [['flap', -1.2]] }, wave: { rz: [0.04, 0.8, 0] } },
    { name: 'wingR', parent: 'body', pivot: [0.25, 0.26, 0], drive: { rz: [['flap', 1.2]] }, wave: { rz: [-0.04, 0.8, 1.1] } },
  ],

  parts: [
    // badan: telur bulat (pusat dunia y 0.19, atas 0.38)
    { bone: 'body', shape: 'ellipsoid', at: [0, 0.19, 0], radii: [0.26, 0.19, 0.24], material: 'skin' },
    // kepala melebur ke badan (pusat dunia y 0.50, atas 0.77)
    { bone: 'head', shape: 'ellipsoid', at: [0, 0.2, 0], radii: [0.31, 0.27, 0.28], blend: 0.1, material: 'skin' },
    // kaki kecil oranye
    { bone: 'body', shape: 'ellipsoid', at: [-0.13, 0.035, 0.09], radii: [0.09, 0.045, 0.11], blend: 0.04, material: 'foot' },
    { bone: 'body', shape: 'ellipsoid', at: [0.13, 0.035, 0.09], radii: [0.09, 0.045, 0.11], blend: 0.04, material: 'foot' },
    // paruh: tenggorokan gelap, paruh atas (potong bawah), paruh bawah (potong atas)
    { bone: 'head', shape: 'ellipsoid', at: [0, 0.09, 0.29], radii: [0.04, 0.028, 0.03], material: 'mouth' },
    { bone: 'beak', shape: 'ellipsoid', at: [0, 0, 0.05], rot: [0.12, 0, 0], radii: [0.055, 0.04, 0.07], clip: { normal: [0, -1, 0] }, material: 'beak' },
    { bone: 'beak', shape: 'ellipsoid', at: [0, 0, 0.05], rot: [0.12, 0, 0], radii: [0.046, 0.034, 0.06], clip: { normal: [0, -1, 0], offset: 0.003 }, material: 'mouth' },
    { bone: 'jaw', shape: 'ellipsoid', at: [0, 0, 0.04], radii: [0.046, 0.03, 0.058], clip: { normal: [0, 1, 0] }, material: 'beak' },
    { bone: 'jaw', shape: 'ellipsoid', at: [0, 0, 0.04], radii: [0.038, 0.024, 0.048], clip: { normal: [0, 1, 0], offset: 0.003 }, material: 'mouth' },
    { bone: 'jaw', shape: 'ellipsoid', at: [0, 0.002, 0.035], radii: [0.024, 0.008, 0.03], material: 'tongue' },
    // tanduk telinga lancip (kiri di x negatif)
    { bone: 'tuftL', shape: 'roundCone', from: [0, -0.05, 0], to: [0.04, 0.13, 0], r1: 0.05, r2: 0.012, blend: 0.03, material: 'tuft' },
    { bone: 'tuftR', shape: 'roundCone', from: [0, -0.05, 0], to: [-0.04, 0.13, 0], r1: 0.05, r2: 0.012, blend: 0.03, material: 'tuft' },
    // sirip samping menempel di badan
    { bone: 'wingL', shape: 'ellipsoid', at: [-0.01, -0.1, 0], rot: [0, 0, -0.15], radii: [0.05, 0.14, 0.12], blend: 0.03, material: 'wing' },
    { bone: 'wingR', shape: 'ellipsoid', at: [0.01, -0.1, 0], rot: [0, 0, 0.15], radii: [0.05, 0.14, 0.12], blend: 0.03, material: 'wing' },
  ],

  paints: [
    // perut lebih terang di depan badan
    { bone: 'body', on: ['skin'], kind: 'ellipse', at: [0, 0.2, 0.06], radii: [0.16, 0.15], color: '#7db4f2', soft: 0.25 },
    // pipi lembut di bawah mata (mata di x ±0.13, y 0.19)
    { bone: 'head', on: ['skin'], kind: 'sphere', at: [-0.19, 0.08, 0.23], radius: 0.05, color: '#ff8f8f', soft: 0.6, opacity: 0.8 },
    { bone: 'head', on: ['skin'], kind: 'sphere', at: [0.19, 0.08, 0.23], radius: 0.05, color: '#ff8f8f', soft: 0.6, opacity: 0.8 },
  ],

  // mata besar: kiri (x negatif) dulu, pusat kira-kira 0.7*radius di dalam kepala
  eyes: {
    kind: 'ball', bone: 'head', at: [[-0.13, 0.19, 0.2], [0.13, 0.19, 0.2]],
    radius: 0.075, iris: '#1b2230', irisSize: 0.6, pupilSize: 0.85, lid: 'skin',
  },
  face: { kind: 'mouth', bone: 'head', on: ['skin'], at: [0, 0.04, 0.234], width: 0.04, color: '#5a2a1a', tongue: '#ff7d8a' },

  anchors: {
    top: { bone: 'head', at: [0.14, 0.5, 0.05] },
    mouth: { bone: 'head', at: [0, 0.1, 0.36] },
    ear: { bone: 'head', at: [-0.28, 0.2, 0] },
    feet: { bone: 'root', at: [0, 0.02, 0.15] },
  },

  acting: {
    idle: { wingL: { rz: [0, 0.06, 0.9, 0] }, wingR: { rz: [0, 0.06, 0.9, 1.1] } },
    // miringkan kepala, tanduk bergoyang
    thinking: { head: { rz: 0.14 }, tuftL: { rz: [0, 0.14, 1.2, 0] }, tuftR: { rz: [0, -0.14, 1.2, 0.6] } },
    // tanduk berdiri tegak, condong ke sumber suara
    listening: { tuftL: { rz: 0.35 }, tuftR: { rz: -0.35 }, head: { rz: -0.1 } },
    speaking: { head: { rx: [-0.1, 0.05, 1.1, 0] }, wingL: { rz: [-0.2, 0.12, 2.2, 0] }, wingR: { rz: [0.2, 0.12, 2.2, 1.2] } },
    // meringkuk: sirip melipat, tanduk turun, kepala menunduk
    sleeping: { wingL: { rz: 0.15 }, wingR: { rz: -0.15 }, tuftL: { rz: 0.8 }, tuftR: { rz: -0.8 }, head: { rx: 0.35 } },
    working: { head: { rx: [0.1, 0.06, 5.2, 0] }, wingL: { rz: -0.3 }, wingR: { rz: 0.3 } },
    // tanduk bergetar cepat
    error: { tuftL: { rz: [0, 0.3, 11, 0] }, tuftR: { rz: [0, -0.3, 11, 0.5] }, wingL: { rz: [-0.9, 0.1, 12, 0] }, wingR: { rz: [0.9, 0.1, 12, 1] } },
    surprised: { tuftL: { rz: 0.5 }, tuftR: { rz: -0.5 }, wingL: { rz: -1.5 }, wingR: { rz: 1.5 } },
    celebrating: { wingL: { rz: [-1.3, 0.5, 9, 0] }, wingR: { rz: [1.3, 0.5, 9, 0] }, tuftL: { rz: [0, 0.2, 6, 0] }, tuftR: { rz: [0, -0.2, 6, 0.6] } },
    sad: { tuftL: { rz: 1.1 }, tuftR: { rz: -1.1 }, wingL: { rz: 0.3 }, wingR: { rz: -0.3 }, head: { rx: 0.3 } },
    happy: { wingL: { rz: [-0.9, 0.75, 7, 0] }, wingR: { rz: [0.9, 0.75, 7, 0] }, tuftL: { rz: [0, 0.18, 5, 0] }, tuftR: { rz: [0, -0.18, 5, 0.6] } },
  },
};

export default foku;
