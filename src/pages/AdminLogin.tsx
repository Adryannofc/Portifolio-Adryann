import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';

type View = 'login' | 'forgot';

export function AdminLogin() {
  const { user, loading, signIn } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<View>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate('/admin/dashboard', { replace: true });
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="admin-loading"><span>verificando...</span></div>;
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) setError(error.message);
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    });
    setSubmitting(false);
    if (error) setError(error.message);
    else setResetSent(true);
  }

  function goForgot() { setView('forgot'); setError(''); }
  function goLogin() { setView('login'); setError(''); setResetSent(false); }

  return (
    <div className="login-root">
      {/* Left decorative panel */}
      <div className="login-panel-left">
        <div className="login-stripes" aria-hidden="true" />
        <div className="login-left-top">
          <BrandBadge />
        </div>
        <div className="login-left-bottom">
          <p className="login-tagline">Diagnósticos de<br />Presença Digital</p>
          <span className="login-year">2025</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-panel-right">
        <div className="login-panel-right-top">
          <BrandBadge />
          <a href="/" className="login-close" aria-label="Voltar ao portfólio">×</a>
        </div>

        <div className="login-form-content">
          {view === 'login' ? (
            <>
              <h1 className="login-title">Painel de<br />Diagnósticos</h1>
              <p className="login-subtitle">
                Crie e gerencie diagnósticos de presença digital para clientes.
              </p>

              <form onSubmit={handleEmailLogin} className="login-form">
                {error && <div className="login-error">{error}</div>}

                <div className="login-field">
                  <label className="login-label" htmlFor="login-email">E-mail</label>
                  <input
                    id="login-email"
                    type="email"
                    className="login-input"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>

                <div className="login-field">
                  <div className="login-label-row">
                    <label className="login-label" htmlFor="login-pwd">Senha</label>
                    <button type="button" className="login-forgot-link" onClick={goForgot}>
                      Esqueci minha senha
                    </button>
                  </div>
                  <div className="login-pwd-wrap">
                    <input
                      id="login-pwd"
                      type={showPwd ? 'text' : 'password'}
                      className="login-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="login-pwd-toggle"
                      onClick={() => setShowPwd(p => !p)}
                      aria-label={showPwd ? 'Ocultar senha' : 'Mostrar senha'}
                    >
                      {showPwd ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </div>

                <div className="login-check-row">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me">Lembrar de mim</label>
                </div>

                <button type="submit" className="login-btn-primary" disabled={submitting}>
                  {submitting ? 'Entrando...' : 'Entrar →'}
                </button>
              </form>

              <div className="login-divider"><span>ou</span></div>

              <button type="button" className="login-btn-google" onClick={() => signIn()}>
                <GoogleIcon />
                Entrar com Google
              </button>
            </>
          ) : (
            <>
              <button type="button" className="login-back" onClick={goLogin}>
                ← Voltar
              </button>

              <h1 className="login-title" style={{ marginTop: 20 }}>
                Recuperar<br />Senha
              </h1>
              <p className="login-subtitle">
                Informe seu e-mail para receber o link de redefinição.
              </p>

              {resetSent ? (
                <div className="login-success">
                  Link enviado! Verifique sua caixa de entrada.
                </div>
              ) : (
                <form onSubmit={handleForgot} className="login-form">
                  {error && <div className="login-error">{error}</div>}
                  <div className="login-field">
                    <label className="login-label" htmlFor="forgot-email">E-mail</label>
                    <input
                      id="forgot-email"
                      type="email"
                      className="login-input"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                  <button type="submit" className="login-btn-primary" disabled={submitting}>
                    {submitting ? 'Enviando...' : 'Enviar link →'}
                  </button>
                </form>
              )}
            </>
          )}
        </div>

        <p className="login-footer-url">adryann.dev</p>
      </div>
    </div>
  );
}

function BrandBadge() {
  return (
    <div className="login-brand-badge">
      <span className="login-brand-sq" />
      <span className="login-brand-text">Adryann Felix · CMS</span>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}
