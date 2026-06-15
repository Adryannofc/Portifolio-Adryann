import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useI18n } from './contexts/I18nContext';
import { BootLoader } from './components/BootLoader';
import { BottomNav } from './components/BottomNav';
import { Cursor } from './components/Cursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Work } from './components/Work';
import { Social } from './components/Social';
import { Services } from './components/Services';
import { Process } from './components/Process';
import { TechGraph } from './components/TechGraph';
import { About } from './components/About';
import { IndexTable } from './components/IndexTable';
import { Contact } from './components/Contact';
import { TweaksPanel, type Tweaks } from './components/TweaksPanel';
import { SpeedDial } from './components/SpeedDial';
import { CaseStudy } from './pages/CaseStudy';
import { Diagnostico } from './pages/Diagnostico';
import { AdminLogin } from './pages/AdminLogin';
import { AdminOverview } from './pages/AdminOverview';
import { AdminDiagnosticosList } from './pages/AdminDiagnosticosList';
import { AdminDiagnosticoForm } from './pages/AdminDiagnosticoForm';
import { AdminProjetos } from './pages/AdminProjetos';
import { AdminProjetosForm } from './pages/AdminProjetosForm';
import { AdminLayout } from './components/admin/AdminLayout';
import { ComingSoon } from './components/admin/ComingSoon';
import { AuthGuard } from './components/admin/AuthGuard';

const DEFAULT_TWEAKS: Tweaks = {
  theme: 'dark',
  heroVariant: 'statement',
  accentUse: 'standard',
  showSectionIndex: true,
  monoOverlines: true,
};

function readTweakDefaults(): Tweaks {
  const el = document.getElementById('tweak-defaults');
  if (!el?.textContent) return DEFAULT_TWEAKS;
  try {
    const raw = el.textContent
      .replace(/\/\*EDITMODE-BEGIN\*\//, '')
      .replace(/\/\*EDITMODE-END\*\//, '');
    return { ...DEFAULT_TWEAKS, ...(JSON.parse(raw) as Partial<Tweaks>) };
  } catch {
    return DEFAULT_TWEAKS;
  }
}

function Home() {
  return (
    <main>
      <Hero />
      <Work />
      <Social />
      <Services />
      <Process />
      <TechGraph />
      <About />
      <IndexTable />
      <Contact />
    </main>
  );
}

export default function App() {
  const { t } = useI18n();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdmin = location.pathname.startsWith('/admin');
  const [booted, setBooted] = useState(!isHome);
  const [tweaks, setTweaks] = useState<Tweaks>(() => readTweakDefaults());
  const [panelOpen, setPanelOpen] = useState(false);

  useEffect(() => {
    document.title = t.meta.title;
  }, [t.meta.title]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', tweaks.theme);
  }, [tweaks.theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (tweaks.accentUse === 'minimal') root.style.setProperty('--accent', '#C9C4B8');
    else if (tweaks.accentUse === 'loud') root.style.setProperty('--accent', '#FF6F00');
    else root.style.setProperty('--accent', '#F28705');
  }, [tweaks.accentUse]);

  useEffect(() => {
    if (!isHome) document.body.classList.remove('booting');
  }, [isHome]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') setPanelOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setPanelOpen(false);
    };
    window.addEventListener('message', onMsg);
    if (window.parent !== window) {
      window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    }
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'auto' });
  }, [location.pathname, location.hash]);

  const onBootDone = () => {
    setBooted(true);
    document.body.classList.remove('booting');
  };

  const isTouch = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

  return (
    <>
      {!booted && isHome && <BootLoader onDone={onBootDone} />}
      {!isTouch && !isAdmin && <Cursor />}
      {!isAdmin && (
        <Header
          theme={tweaks.theme}
          setTheme={(t) => setTweaks({ ...tweaks, theme: t })}
          showIndex={tweaks.showSectionIndex}
          mono={tweaks.monoOverlines}
        />
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/diagnostico/:slug" element={<Diagnostico />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AuthGuard><AdminLayout /></AuthGuard>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="diagnosticos" element={<AdminDiagnosticosList />} />
          <Route path="diagnostico/novo" element={<AdminDiagnosticoForm />} />
          <Route path="diagnostico/:id/editar" element={<AdminDiagnosticoForm />} />
          <Route path="projetos" element={<AdminProjetos />} />
          <Route path="projetos/novo" element={<AdminProjetosForm />} />
          <Route path="mensagens" element={<ComingSoon title="Mensagens" description="Visualize e responda mensagens recebidas pelo formulário de contato." />} />
          <Route path="analytics" element={<ComingSoon title="Analytics" description="Veja métricas consolidadas: views, CTAs e conversões ao longo do tempo." />} />
          <Route path="configuracoes" element={<ComingSoon title="Configurações" description="Preferências do portfólio, dados pessoais e integrações." />} />
        </Route>
      </Routes>

      {!isAdmin && <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} open={panelOpen} />}
      {!isAdmin && <SpeedDial />}
      {!isAdmin && <BottomNav />}
    </>
  );
}
