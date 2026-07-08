const B = 'https://media.awakelab.world/';

const mk = (cat) => (o) => ({ cat, ...o });

const cursos = [
  { id: 'dtp', title: 'Despega tu Pega', title2: 'Programa asincrónico', tag: 'Curso', desc: 'Bienvenida al programa de empleabilidad Despega tu Pega. Valentina presenta la ruta del curso asincrónico y lo que aprenderás en cada módulo.', src: B + 'PRIVADOS/DESPEGA%20TU%20PEGA/ASINCR%C3%93NICO/Presentacion_Valentina.mp4' },
  { id: 'rfk', title: 'Refactika', title2: 'Growth & Revenue Ops', tag: 'Curso', desc: 'Presentación de la microcredencial Growth & Revenue Ops de Refactika, pensada para equipos comerciales que quieren escalar su operación.', src: B + 'PRIVADOS/MICROCREDENCIALES/02-002-1-RFK%20-%20GROWTH%20%26%20REVENUE%20OPS/02-002-1-RFK%20-%20PRESENTACI%C3%93N%20DEL%20CURSO.mp4' },
  { id: 'wom', title: 'WOM · IA aplicada', title2: 'Módulo 1 · Sincrónico', tag: 'Curso', desc: 'Primer módulo del programa sincrónico de aplicación estratégica de IA y gestión de negocios, desarrollado junto a WOM.', src: B + 'PRIVADOS/SINCR%C3%93NICO%20-%20Aplicaci%C3%B3n%20Estrat%C3%A9gica%20de%20IA%20y%20Gesti%C3%B3n%20de%20Negocios/M1-SIN-WOM.mp4' },
].map(mk('cursos'));

const intros = [
  { id: 'int-awk', title: 'Intro Awakelab', title2: 'Logo animado 2026', tag: 'Intro', desc: 'El sello de apertura de Awakelab: logo animado para las producciones 2026.', src: B + 'innovacion_videos/Intro-Logo-Awk2026.mp4' },
  { id: 'int-ab', title: 'Intro Awakebrain', title2: 'Identidad en movimiento', tag: 'Intro', desc: 'Identidad en movimiento para Awakebrain, la vertical de conocimiento e IA.', src: B + 'innovacion_videos/AB%20Intro.mp4' },
  { id: 'int-dtp', title: 'Intro Despega tu Pega', title2: 'Bumper de marca', tag: 'Intro', desc: 'Bumper de marca del programa Despega tu Pega.', src: B + 'innovacion_videos/Logo%20Despega%20Tu%20Pega.mp4' },
].map(mk('intros'));

const brand = [
  { id: 'comp', title: 'Awakelab Companion', title2: 'Directorio · Pieza 1', tag: 'Brand film', desc: 'Pieza de marca del directorio Awakelab Companion: la experiencia que acompaña a cada persona en su proceso.', src: B + 'innovacion_videos/Awk-Directorio-1v7.mp4' },
  { id: 'pass', title: 'Awakelab Passport', title2: 'Directorio · Pieza 2', tag: 'Brand film', desc: 'Relato visual de Awakelab Passport, el pasaporte de aprendizaje y logros dentro del ecosistema.', src: B + 'innovacion_videos/Awk-Directorio-2v3.mp4' },
  { id: 'viv-com', title: 'Comunidad Vivens', title2: 'Brand film', tag: 'Brand film', desc: 'La comunidad Vivens contada en imágenes: personas, espacios y el sentido de pertenencia que la define.', src: B + 'innovacion_videos/Vivens%20CommunityV3.mp4' },
  { id: 'viv-imm', title: 'Espacio inmersivo Vivens', title2: 'Brand film', tag: 'Brand film', desc: 'Recorrido por el espacio inmersivo de Vivens, donde la tecnología y la experiencia física se encuentran.', src: B + 'innovacion_videos/Vivens%20EInmersive%20V3%20(1).mp4' },
].map(mk('brand'));

const eventos = [
  { id: 'showroom', title: 'Awakelab Showroom', title2: 'Recorrido del espacio', tag: 'Evento', desc: 'Recorrido por el showroom de Awakelab: el escaparate físico de nuestras producciones y prototipos.', src: B + 'PROTOTIPOS/WEB-AWK/Video_awk_showroom.mp4' },
].map(mk('eventos'));

export const all = [...cursos, ...intros, ...brand, ...eventos];

const byId = (id) => all.find((v) => v.id === id);

export const categories = { cursos, intros, brand, eventos };

export const heroItems = ['viv-com', 'comp', 'viv-imm', 'showroom'].map(byId);

const topOrder = ['viv-com', 'comp', 'viv-imm', 'showroom', 'int-awk', 'pass', 'wom', 'rfk', 'int-ab', 'dtp'];
export const top10 = topOrder.map((id, i) => ({ ...byId(id), rank: i + 1 }));

export const rows = [
  { key: 'cursos', label: 'Cursos', note: 'presentaciones de programas', items: cursos },
  { key: 'brand', label: 'Brand films', note: 'identidad y relato de marca', items: brand, ctaAfter: true },
  { key: 'intros', label: 'Intros y bumpers', note: 'sellos de apertura', items: intros },
  { key: 'eventos', label: 'Eventos y espacios', note: 'experiencias presenciales', items: eventos },
];

export const navItems = [
  { label: 'Inicio', target: null },
  { label: 'Cursos', target: 'sec-cursos' },
  { label: 'Brand films', target: 'sec-brand' },
  { label: 'Intros', target: 'sec-intros' },
  { label: 'Eventos', target: 'sec-eventos' },
];
