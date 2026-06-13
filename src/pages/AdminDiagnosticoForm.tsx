import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import type {
  DiagnosticoData,
  SiteInfo,
  Competitor,
  Problema,
  Recomendacao,
} from '../data/diagnosticos';

/* ─── Types ─── */

type PlatformKey = 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'linkedin';

interface FormState extends DiagnosticoData {
  _platforms: Record<PlatformKey, boolean>;
  _hasSite: boolean;
  _hasInvestimento: boolean;
}

/* ─── Helpers ─── */

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const STEPS = ['Empresa', 'Plataformas', 'Mercado', 'Diagnóstico', 'Recomendações'];

const EMPTY_FORM: FormState = {
  slug: '',
  empresa: '',
  segmento: '',
  cidade: '',
  estado: '',
  dataGerado: new Date().toISOString().split('T')[0],
  endereco: '',
  telefone: '',
  especialidade: '',
  problemaHeadline: '',
  plataformas: {
    googleBusiness: {
      rating: 0,
      reviews: 0,
      verificado: false,
      temFotos: false,
      horarioPreenchido: false,
      categoriasOk: false,
    },
  },
  busca: { palavraChave: '', volumeEstimado: 'médio' },
  competitors: [],
  problemas: [],
  oportunidadeTexto: '',
  recomendacoes: [],
  ctaWhatsapp: '',
  prazo: '5 dias úteis',
  ativo: true,
  _platforms: { instagram: false, facebook: false, youtube: false, tiktok: false, linkedin: false },
  _hasSite: false,
  _hasInvestimento: false,
};

/* ─── Sub-components ─── */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="admin-field">
      <span className="admin-label">{label}</span>
      {children}
    </div>
  );
}

