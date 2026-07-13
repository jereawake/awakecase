// Layout only — all video content now comes from /api/videos (Netlify Blobs).
export const rowMeta = [
  { key: 'cursos', label: 'Cursos', note: 'presentaciones de programas' },
  { key: 'brand', label: 'Brand films', note: 'identidad y relato de marca', ctaAfter: true },
  { key: 'intros', label: 'Intros y bumpers', note: 'sellos de apertura' },
  { key: 'eventos', label: 'Eventos y espacios', note: 'experiencias presenciales' },
];

export const navItems = [
  { label: 'Inicio', target: null },
  { label: 'Cursos', target: 'sec-cursos' },
  { label: 'Brand films', target: 'sec-brand' },
  { label: 'Intros', target: 'sec-intros' },
  { label: 'Eventos', target: 'sec-eventos' },
];

export const CATS = rowMeta.map((r) => r.key);
