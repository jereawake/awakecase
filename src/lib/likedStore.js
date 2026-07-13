const KEY = 'awk_liked_videos';

export function getLikedIds() {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
  } catch (_) {
    return new Set();
  }
}

export function markLiked(id) {
  const ids = getLikedIds();
  ids.add(id);
  localStorage.setItem(KEY, JSON.stringify([...ids]));
}
