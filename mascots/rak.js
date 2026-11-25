/*
  Rak Buku — prop 3D utk scene "ambil buku" & "baca" di tutor-ai.
  (JS polos dari rak.ts — tanpa anotasi TS, untuk di-import langsung oleh halaman HTML.)

  Bukan maskot berwajah: lemari dua rak statis + satu buku biru pada bone
  sendiri (srcBook) supaya bisa "terambil" — state `sad` memiringkan buku
  ke belakang papan, menutupinya dari kamera depan (tak ada API visibility).

  Dunia: lantai y = 0, +z ke kamera. Lemari tinggi ≈ 0.72, lebar ≈ 0.44.
*/

export const rak = {
  id: 'rak',
  name: 'Rak Buku',
  tagline: 'A two-shelf bookcase with colourful books — one blue book Bimo can grab',
  accent: '#7C6BF0',
  frame: { target: 0.36, radius: 0.5 },
  bound: { y: 0.36, radius: 0.55 },
  /* lemari harus diam di lantai: tanpa hop/float/squash */
  motion: { hop: 0, squash: 1, snap: 1, talkSquash: 1, float: 0 },

  materials: {
    /* cat putih-lavender, sedikit lebih matte dari shell Bimo */
    case: { color: '#f2f4fd', f0: 0.03, spec: 0.45, shininess: 45, rim: 0.55, gloss: 0.35 },
    purple: { color: '#7C6BF0', f0: 0.04, spec: 0.7, shininess: 60, rim: 0.6, gloss: 0.45 },
    orange: { color: '#F5A93F', f0: 0.04, spec: 0.7, shininess: 60, rim: 0.6, gloss: 0.45 },
    blue: { color: '#4392F0', f0: 0.04, spec: 0.7, shininess: 60, rim: 0.6, gloss: 0.45 },
    pink: { color: '#F9A9E8', f0: 0.04, spec: 0.7, shininess: 60, rim: 0.6, gloss: 0.45 },
    green: { color: '#C5EE93', f0: 0.04, spec: 0.7, shininess: 60, rim: 0.6, gloss: 0.45 },
    deep: { color: '#5D4BD6', f0: 0.04, spec: 0.7, shininess: 60, rim: 0.6, gloss: 0.45 },
  },

  bones: [
    { name: 'body', pivot: [0, 0, 0], drive: { ry: [['yaw', 0.05]], rz: [['roll', 0.04]] } },
    /* buku biru pada rak tengah — pivot di alasnya supaya miring ke belakang
       menyapu punggung lemari dan hilang dari pandangan depan */
    { name: 'srcBook', parent: 'body', pivot: [-0.15, 0.385, -0.01] },
  ],

  parts: [
    /* ===== kerangka lemari (world: lebar ±0.22, tinggi 0..0.72, dalam ±0.1) ===== */
    { bone: 'body', shape: 'roundBox', at: [-0.21, 0.36, 0], half: [0.02, 0.36, 0.1], round: 0.015, material: 'case' },
    { bone: 'body', shape: 'roundBox', at: [0.21, 0.36, 0], half: [0.02, 0.36, 0.1], round: 0.015, material: 'case' },
    { bone: 'body', shape: 'roundBox', at: [0, 0.36, -0.092], half: [0.21, 0.36, 0.014], round: 0.01, material: 'case' },
    { bone: 'body', shape: 'roundBox', at: [0, 0.04, 0], half: [0.2, 0.035, 0.095], round: 0.02, material: 'case' },
    { bone: 'body', shape: 'roundBox', at: [0, 0.36, 0], half: [0.2, 0.025, 0.095], round: 0.018, material: 'case' },
    { bone: 'body', shape: 'roundBox', at: [0, 0.68, 0], half: [0.2, 0.03, 0.095], round: 0.02, material: 'case' },
    /* kaki kecil supaya menyentuh lantai visual */
    ...[-1, 1].flatMap((s) => [
      { bone: 'body', shape: 'roundBox', at: [s * 0.17, 0.01, 0.06], half: [0.025, 0.015, 0.025], round: 0.01, material: 'case' },
      { bone: 'body', shape: 'roundBox', at: [s * 0.17, 0.01, -0.06], half: [0.025, 0.015, 0.025], round: 0.01, material: 'case' },
    ]),

    /* ===== rak atas (berdiri di y = 0.385, tinggi buku 0.22 → puncak 0.605) ===== */
    { bone: 'body', shape: 'roundBox', at: [-0.09, 0.495, -0.01], half: [0.02, 0.11, 0.07], round: 0.01, material: 'orange' },
    { bone: 'body', shape: 'roundBox', at: [-0.04, 0.49, -0.01], half: [0.018, 0.105, 0.068], round: 0.01, material: 'purple' },
    { bone: 'body', shape: 'roundBox', at: [0.01, 0.497, -0.01], half: [0.02, 0.112, 0.07], round: 0.01, material: 'pink' },
    { bone: 'body', shape: 'roundBox', at: [0.06, 0.488, -0.01], half: [0.017, 0.103, 0.066], round: 0.01, material: 'green' },
    { bone: 'body', shape: 'roundBox', at: [0.107, 0.493, -0.01], half: [0.019, 0.108, 0.069], round: 0.01, material: 'deep' },

    /* buku biru YANG DIAmbil — bone sendiri, alas di pivot */
    { bone: 'srcBook', shape: 'roundBox', at: [0, 0.11, 0], half: [0.02, 0.11, 0.07], round: 0.01, material: 'blue' },

    /* ===== rak bawah (berdiri di y = 0.075, tinggi 0.18 → puncak 0.255 < 0.335) ===== */
    { bone: 'body', shape: 'roundBox', at: [-0.13, 0.165, -0.01], half: [0.02, 0.09, 0.07], round: 0.01, material: 'purple' },
    { bone: 'body', shape: 'roundBox', at: [-0.08, 0.16, -0.01], half: [0.018, 0.085, 0.068], round: 0.01, material: 'green' },
    { bone: 'body', shape: 'roundBox', at: [-0.03, 0.168, -0.01], half: [0.02, 0.093, 0.07], round: 0.01, material: 'blue' },
    { bone: 'body', shape: 'roundBox', at: [0.02, 0.162, -0.01], half: [0.017, 0.087, 0.066], round: 0.01, material: 'orange' },
    { bone: 'body', shape: 'roundBox', at: [0.07, 0.166, -0.01], half: [0.019, 0.091, 0.069], round: 0.01, material: 'pink' },
    { bone: 'body', shape: 'roundBox', at: [0.12, 0.16, -0.01], half: [0.018, 0.085, 0.068], round: 0.01, material: 'deep' },
  ],

  anchors: {
    top: { bone: 'body', at: [0, 0.74, 0] },
    mouth: { bone: 'body', at: [0, 0.5, 0.11] },
    ear: { bone: 'body', at: [-0.24, 0.5, 0] },
    feet: { bone: 'root', at: [0, 0.02, 0.1] },
  },

  acting: {
    /* buku biru bergoyang pelan saat rak idle — terasa hidup, tak kaku */
    idle: { srcBook: { rx: [0, 0.03, 0.9, 0] } },
    /* "terambil": buku miring −100° ke belakang, menembus punggung lemari —
       dari kamera depan tertutup papan belakang (page set state ini saat flybook) */
    sad: { srcBook: { rx: -1.75 }, body: { rz: [0, 0.02, 0.6, 0] } },
    /* joget: rak ikut bergoyang halus — srcBook tetap miring (buku masih "diambil",
       jangan sampai balik berdiri di tengah dance) */
    celebrating: { body: { rz: [0, 0.07, 2.1, 0], ry: [0, 0.05, 1.4, 0] }, srcBook: { rx: -1.75 } },
  },
};

export default rak;
