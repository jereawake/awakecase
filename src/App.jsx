import { useEffect, useMemo, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import SearchResults from './components/SearchResults';
import Top10Row from './components/Top10Row';
import CategoryRow from './components/CategoryRow';
import CtaBanner from './components/CtaBanner';
import VideoModal from './components/VideoModal';
import RequestModal from './components/RequestModal';
import Footer from './components/Footer';
import { rowMeta } from './data';
import { listVideos, likeVideo } from './lib/videosApi';
import { getLikedIds, markLiked } from './lib/likedStore';

const ACCENT = '#19F7F1';
const ACCENT_DEEP = '#0B93AA';
const HERO_ROTATE_MS = 9000;

export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [heroIdx, setHeroIdx] = useState(0);
  const [modal, setModal] = useState(null);
  const [reqOpen, setReqOpen] = useState(false);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState(() => getLikedIds());

  useEffect(() => {
    listVideos().then(setVideos).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const heroList = useMemo(() => {
    const starred = videos.filter((v) => v.heroFeatured).sort((a, b) => (a.heroOrder || 0) - (b.heroOrder || 0));
    return starred.length ? starred : videos.slice(0, 5);
  }, [videos]);

  const rows = useMemo(
    () => rowMeta.map((row) => ({ ...row, items: videos.filter((v) => v.cat === row.key) })),
    [videos]
  );

  const top10 = useMemo(
    () => [...videos].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10).map((v, i) => ({ ...v, rank: i + 1 })),
    [videos]
  );

  useEffect(() => {
    const t = setInterval(() => {
      if (modal || reqOpen || heroList.length < 2) return;
      setHeroIdx((i) => (i + 1) % heroList.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(t);
  }, [modal, reqOpen, heroList.length]);

  const onLike = async (id) => {
    if (likedIds.has(id)) return;
    try {
      const { likes } = await likeVideo(id);
      setVideos((prev) => prev.map((v) => (v.id === id ? { ...v, likes } : v)));
      markLiked(id);
      setLikedIds((prev) => new Set(prev).add(id));
    } catch (_) {}
  };

  const openVideo = (item) => {
    setModal(item.id);
    setQuery('');
    window.scrollTo({ top: 0 });
  };
  const modalItem = modal ? videos.find((v) => v.id === modal) : null;
  const closeModal = () => setModal(null);
  const goHome = () => {
    setModal(null);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const navTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const q = query.trim().toLowerCase();
  const searchActive = q.length > 0;
  const results = searchActive
    ? videos.filter((v) => (v.title + ' ' + v.tag + ' ' + v.desc).toLowerCase().includes(q))
    : [];

  if (loading) return <div style={{ minHeight: '100vh' }} />;

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Nav
        accent={ACCENT}
        navScrolled={navScrolled}
        query={query}
        onSearch={setQuery}
        onGoHome={goHome}
        onNavTo={navTo}
      />

      {searchActive ? (
        <SearchResults query={query} results={results} accent={ACCENT} accentDeep={ACCENT_DEEP} onOpen={openVideo} likedIds={likedIds} onLike={onLike} />
      ) : (
        <div>
          {heroList.length > 0 && (
            <Hero
              items={heroList}
              heroIdx={Math.min(heroIdx, heroList.length - 1)}
              accent={ACCENT}
              onOpen={openVideo}
              onSetHero={setHeroIdx}
              likedIds={likedIds}
              onLike={onLike}
            />
          )}

          <div style={{ position: 'relative', marginTop: heroList.length > 0 ? -60 : 0, zIndex: 5, paddingBottom: 80 }}>
            {top10.length > 0 && (
              <Top10Row items={top10} accent={ACCENT} accentSoft={ACCENT} accentDeep={ACCENT_DEEP} onOpen={openVideo} likedIds={likedIds} onLike={onLike} />
            )}

            {rows.map((row) => (
              <div key={row.key}>
                <CategoryRow row={row} accent={ACCENT} accentDeep={ACCENT_DEEP} onOpen={openVideo} likedIds={likedIds} onLike={onLike} />
                {row.ctaAfter && <CtaBanner accent={ACCENT} onOpenReq={() => setReqOpen(true)} />}
              </div>
            ))}

            <Footer />
          </div>
        </div>
      )}

      {modalItem && (
        <VideoModal item={modalItem} allVideos={videos} accent={ACCENT} accentDeep={ACCENT_DEEP} onClose={closeModal} onOpen={openVideo} likedIds={likedIds} onLike={onLike} />
      )}

      {reqOpen && (
        <RequestModal accent={ACCENT} onClose={() => setReqOpen(false)} />
      )}
    </div>
  );
}
