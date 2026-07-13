import { getStore } from '@netlify/blobs';

const KEY = 'all-videos';

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

// Public endpoint — no admin auth. Abuse protection is intentionally light
// (the frontend just remembers liked ids in localStorage); this is a vanity
// metric for ranking Top 10, not a security-sensitive counter.
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const body = await req.json().catch(() => null);
  const id = body?.id;
  if (!id) return json({ error: 'Falta el id' }, 400);

  const store = getStore('catalog');
  const items = (await store.get(KEY, { type: 'json' })) || [];
  const idx = items.findIndex((v) => v.id === id);
  if (idx === -1) return json({ error: 'Video no encontrado' }, 404);

  items[idx] = { ...items[idx], likes: (items[idx].likes || 0) + 1 };
  await store.setJSON(KEY, items);
  return json({ id, likes: items[idx].likes });
};

export const config = { path: '/api/videos/like' };
