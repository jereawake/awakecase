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
import { all, categories, rowMeta, heroItems } from './data';
import { listExtraVideos } from './lib/adminApi';

const ACCENT = '#19F7F1';
const ACCENT_DEEP = '#0B93AA';
const SHOW_TOP10 = true;
const HERO_ROTATE_MS = 9000;

export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const [heroIdx, setHeroIdx] = useState(0);
  const [heroMuted, setHeroMuted] = useState(true);
  const [modal, setModal] = useState(null);
  const [reqOpen, setReqOpen] = useState(false);
  const [extra, setExtra] = useState([]);

  useEffect(() => {
    listExtraVideos().then(setExtra).catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      if (modal || reqOpen) return;
      setHeroIdx((i) => (i + 1) % heroItems.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(t);
  }, [modal, reqOpen]);

  const allVideos = useMemo(() => [...all, ...extra], [extra]);
  const rows = useMemo(
    () => rowMeta.map((row) => ({
      ...row,
      items: [...categories[row.key], ...extra.filter((v) => v.cat === row.key)],
    })),
    [extra]
  );

  const openVideo = (item) => {
    setModal(item);
    setQuery('');
    window.scrollTo({ top: 0 });
  };
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
    ? allVideos.filter((v) => (v.title + ' ' + v.tag + ' ' + v.desc).toLowerCase().includes(q))
    : [];

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
        <SearchResults query={query} results={results} accent={ACCENT} accentDeep={ACCENT_DEEP} onOpen={openVideo} />
      ) : (
        <div>
          <Hero
            heroIdx={heroIdx}
            muted={heroMuted}
            accent={ACCENT}
            onOpen={openVideo}
            onToggleMute={() => setHeroMuted((m) => !m)}
            onSetHero={setHeroIdx}
          />

          <div style={{ position: 'relative', marginTop: -60, zIndex: 5, paddingBottom: 80 }}>
            {SHOW_TOP10 && (
              <Top10Row accent={ACCENT} accentSoft={ACCENT} accentDeep={ACCENT_DEEP} onOpen={openVideo} />
            )}

            {rows.map((row) => (
              <div key={row.key}>
                <CategoryRow row={row} accent={ACCENT} accentDeep={ACCENT_DEEP} onOpen={openVideo} />
                {row.ctaAfter && <CtaBanner accent={ACCENT} onOpenReq={() => setReqOpen(true)} />}
              </div>
            ))}

            <Footer />
          </div>
        </div>
      )}

      {modal && (
        <VideoModal item={modal} allVideos={allVideos} accent={ACCENT} accentDeep={ACCENT_DEEP} onClose={closeModal} onOpen={openVideo} />
      )}

      {reqOpen && (
        <RequestModal accent={ACCENT} onClose={() => setReqOpen(false)} />
      )}
    </div>
  );
}
