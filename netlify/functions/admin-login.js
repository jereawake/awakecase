export default async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const expected = Netlify.env.get('ADMIN_PASSWORD');
  if (!expected) {
    return new Response(JSON.stringify({ ok: false, error: 'ADMIN_PASSWORD no está configurada en Netlify.' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const body = await req.json().catch(() => null);
  const password = body?.password;
  if (password !== expected) {
    return new Response(JSON.stringify({ ok: false }), { status: 401, headers: { 'content-type': 'application/json' } });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'content-type': 'application/json' } });
};

export const config = { path: '/api/admin-login' };
