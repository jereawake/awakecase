import { getStore } from '@netlify/blobs';

const CATS = ['cursos', 'intros', 'brand', 'eventos'];
const KEY = 'extra-videos';

function isAuthed(req) {
  const expected = Netlify.env.get('ADMIN_PASSWORD');
  const got = req.headers.get('x-admin-password');
  return Boolean(expected) && got === expected;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

export default async (req) => {
  const store = getStore('catalog');

  if (req.method === 'GET') {
    const items = (await store.get(KEY, { type: 'json' })) || [];
    return json(items);
  }

  if (req.method === 'POST') {
    if (!isAuthed(req)) return json({ error: 'No autorizado' }, 401);
    const body = await req.json().catch(() => null);
    if (!body) return json({ error: 'Solicitud inválida' }, 400);

    const title = String(body.title || '').trim();
    const title2 = String(body.title2 || '').trim();
    const tag = String(body.tag || '').trim();
    const cat = String(body.cat || '').trim();
    const desc = String(body.desc || '').trim();
    const src = String(body.src || '').trim();

    if (!title || !tag || !cat || !src || !CATS.includes(cat)) {
      return json({ error: 'Faltan campos obligatorios o la categoría no es válida.' }, 400);
    }
    if (!/^https?:\/\//i.test(src)) {
      return json({ error: 'La URL del video debe empezar con http:// o https://' }, 400);
    }

    const items = (await store.get(KEY, { type: 'json' })) || [];
    const item = {
      id: 'extra-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title,
      title2,
      tag,
      cat,
      desc,
      src,
      createdAt: new Date().toISOString(),
    };
    items.push(item);
    await store.setJSON(KEY, items);
    return json(item, 201);
  }

  if (req.method === 'DELETE') {
    if (!isAuthed(req)) return json({ error: 'No autorizado' }, 401);
    const body = await req.json().catch(() => null);
    const id = body?.id;
    if (!id) return json({ error: 'Falta el id' }, 400);

    const items = (await store.get(KEY, { type: 'json' })) || [];
    const next = items.filter((v) => v.id !== id);
    await store.setJSON(KEY, next);
    return json({ ok: true });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/videos' };
