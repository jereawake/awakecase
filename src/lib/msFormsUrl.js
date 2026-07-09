const FORM_ID = 'bVBwr9J3yEqDj_CVwIFGgKTQXFPz47VEn3gw9C804GhUMUtTWk1LT1JPWThTOVdPS0laUlc3U1NTWi4u';
const BASE_URL = 'https://forms.office.com/Pages/ResponsePage.aspx';

const FIELD_PARAM = {
  nombre: 'reca9793ccda941d0bab081449858947d',
  email: 'r2650c9bddf8b4218aefb87339e7acc89',
  equipo: 'rb844f7ac86d849cabc9ac8742373bba1',
  tipo: 'rccd6c4174fc54f708e5f7c49ad4fab42',
  duracion: 'r73c8e8110ca14d8c963fb7cf2e6957bf',
  fecha: 'r972bc08b53674d3484df43c490828e53',
  objetivo: 'r483101691bb2419b8f005089db4ea154',
  referencias: 'rb7df409798ab4bcfa1d0b34f98a15ea4',
};

// Microsoft Forms matches choice options by their exact literal text. "Curso" and
// "Menos de 30s " (trailing space included) came from a live prefill link the user
// generated; the rest are best-effort matches to our modal's labels — if a test
// submission shows a field landing blank on the Forms page, fix its label here.
const TIPO_LABELS = {
  'Curso': 'Curso',
  'Intro / bumper': 'Intro / bumper',
  'Brand film': 'Brand film',
  'Anuncio': 'Anuncio',
  'Evento': 'Evento',
  'Otro': 'Otro',
};
const DURACION_LABELS = {
  'Menos de 30s': 'Menos de 30s ',
  '30–60s': '30–60s',
  '1–3 min': '1–3 min',
  'Más de 3 min': 'Más de 3 min',
};

export function buildFormsPrefillUrl({ nombre, email, equipo, tipo, duracion, fecha, objetivo, referencias }) {
  const params = new URLSearchParams({ id: FORM_ID });
  if (nombre) params.set(FIELD_PARAM.nombre, nombre);
  if (email) params.set(FIELD_PARAM.email, email);
  if (equipo) params.set(FIELD_PARAM.equipo, equipo);
  if (tipo && TIPO_LABELS[tipo]) params.set(FIELD_PARAM.tipo, JSON.stringify(TIPO_LABELS[tipo]));
  if (duracion && DURACION_LABELS[duracion]) params.set(FIELD_PARAM.duracion, JSON.stringify(DURACION_LABELS[duracion]));
  if (fecha) params.set(FIELD_PARAM.fecha, JSON.stringify(fecha));
  if (objetivo) params.set(FIELD_PARAM.objetivo, objetivo);
  if (referencias) params.set(FIELD_PARAM.referencias, referencias);
  return `${BASE_URL}?${params.toString()}`;
}
