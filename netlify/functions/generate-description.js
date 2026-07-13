const ANTHROPIC_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-haiku-4-5-20251001';

const STYLE_EXAMPLES = [
  'Bienvenida al programa de empleabilidad Despega tu Pega. Valentina presenta la ruta del curso asincrónico y lo que aprenderás en cada módulo.',
  'La comunidad Vivens contada en imágenes: personas, espacios y el sentido de pertenencia que la define.',
  'Recorrido por el showroom de Awakelab: el escaparate físico de nuestras producciones y prototipos.',
].join('\n- ');

function isAuthed(req) {
  const expected = Netlify.env.get('ADMIN_PASSWORD');
  const got = req.headers.get('x-admin-password');
  return Boolean(expected) && got === expected;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
  if (!isAuthed(req)) return json({ error: 'No autorizado' }, 401);

  const apiKey = Netlify.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) return json({ error: 'Falta configurar ANTHROPIC_API_KEY en Netlify.' }, 500);

  const body = await req.json().catch(() => null);
  const title = String(body?.title || '').trim();
  if (!title) return json({ error: 'Falta el título' }, 400);
  const title2 = String(body?.title2 || '').trim();
  const tag = String(body?.tag || '').trim();
  const cat = String(body?.cat || '').trim();

  // Metadata-based only — the model never sees the actual video, just the
  // fields already typed in the form, so the result is a plausible draft to
  // review/edit, not a summary of the video's real content.
  const prompt = `Escribe una descripción breve (1-2 frases, máximo 220 caracteres) en español para un video del catálogo de Awakelab, un estudio de producción audiovisual. Tono cinematográfico, profesional, directo, sin emojis ni comillas.

Ejemplos del tono/estilo que ya usa el catálogo:
- ${STYLE_EXAMPLES}

Datos del video nuevo:
Título: ${title}
${title2 ? `Subtítulo: ${title2}\n` : ''}Etiqueta: ${tag || 'sin etiqueta'}
Categoría: ${cat || 'sin categoría'}

Responde solo con la descripción, sin texto adicional.`;

  const res = await fetch(ANTHROPIC_ENDPOINT, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 200,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    return json({ error: 'No se pudo generar la descripción.', detail }, 502);
  }

  const data = await res.json();
  const desc = (data.content || []).map((c) => c.text || '').join('').trim();
  if (!desc) return json({ error: 'La IA no devolvió texto.' }, 502);

  return json({ desc });
};

export const config = { path: '/api/generate-description' };