function CompetitorCard({
  idx,
  item,
  onChange,
  onRemove,
}: {
  idx: number;
  item: Competitor;
  onChange: (idx: number, updated: Competitor) => void;
  onRemove: (idx: number) => void;
}) {
  const set = (key: keyof Competitor, val: unknown) =>
    onChange(idx, { ...item, [key]: val });

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span>#{idx + 1} {item.name || 'Concorrente'}</span>
        <button className="admin-btn-icon" onClick={() => onRemove(idx)} title="Remover">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      <div className="admin-card-body">
        <div className="admin-field-row">
          <Field label="Nome">
            <input className="admin-input" value={item.name} onChange={e => set('name', e.target.value)} placeholder="Nome da empresa" />
          </Field>
          <Field label="Status">
            <select className="admin-select admin-input" value={item.status} onChange={e => set('status', e.target.value)}>
              <option>Aparece</option>
              <option>Invisível</option>
            </select>
          </Field>
        </div>
        <div className="admin-field-row admin-field-row-3">
          <Field label="Rating">
            <input className="admin-input" type="number" step="0.1" min="0" max="5" value={item.rating} onChange={e => set('rating', parseFloat(e.target.value) || 0)} />
          </Field>
          <Field label="Reviews">
            <input className="admin-input" type="number" min="0" value={item.reviews} onChange={e => set('reviews', parseInt(e.target.value) || 0)} />
          </Field>
          <Field label="Qualidade do site">
            <select className="admin-select admin-input" value={item.siteQualidade ?? ''} onChange={e => set('siteQualidade', e.target.value || undefined)}>
              <option value="">— sem site</option>
              <option value="básico">Básico</option>
              <option value="profissional">Profissional</option>
              <option value="premium">Premium</option>
            </select>
          </Field>
        </div>
        <div className="admin-checkboxes">
          {([
            ['hasSite', 'Tem site'],
            ['highlight', 'Destacar (é você)'],
            ['googleAds', 'Google Ads'],
            ['instagramAtivo', 'Instagram ativo'],
          ] as [keyof Competitor, string][]).map(([k, label]) => (
            <label key={k} className="admin-checkbox-row">
              <input type="checkbox" checked={!!item[k]} onChange={e => set(k, e.target.checked)} />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProblemaCard({
  idx,
  item,
  onChange,
  onRemove,
}: {
  idx: number;
  item: Problema;
  onChange: (idx: number, updated: Problema) => void;
  onRemove: (idx: number) => void;
}) {
  const set = (key: keyof Problema, val: unknown) =>
    onChange(idx, { ...item, [key]: val });

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span>#{idx + 1} {item.titulo || 'Problema'}</span>
        <button className="admin-btn-icon" onClick={() => onRemove(idx)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      <div className="admin-card-body">
        <div className="admin-field-row">
          <Field label="Categoria">
            <select className="admin-select admin-input" value={item.categoria} onChange={e => set('categoria', e.target.value)}>
              <option value="busca">Busca</option>
              <option value="redes">Redes sociais</option>
              <option value="reputacao">Reputação</option>
              <option value="site">Site</option>
              <option value="conversao">Conversão</option>
            </select>
          </Field>
          <Field label="Impacto">
            <select className="admin-select admin-input" value={item.impacto} onChange={e => set('impacto', e.target.value)}>
              <option value="alto">Alto</option>
              <option value="médio">Médio</option>
              <option value="baixo">Baixo</option>
            </select>
          </Field>
        </div>
        <div className="admin-field-full">
          <Field label="Título">
            <input className="admin-input" value={item.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Título do problema" />
          </Field>
        </div>
        <div className="admin-field-full">
          <Field label="Descrição">
            <textarea className="admin-textarea" value={item.descricao} onChange={e => set('descricao', e.target.value)} placeholder="Detalhe o problema e seu impacto no negócio" />
          </Field>
        </div>
      </div>
    </div>
  );
}

function RecomendacaoCard({
  idx,
  item,
  onChange,
  onRemove,
}: {
  idx: number;
  item: Recomendacao;
  onChange: (idx: number, updated: Recomendacao) => void;
  onRemove: (idx: number) => void;
}) {
  const set = (key: keyof Recomendacao, val: unknown) =>
    onChange(idx, { ...item, [key]: val });

  return (
    <div className="admin-card">
      <div className="admin-card-header">
        <span>#{idx + 1} {item.titulo || 'Recomendação'}</span>
        <button className="admin-btn-icon" onClick={() => onRemove(idx)}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      <div className="admin-card-body">
        <div className="admin-field-row">
          <Field label="Prioridade">
            <select className="admin-select admin-input" value={item.prioridade} onChange={e => set('prioridade', parseInt(e.target.value) as 1|2|3)}>
              <option value={1}>1 — Alta</option>
              <option value={2}>2 — Média</option>
              <option value={3}>3 — Baixa</option>
            </select>
          </Field>
          <Field label="Serviço">
            <select className="admin-select admin-input" value={item.servico} onChange={e => set('servico', e.target.value)}>
              <option value="site">Site</option>
              <option value="seo-local">SEO Local</option>
              <option value="google-perfil">Google Perfil</option>
              <option value="social">Redes Sociais</option>
              <option value="google-ads">Google Ads</option>
              <option value="conteudo">Conteúdo</option>
            </select>
          </Field>
        </div>
        <div className="admin-field-full">
          <Field label="Título">
            <input className="admin-input" value={item.titulo} onChange={e => set('titulo', e.target.value)} placeholder="Nome da recomendação" />
          </Field>
        </div>
        <div className="admin-field-full">
          <Field label="Descrição">
            <textarea className="admin-textarea" value={item.descricao} onChange={e => set('descricao', e.target.value)} placeholder="O que será feito e por quê" />
          </Field>
        </div>
        <div className="admin-field-row">
          <Field label="Antes (situação atual)">
            <input className="admin-input" value={item.antes ?? ''} onChange={e => set('antes', e.target.value || undefined)} placeholder="Situação atual do cliente" />
          </Field>
          <Field label="Depois (resultado esperado)">
            <input className="admin-input" value={item.depois ?? ''} onChange={e => set('depois', e.target.value || undefined)} placeholder="Resultado após implementar" />
          </Field>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export function AdminDiagnosticoForm() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [slugManual, setSlugManual] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingForm, setLoadingForm] = useState(isEditing);

  /* Load existing data when editing */
  useEffect(() => {
    if (!isEditing) return;
    supabase
      .from('diagnosticos')
      .select('data, ativo')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setError('Diagnóstico não encontrado.'); setLoadingForm(false); return; }
        const d = data.data as DiagnosticoData;
        setForm({
          ...EMPTY_FORM,
          ...d,
          ativo: data.ativo,
          _platforms: {
            instagram: !!d.plataformas.instagram,
            facebook: !!d.plataformas.facebook,
            youtube: !!d.plataformas.youtube,
            tiktok: !!d.plataformas.tiktok,
            linkedin: !!d.plataformas.linkedin,
          },
          _hasSite: !!d.site,
          _hasInvestimento: !!d.investimento,
        });
        setSlugManual(true);
        setLoadingForm(false);
      });
  }, [id, isEditing]);

  /* Auto-generate slug from empresa (create mode only) */
  useEffect(() => {
    if (!slugManual && !isEditing) {
      setForm(f => ({ ...f, slug: slugify(f.empresa) }));
    }
  }, [form.empresa, slugManual, isEditing]);

  /* Generic field setter */
  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  /* Platform toggle */
  function togglePlatform(key: PlatformKey, enabled: boolean) {
    const defaults: Record<PlatformKey, unknown> = {
      instagram: { handle: '', seguidores: 0, ativo: true },
      facebook: { handle: '', seguidores: 0, ativo: true },
      youtube: { canal: '', inscritos: 0 },
      tiktok: { handle: '', seguidores: 0 },
      linkedin: { pagina: '', seguidores: 0 },
    };
    setForm(f => ({
      ...f,
      _platforms: { ...f._platforms, [key]: enabled },
      plataformas: {
        ...f.plataformas,
        [key]: enabled ? (f.plataformas[key] ?? defaults[key]) : undefined,
      },
    }));
  }

  /* Dynamic array helpers */
  function addCompetitor() {
    set('competitors', [...form.competitors, { name: '', rating: 4.5, reviews: 0, hasSite: false, status: 'Aparece' as const }]);
  }
  function updateCompetitor(idx: number, updated: Competitor) {
    const arr = [...form.competitors]; arr[idx] = updated; set('competitors', arr);
  }
  function removeCompetitor(idx: number) {
    set('competitors', form.competitors.filter((_, i) => i !== idx));
  }

  function addProblema() {
    set('problemas', [...form.problemas, { categoria: 'busca' as const, titulo: '', descricao: '', impacto: 'alto' as const }]);
  }
  function updateProblema(idx: number, updated: Problema) {
    const arr = [...form.problemas]; arr[idx] = updated; set('problemas', arr);
  }
  function removeProblema(idx: number) {
    set('problemas', form.problemas.filter((_, i) => i !== idx));
  }

  function addRecomendacao() {
    set('recomendacoes', [...form.recomendacoes, { prioridade: 1 as const, servico: 'site' as const, titulo: '', descricao: '' }]);
  }
  function updateRecomendacao(idx: number, updated: Recomendacao) {
    const arr = [...form.recomendacoes]; arr[idx] = updated; set('recomendacoes', arr);
  }
  function removeRecomendacao(idx: number) {
    set('recomendacoes', form.recomendacoes.filter((_, i) => i !== idx));
  }

  /* Save */
  async function save() {
    setError(''); setSuccess('');
    if (!form.slug) return setError('Slug é obrigatório.');
    if (!form.empresa) return setError('Nome da empresa é obrigatório.');

    setSaving(true);

    const payload: DiagnosticoData = {
      slug: form.slug, empresa: form.empresa, segmento: form.segmento,
      cidade: form.cidade, estado: form.estado, dataGerado: form.dataGerado,
      endereco: form.endereco, telefone: form.telefone, especialidade: form.especialidade,
      problemaHeadline: form.problemaHeadline, plataformas: form.plataformas,
      site: form._hasSite ? (form.site ?? { url: '', ssl: false, mobile: false, velocidade: 'médio', seoBasico: false, qualidade: 'básico' }) : undefined,
      busca: form.busca, competitors: form.competitors, problemas: form.problemas,
      oportunidadeTexto: form.oportunidadeTexto, recomendacoes: form.recomendacoes,
      investimento: form._hasInvestimento ? form.investimento : undefined,
      ctaWhatsapp: form.ctaWhatsapp, prazo: form.prazo, ativo: form.ativo,
    };

    if (isEditing) {
      const { error } = await supabase
        .from('diagnosticos')
        .update({ slug: form.slug, empresa: form.empresa, ativo: form.ativo, data: payload, atualizado_em: new Date().toISOString() })
        .eq('id', id);
      if (error) { setError(error.message); setSaving(false); return; }
    } else {
      const { error } = await supabase
        .from('diagnosticos')
        .insert({ slug: form.slug, empresa: form.empresa, ativo: form.ativo, data: payload });
      if (error) { setError(error.message); setSaving(false); return; }
    }

    setSaving(false);
    setSuccess('Salvo com sucesso!');
    setTimeout(() => navigate('/admin/dashboard'), 1200);
  }

  /* ── Render Steps ── */

  const gb = form.plataformas.googleBusiness;
  const setGb = (key: string, val: unknown) =>
    setForm(f => ({ ...f, plataformas: { ...f.plataformas, googleBusiness: { ...f.plataformas.googleBusiness, [key]: val } } }));

  const site = form.site ?? { url: '', ssl: false, mobile: false, velocidade: 'médio' as const, seoBasico: false, qualidade: 'básico' as const };
  const setSite = (key: keyof SiteInfo, val: unknown) => {
    setForm(f => ({ ...f, site: { ...site, [key]: val } }));
  };

  const inv = form.investimento ?? { min: 0, max: 0, modalidade: 'único' as const };
  const setInv = (key: string, val: unknown) => {
    setForm(f => ({ ...f, investimento: { ...inv, [key]: val } }));
  };

  function renderStep() {
    switch (step) {
      /* ── Step 0: Empresa ── */
      case 0:
        return (
          <>
            <p className="admin-section-title">Identificação da empresa</p>
            <div className="admin-field-row">
              <Field label="Nome da empresa *">
                <input className="admin-input" value={form.empresa} onChange={e => set('empresa', e.target.value)} placeholder="Ex: UTI Informática & Celulares" />
              </Field>
              <Field label="Segmento">
                <input className="admin-input" value={form.segmento} onChange={e => set('segmento', e.target.value)} placeholder="Ex: Assistência técnica Apple" />
              </Field>
            </div>
            <div className="admin-field-row">
              <Field label="Cidade">
                <input className="admin-input" value={form.cidade} onChange={e => set('cidade', e.target.value)} placeholder="Foz do Iguaçu" />
              </Field>
              <Field label="Estado (UF)">
                <input className="admin-input" value={form.estado} onChange={e => set('estado', e.target.value)} placeholder="PR" maxLength={2} />
              </Field>
            </div>
            <div className="admin-field-full">
              <Field label="Endereço">
                <input className="admin-input" value={form.endereco} onChange={e => set('endereco', e.target.value)} placeholder="Av. Brasil, 40 — Centro, Foz do Iguaçu - PR" />
              </Field>
            </div>
            <div className="admin-field-row">
              <Field label="Telefone">
                <input className="admin-input" value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(45) 3028-2249" />
              </Field>
              <Field label="Especialidade">
                <input className="admin-input" value={form.especialidade} onChange={e => set('especialidade', e.target.value)} placeholder="Ex: Apple (iPhone, iPad, MacBook)" />
              </Field>
            </div>

            <div className="admin-spacer" />
            <p className="admin-section-title">Link e entrega</p>

            <div className="admin-field-row">
              <Field label="Slug (URL) *">
                <input
                  className="admin-input"
                  value={form.slug}
                  onChange={e => { setSlugManual(true); set('slug', e.target.value); }}
                  placeholder="uti-informatica"
                  style={{ fontFamily: 'var(--ff-mono)', fontSize: 13 }}
                />
              </Field>
              <Field label="Data de geração">
                <input className="admin-input" type="date" value={form.dataGerado} onChange={e => set('dataGerado', e.target.value)} />
              </Field>
            </div>
            <div className="admin-field-row">
              <Field label="WhatsApp CTA (só números)">
                <input className="admin-input" value={form.ctaWhatsapp} onChange={e => set('ctaWhatsapp', e.target.value)} placeholder="5545900000000" />
              </Field>
              <Field label="Prazo de entrega">
                <input className="admin-input" value={form.prazo} onChange={e => set('prazo', e.target.value)} placeholder="15–25 dias" />
              </Field>
            </div>

            <div className="admin-spacer" />
            <p className="admin-section-title">Manchete do problema</p>
            <div className="admin-field-full">
              <Field label="problemaHeadline">
                <textarea className="admin-textarea" style={{ minHeight: 96 }} value={form.problemaHeadline} onChange={e => set('problemaHeadline', e.target.value)} placeholder="Quando alguém pesquisa '...' no Google, a [empresa] não aparece..." />
              </Field>
            </div>
          </>
        );

      /* ── Step 1: Plataformas ── */
      case 1:
        return (
          <>
            <p className="admin-section-title">Google Business (obrigatório)</p>
            <div className="admin-field-row admin-field-row-3">
              <Field label="Nota (rating)">
                <input className="admin-input" type="number" step="0.1" min="0" max="5" value={gb.rating} onChange={e => setGb('rating', parseFloat(e.target.value) || 0)} />
              </Field>
              <Field label="Avaliações (reviews)">
                <input className="admin-input" type="number" min="0" value={gb.reviews} onChange={e => setGb('reviews', parseInt(e.target.value) || 0)} />
              </Field>
            </div>
            <div className="admin-checkboxes">
              {([
                ['verificado', 'Perfil verificado'],
                ['temFotos', 'Tem fotos'],
                ['horarioPreenchido', 'Horário preenchido'],
                ['categoriasOk', 'Categorias corretas'],
              ] as [string, string][]).map(([k, label]) => (
                <label key={k} className="admin-checkbox-row">
                  <input type="checkbox" checked={!!gb[k as keyof typeof gb]} onChange={e => setGb(k, e.target.checked)} />
                  {label}
                </label>
              ))}
            </div>

            <div className="admin-spacer" />
            <p className="admin-section-title">Redes sociais (opcionais)</p>

            {/* Instagram */}
            <div className="admin-platform-block">
              <div className="admin-platform-header" onClick={() => togglePlatform('instagram', !form._platforms.instagram)}>
                <span className="admin-platform-name">Instagram</span>
                <input type="checkbox" checked={form._platforms.instagram} onChange={e => togglePlatform('instagram', e.target.checked)} onClick={e => e.stopPropagation()} />
              </div>
              {form._platforms.instagram && form.plataformas.instagram && (
                <div className="admin-platform-body">
                  <div className="admin-field-row">
                    <Field label="Handle">
                      <input className="admin-input" value={form.plataformas.instagram.handle} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, instagram: { ...f.plataformas.instagram!, handle: e.target.value } } }))} placeholder="@handle" />
                    </Field>
                    <Field label="Seguidores">
                      <input className="admin-input" type="number" min="0" value={form.plataformas.instagram.seguidores} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, instagram: { ...f.plataformas.instagram!, seguidores: parseInt(e.target.value) || 0 } } }))} />
                    </Field>
                  </div>
                  <label className="admin-checkbox-row">
                    <input type="checkbox" checked={form.plataformas.instagram.ativo} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, instagram: { ...f.plataformas.instagram!, ativo: e.target.checked } } }))} />
                    Perfil ativo
                  </label>
                </div>
              )}
            </div>

            {/* Facebook */}
            <div className="admin-platform-block">
              <div className="admin-platform-header" onClick={() => togglePlatform('facebook', !form._platforms.facebook)}>
                <span className="admin-platform-name">Facebook</span>
                <input type="checkbox" checked={form._platforms.facebook} onChange={e => togglePlatform('facebook', e.target.checked)} onClick={e => e.stopPropagation()} />
              </div>
              {form._platforms.facebook && form.plataformas.facebook && (
                <div className="admin-platform-body">
                  <div className="admin-field-row">
                    <Field label="Handle / Página">
                      <input className="admin-input" value={form.plataformas.facebook.handle} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, facebook: { ...f.plataformas.facebook!, handle: e.target.value } } }))} placeholder="@pagina" />
                    </Field>
                    <Field label="Curtidas / Seguidores">
                      <input className="admin-input" type="number" min="0" value={form.plataformas.facebook.seguidores} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, facebook: { ...f.plataformas.facebook!, seguidores: parseInt(e.target.value) || 0 } } }))} />
                    </Field>
                  </div>
                  <label className="admin-checkbox-row">
                    <input type="checkbox" checked={form.plataformas.facebook.ativo} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, facebook: { ...f.plataformas.facebook!, ativo: e.target.checked } } }))} />
                    Página ativa
                  </label>
                </div>
              )}
            </div>

            {/* YouTube */}
            <div className="admin-platform-block">
              <div className="admin-platform-header" onClick={() => togglePlatform('youtube', !form._platforms.youtube)}>
                <span className="admin-platform-name">YouTube</span>
                <input type="checkbox" checked={form._platforms.youtube} onChange={e => togglePlatform('youtube', e.target.checked)} onClick={e => e.stopPropagation()} />
              </div>
              {form._platforms.youtube && form.plataformas.youtube && (
                <div className="admin-platform-body">
                  <div className="admin-field-row">
                    <Field label="Nome do canal">
                      <input className="admin-input" value={form.plataformas.youtube.canal} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, youtube: { ...f.plataformas.youtube!, canal: e.target.value } } }))} placeholder="Nome do canal" />
                    </Field>
                    <Field label="Inscritos">
                      <input className="admin-input" type="number" min="0" value={form.plataformas.youtube.inscritos} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, youtube: { ...f.plataformas.youtube!, inscritos: parseInt(e.target.value) || 0 } } }))} />
                    </Field>
                  </div>
                </div>
              )}
            </div>

            {/* TikTok */}
            <div className="admin-platform-block">
              <div className="admin-platform-header" onClick={() => togglePlatform('tiktok', !form._platforms.tiktok)}>
                <span className="admin-platform-name">TikTok</span>
                <input type="checkbox" checked={form._platforms.tiktok} onChange={e => togglePlatform('tiktok', e.target.checked)} onClick={e => e.stopPropagation()} />
              </div>
              {form._platforms.tiktok && form.plataformas.tiktok && (
                <div className="admin-platform-body">
                  <div className="admin-field-row">
                    <Field label="Handle">
                      <input className="admin-input" value={form.plataformas.tiktok.handle} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, tiktok: { ...f.plataformas.tiktok!, handle: e.target.value } } }))} placeholder="@handle" />
                    </Field>
                    <Field label="Seguidores">
                      <input className="admin-input" type="number" min="0" value={form.plataformas.tiktok.seguidores} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, tiktok: { ...f.plataformas.tiktok!, seguidores: parseInt(e.target.value) || 0 } } }))} />
                    </Field>
                  </div>
                </div>
              )}
            </div>

            {/* LinkedIn */}
            <div className="admin-platform-block">
              <div className="admin-platform-header" onClick={() => togglePlatform('linkedin', !form._platforms.linkedin)}>
                <span className="admin-platform-name">LinkedIn</span>
                <input type="checkbox" checked={form._platforms.linkedin} onChange={e => togglePlatform('linkedin', e.target.checked)} onClick={e => e.stopPropagation()} />
              </div>
              {form._platforms.linkedin && form.plataformas.linkedin && (
                <div className="admin-platform-body">
                  <div className="admin-field-row">
                    <Field label="Página">
                      <input className="admin-input" value={form.plataformas.linkedin.pagina} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, linkedin: { ...f.plataformas.linkedin!, pagina: e.target.value } } }))} placeholder="company/nome" />
                    </Field>
                    <Field label="Seguidores">
                      <input className="admin-input" type="number" min="0" value={form.plataformas.linkedin.seguidores} onChange={e => setForm(f => ({ ...f, plataformas: { ...f.plataformas, linkedin: { ...f.plataformas.linkedin!, seguidores: parseInt(e.target.value) || 0 } } }))} />
                    </Field>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-spacer" />
            <p className="admin-section-title">Site (opcional)</p>
            <div className="admin-platform-block">
              <div className="admin-platform-header" onClick={() => set('_hasSite', !form._hasSite)}>
                <span className="admin-platform-name">Tem site?</span>
                <input type="checkbox" checked={form._hasSite} onChange={e => set('_hasSite', e.target.checked)} onClick={e => e.stopPropagation()} />
              </div>
              {form._hasSite && (
                <div className="admin-platform-body">
                  <div className="admin-field-full">
                    <Field label="URL">
                      <input className="admin-input" value={site.url} onChange={e => setSite('url', e.target.value)} placeholder="https://exemplo.com.br" />
                    </Field>
                  </div>
                  <div className="admin-field-row admin-field-row-3">
                    <Field label="Velocidade">
                      <select className="admin-select admin-input" value={site.velocidade} onChange={e => setSite('velocidade', e.target.value)}>
                        <option value="lento">Lento</option>
                        <option value="médio">Médio</option>
                        <option value="rápido">Rápido</option>
                      </select>
                    </Field>
                    <Field label="Qualidade">
                      <select className="admin-select admin-input" value={site.qualidade} onChange={e => setSite('qualidade', e.target.value)}>
                        <option value="básico">Básico</option>
                        <option value="profissional">Profissional</option>
                        <option value="premium">Premium</option>
                      </select>
                    </Field>
                  </div>
                  <div className="admin-checkboxes">
                    {([['ssl', 'HTTPS/SSL'], ['mobile', 'Mobile-friendly'], ['seoBasico', 'SEO básico ok']] as [keyof SiteInfo, string][]).map(([k, label]) => (
                      <label key={k} className="admin-checkbox-row">
                        <input type="checkbox" checked={!!site[k]} onChange={e => setSite(k, e.target.checked)} />
                        {label}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        );

      /* ── Step 2: Mercado ── */
      case 2:
        return (
          <>
            <p className="admin-section-title">Palavra-chave principal</p>
            <div className="admin-field-row">
              <Field label="Palavra-chave">
                <input className="admin-input" value={form.busca.palavraChave} onChange={e => set('busca', { ...form.busca, palavraChave: e.target.value })} placeholder="assistência técnica foz do iguaçu" />
              </Field>
              <Field label="Volume estimado">
                <select className="admin-select admin-input" value={form.busca.volumeEstimado} onChange={e => set('busca', { ...form.busca, volumeEstimado: e.target.value as 'baixo'|'médio'|'alto' })}>
                  <option value="baixo">Baixo (&lt;100/mês)</option>
                  <option value="médio">Médio (100–1k/mês)</option>
                  <option value="alto">Alto (&gt;1k/mês)</option>
                </select>
              </Field>
            </div>
            <div className="admin-field-full">
              <Field label="Posição atual (opcional)">
                <input className="admin-input" type="number" min="1" value={form.busca.posicaoAtual ?? ''} onChange={e => set('busca', { ...form.busca, posicaoAtual: e.target.value ? parseInt(e.target.value) : undefined })} placeholder="Ex: 8 (deixe em branco se não aparece)" style={{ maxWidth: 160 }} />
              </Field>
            </div>

            <div className="admin-spacer" />
            <p className="admin-section-title">Concorrentes</p>
            <div className="admin-list-actions">
              <button className="admin-btn admin-btn-sm" onClick={addCompetitor}>+ Adicionar concorrente</button>
            </div>
            {form.competitors.length === 0 && (
              <div className="admin-empty" style={{ padding: '24px', textAlign: 'left' }}>Nenhum concorrente adicionado.</div>
            )}
            {form.competitors.map((c, i) => (
              <CompetitorCard key={i} idx={i} item={c} onChange={updateCompetitor} onRemove={removeCompetitor} />
            ))}
          </>
        );

      /* ── Step 3: Diagnóstico ── */
      case 3:
        return (
          <>
            <p className="admin-section-title">Texto de oportunidade</p>
            <div className="admin-field-full">
              <Field label="oportunidadeTexto">
                <textarea className="admin-textarea" style={{ minHeight: 120 }} value={form.oportunidadeTexto} onChange={e => set('oportunidadeTexto', e.target.value)} placeholder="Contextualize a oportunidade do cliente — o que eles têm de bom e o que falta..." />
              </Field>
            </div>

            <div className="admin-spacer" />
            <p className="admin-section-title">Problemas identificados</p>
            <div className="admin-list-actions">
              <button className="admin-btn admin-btn-sm" onClick={addProblema}>+ Adicionar problema</button>
            </div>
            {form.problemas.length === 0 && (
              <div className="admin-empty" style={{ padding: '24px', textAlign: 'left' }}>Nenhum problema adicionado.</div>
            )}
            {form.problemas.map((p, i) => (
              <ProblemaCard key={i} idx={i} item={p} onChange={updateProblema} onRemove={removeProblema} />
            ))}
          </>
        );

      /* ── Step 4: Recomendações ── */
      case 4:
        return (
          <>
            <p className="admin-section-title">Recomendações</p>
            <div className="admin-list-actions">
              <button className="admin-btn admin-btn-sm" onClick={addRecomendacao}>+ Adicionar recomendação</button>
            </div>
            {form.recomendacoes.length === 0 && (
              <div className="admin-empty" style={{ padding: '24px', textAlign: 'left' }}>Nenhuma recomendação adicionada.</div>
            )}
            {form.recomendacoes.map((r, i) => (
              <RecomendacaoCard key={i} idx={i} item={r} onChange={updateRecomendacao} onRemove={removeRecomendacao} />
            ))}

            <div className="admin-spacer" />
            <p className="admin-section-title">Investimento (opcional)</p>
            <div className="admin-platform-block">
              <div className="admin-platform-header" onClick={() => set('_hasInvestimento', !form._hasInvestimento)}>
                <span className="admin-platform-name">Mostrar faixa de investimento?</span>
                <input type="checkbox" checked={form._hasInvestimento} onChange={e => set('_hasInvestimento', e.target.checked)} onClick={e => e.stopPropagation()} />
              </div>
              {form._hasInvestimento && (
                <div className="admin-platform-body">
                  <div className="admin-field-row admin-field-row-3">
                    <Field label="Mínimo (R$)">
                      <input className="admin-input" type="number" min="0" value={inv.min} onChange={e => setInv('min', parseInt(e.target.value) || 0)} />
                    </Field>
                    <Field label="Máximo (R$)">
                      <input className="admin-input" type="number" min="0" value={inv.max} onChange={e => setInv('max', parseInt(e.target.value) || 0)} />
                    </Field>
                    <Field label="Modalidade">
                      <select className="admin-select admin-input" value={inv.modalidade} onChange={e => setInv('modalidade', e.target.value)}>
                        <option value="único">Único</option>
                        <option value="mensal">Mensal</option>
                        <option value="ambos">Ambos</option>
                      </select>
                    </Field>
                  </div>
                </div>
              )}
            </div>

            <div className="admin-spacer" />
            <p className="admin-section-title">Publicação</p>
            <label className="admin-checkbox-row">
              <input type="checkbox" checked={form.ativo} onChange={e => set('ativo', e.target.checked)} />
              Diagnóstico ativo (visível ao cliente)
            </label>
            <div style={{ marginTop: 8, fontSize: 12, color: 'var(--fg-muted)' }}>
              URL pública: <code style={{ fontFamily: 'var(--ff-mono)' }}>/diagnostico/{form.slug || 'seu-slug'}</code>
            </div>
          </>
        );

      default: return null;
    }
  }

  if (loadingForm) {
    return <div className="admin-loading">Carregando...</div>;
  }

  return (
    <div className="admin-wrap">
      <header className="admin-header">
        <Link to="/admin/dashboard" className="admin-header-brand">DIAG / CMS</Link>
        <div className="admin-header-right">
          <span className="admin-user-email">{user?.email}</span>
          <button className="admin-btn admin-btn-sm" onClick={() => signOut()}>Sair</button>
        </div>
      </header>

      <div className="admin-content admin-form-wrap">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <Link to="/admin/dashboard" style={{ color: 'var(--fg-muted)', fontSize: 13 }}>← Diagnósticos</Link>
        </div>

        <h1 className="admin-page-title">
          {isEditing ? `Editando: ${form.empresa || '...'}` : 'Novo diagnóstico'}
        </h1>
        <p className="admin-page-subtitle">
          {isEditing ? `slug: ${form.slug}` : 'Preencha todas as informações do cliente'}
        </p>

        {/* Steps */}
        <div className="admin-steps">
          {STEPS.map((label, i) => (
            <div
              key={i}
              className={`admin-step ${i === step ? 'active' : i < step ? 'done' : ''}`}
              onClick={() => setStep(i)}
            >
              {i < step ? '✓ ' : `${i + 1}. `}{label}
            </div>
          ))}
        </div>

        {error && <div className="admin-error">{error}</div>}
        {success && <div className="admin-success">{success}</div>}

        {renderStep()}

        {/* Navigation */}
        <div className="admin-form-nav">
          <button
            className="admin-btn"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            style={{ opacity: step === 0 ? 0.4 : 1 }}
          >
            ← Anterior
          </button>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className="admin-btn" onClick={save} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar rascunho'}
            </button>
            {step < STEPS.length - 1 ? (
              <button className="admin-btn admin-btn-primary" onClick={() => setStep(s => s + 1)}>
                Próximo →
              </button>
            ) : (
              <button className="admin-btn admin-btn-primary" onClick={save} disabled={saving}>
                {saving ? 'Publicando...' : isEditing ? 'Atualizar' : 'Publicar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
