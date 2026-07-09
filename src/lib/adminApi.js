export async function login(password) {
  const res = await fetch('/api/admin-login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  if (res.status === 500) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'El servidor no está configurado.');
  }
  return res.ok;
}

export async function listExtraVideos() {
  const res = await fetch('/api/videos');
  if (!res.ok) throw new Error('No se pudo cargar el catálogo.');
  return res.json();
}

export async function addVideo(password, payload) {
  const res = await fetch('/api/videos', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-admin-password': password },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'No se pudo agregar el video.');
  return data;
}

export async function deleteVideo(password, id) {
  const res = await fetch('/api/videos', {
    method: 'DELETE',
    headers: { 'content-type': 'application/json', 'x-admin-password': password },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'No se pudo borrar el video.');
  }
}
