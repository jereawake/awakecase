// One-time seed data for the video catalog, consumed only by
// netlify/functions/videos.js to bootstrap Netlify Blobs on first run.
// The frontend no longer reads this directly — everything comes from /api/videos.
const B = 'https://media.awakelab.world/';

export const SEED_VIDEOS = [
  { id: 'dtp', title: 'Despega tu Pega', title2: 'Programa asincrónico', tag: 'Curso', cat: 'cursos', desc: 'Bienvenida al programa de empleabilidad Despega tu Pega. Valentina presenta la ruta del curso asincrónico y lo que aprenderás en cada módulo.', src: B + 'PRIVADOS/DESPEGA%20TU%20PEGA/ASINCR%C3%93NICO/Presentacion_Valentina.mp4' },
  { id: 'rfk', title: 'Refactika', title2: 'Growth & Revenue Ops', tag: 'Curso', cat: 'cursos', desc: 'Presentación de la microcredencial Growth & Revenue Ops de Refactika, pensada para equipos comerciales que quieren escalar su operación.', src: B + 'PRIVADOS/MICROCREDENCIALES/02-002-1-RFK%20-%20GROWTH%20%26%20REVENUE%20OPS/02-002-1-RFK%20-%20PRESENTACI%C3%93N%20DEL%20CURSO.mp4' },
  { id: 'wom', title: 'WOM · IA aplicada', title2: 'Módulo 1 · Sincrónico', tag: 'Curso', cat: 'cursos', desc: 'Primer módulo del programa sincrónico de aplicación estratégica de IA y gestión de negocios, desarrollado junto a WOM.', src: B + 'PRIVADOS/SINCR%C3%93NICO%20-%20Aplicaci%C3%B3n%20Estrat%C3%A9gica%20de%20IA%20y%20Gesti%C3%B3n%20de%20Negocios/M1-SIN-WOM.mp4' },
  { id: 'int-awk', title: 'Intro Awakelab', title2: 'Logo animado 2026', tag: 'Intro', cat: 'intros', desc: 'El sello de apertura de Awakelab: logo animado para las producciones 2026.', src: B + 'innovacion_videos/Intro-Logo-Awk2026.mp4' },
  { id: 'int-ab', title: 'Intro Awakebrain', title2: 'Identidad en movimiento', tag: 'Intro', cat: 'intros', desc: 'Identidad en movimiento para Awakebrain, la vertical de conocimiento e IA.', src: B + 'innovacion_videos/AB%20Intro.mp4' },
  { id: 'int-dtp', title: 'Intro Despega tu Pega', title2: 'Bumper de marca', tag: 'Intro', cat: 'intros', desc: 'Bumper de marca del programa Despega tu Pega.', src: B + 'innovacion_videos/Logo%20Despega%20Tu%20Pega.mp4' },
  { id: 'comp', title: 'Awakelab Companion', title2: 'Directorio · Pieza 1', tag: 'Brand film', cat: 'brand', desc: 'Pieza de marca del directorio Awakelab Companion: la experiencia que acompaña a cada persona en su proceso.', src: B + 'innovacion_videos/Awk-Directorio-1v7.mp4' },
  { id: 'pass', title: 'Awakelab Passport', title2: 'Directorio · Pieza 2', tag: 'Brand film', cat: 'brand', desc: 'Relato visual de Awakelab Passport, el pasaporte de aprendizaje y logros dentro del ecosistema.', src: B + 'innovacion_videos/Awk-Directorio-2v3.mp4' },
  { id: 'viv-com', title: 'Comunidad Vivens', title2: 'Brand film', tag: 'Brand film', cat: 'brand', desc: 'La comunidad Vivens contada en imágenes: personas, espacios y el sentido de pertenencia que la define.', src: B + 'innovacion_videos/Vivens%20CommunityV3.mp4' },
  { id: 'viv-imm', title: 'Espacio inmersivo Vivens', title2: 'Brand film', tag: 'Brand film', cat: 'brand', desc: 'Recorrido por el espacio inmersivo de Vivens, donde la tecnología y la experiencia física se encuentran.', src: B + 'innovacion_videos/Vivens%20EInmersive%20V3%20(1).mp4' },
  { id: 'showroom', title: 'Awakelab Showroom', title2: 'Recorrido del espacio', tag: 'Evento', cat: 'eventos', desc: 'Recorrido por el showroom de Awakelab: el escaparate físico de nuestras producciones y prototipos.', src: B + 'PROTOTIPOS/WEB-AWK/Video_awk_showroom.mp4' },
];

// Preserves the original curated hero lineup as the initial heroFeatured/heroOrder
// values, so the homepage looks the same on first migration, before anyone stars
// videos from the new admin panel.
const INITIAL_HERO_IDS = ['viv-com', 'comp', 'viv-imm', 'showroom'];

export function seedWithDefaults() {
  return SEED_VIDEOS.map((v) => {
    const heroIdx = INITIAL_HERO_IDS.indexOf(v.id);
    return {
      ...v,
      likes: 0,
      heroFeatured: heroIdx !== -1,
      heroOrder: heroIdx !== -1 ? heroIdx + 1 : null,
      createdAt: new Date(0).toISOString(),
    };
  });
}
