import { getStore } from '@netlify/blobs';
import { seedWithDefaults } from '../../src/seedVideos.js';

const CATS = ['cursos', 'intros', 'brand', 'eventos'];
const KEY = 'all-videos';
const LEGACY_EXTRA_KEY = 'extra-videos';
const MAX_HERO = 5;

function isAuthed(req) {
  const expected = Netlify.env.get('ADMIN_PASSWORD');
  const got = req.headers.get('x-admin-password');
  return Boolean(expected) && got === expected;
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });
}

// Bootstraps the catalog on first run: seeds the hardcoded video list and, if
// videos were already added through the previous (pre-unification) admin panel
// under the old "extra-videos" key, folds them in too so nothing is lost.
async function loadAll(store) {
  const existing = await store.get(KEY, { type: 'json' });
  if (existing) return existing;

  const legacyExtra = (await store.get(LEGACY_EXTRA_KEY, { type: 'json' })) || [];
  const migratedExtra = legacyExtra.map((v) => ({ ...v, likes: 0, heroFeatured: false, heroOrder: null }));
  const items = [...seedWithDefaults(), ...migratedExtra];
  await store.setJSON(KEY, items);
  return items;
}

export default async (req) => {
  const store = getStore('catalog');

  if (req.method === 'GET') {
    const items = await loadAll(store);
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

    const items = await loadAll(store);
    const item = {
      id: 'v-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      title, title2, tag, cat, desc, src,
      likes: 0, heroFeatured: false, heroOrder: null,
      createdAt: new Date().toISOString(),
    };
    items.push(item);
    await store.setJSON(KEY, items);
    return json(item, 201);
  }

  if (req.method === 'PATCH') {
    if (!isAuthed(req)) return json({ error: 'No autorizado' }, 401);
    const body = await req.json().catch(() => null);
    const id = body?.id;
    if (!id) return json({ error: 'Falta el id' }, 400);

    const items = await loadAll(store);
    const idx = items.findIndex((v) => v.id === id);
    if (idx === -1) return json({ error: 'Video no encontrado' }, 404);

    const current = items[idx];
    const next = { ...current };

    if (body.title !== undefined) next.title = String(body.title).trim();
    if (body.title2 !== undefined) next.title2 = String(body.title2).trim();
    if (body.tag !== undefined) next.tag = String(body.tag).trim();
    if (body.desc !== undefined) next.desc = String(body.desc).trim();
    if (body.src !== undefined) next.src = String(body.src).trim();

    if (body.cat !== undefined) {
      const cat = String(body.cat).trim();
      if (!CATS.includes(cat)) return json({ error: 'Categoría no válida' }, 400);
      next.cat = cat;
    }

    if (body.heroFeatured !== undefined) {
      const heroFeatured = Boolean(body.heroFeatured);
      if (heroFeatured && !current.heroFeatured) {
        const count = items.filter((v) => v.heroFeatured && v.id !== id).length;
        if (count >= MAX_HERO) {
          return json({ error: `Ya hay ${MAX_HERO} videos en el hero. Quita uno antes de agregar otro.` }, 400);
        }
        const maxOrder = items.reduce((m, v) => Math.max(m, v.heroOrder || 0), 0);
        next.heroOrder = maxOrder + 1;
      }
      next.heroFeatured = heroFeatured;
      if (!heroFeatured) next.heroOrder = null;
    }

    if (body.heroOrder !== undefined && current.heroFeatured) {
      next.heroOrder = Number(body.heroOrder);
    }

    items[idx] = next;
    await store.setJSON(KEY, items);
    return json(next);
  }

  if (req.method === 'DELETE') {
    if (!isAuthed(req)) return json({ error: 'No autorizado' }, 401);
    const body = await req.json().catch(() => null);
    const id = body?.id;
    if (!id) return json({ error: 'Falta el id' }, 400);

    const items = await loadAll(store);
    const next = items.filter((v) => v.id !== id);
    await store.setJSON(KEY, next);
    return json({ ok: true });
  }

  return new Response('Method not allowed', { status: 405 });
};

export const config = { path: '/api/videos' };
