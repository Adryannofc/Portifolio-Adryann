import {
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from 'react';

interface OverlineProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}
export const Overline = ({ children, style = {}, className = '' }: OverlineProps) => (
  <span className={`overline ${className}`} style={style}>
    {children}
  </span>
);

interface RuleProps {
  style?: CSSProperties;
}
export const Rule = ({ style = {} }: RuleProps) => (
  <div style={{ height: 1, background: 'var(--rule)', width: '100%', ...style }} />
);

interface MediaProps {
  label: string;
  meta?: string;
  ratio?: string;
  fill?: boolean;
  style?: CSSProperties;
}
export function Media({ label, meta = 'IMG · TBD', ratio = '16 / 10', fill = false, style = {} }: MediaProps) {
  return (
    <div
      className="media"
      data-cursor="view"
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        aspectRatio: fill ? undefined : ratio,
        height: fill ? '100%' : undefined,
        background:
          'repeating-linear-gradient(135deg, #2A2824 0 22px, rgba(255,255,255,0.04) 22px 44px)',
        ...style,
      }}
    >
      <div
        className="mono"
        style={{
          position: 'absolute',
          inset: 14,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(240,238,233,0.7)',
          pointerEvents: 'none',
        }}
      >
        <span>{label}</span>
        <span>{meta}</span>
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 70% 30%, rgba(242,135,5,0.10), transparent 60%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  as?: ElementType;
  style?: CSSProperties;
  [key: string]: unknown;
}
export function Magnetic({
  children,
  strength = 0.35,
  as: Tag = 'div',
  style = {},
  ...props
}: MagneticProps) {
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(raf);
      el.style.transform = '';
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
  return (
    <Tag
      ref={ref}
      style={{ display: 'inline-block', transition: 'transform 420ms var(--ease-out)', ...style }}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface ULinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  external?: boolean;
}
export function ULink({
  children,
  href = '#',
  className = '',
  style,
  external = false,
  ...rest
}: ULinkProps) {
  return (
    <a
      className={`u-link ${className}`}
      href={href}
      style={style}
      data-cursor={external ? 'external' : 'link'}
      {...rest}
    >
      <span className="u-label">{children}</span>
      {external && <span className="u-ext">↗</span>}
    </a>
  );
}

type ButtonVariant = 'primary' | 'ghost';
interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  children: ReactNode;
  variant?: ButtonVariant;
  href?: string;
  arrow?: boolean;
  style?: CSSProperties;
}
export function Button({
  children,
  variant = 'primary',
  href,
  onClick,
  style,
  arrow = true,
  ...rest
}: ButtonProps) {
  const cls = `btn btn-${variant}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span className="btn-arrow" aria-hidden>
          →
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href} style={style} data-cursor="link">
        {content}
      </a>
    );
  }
  return (
    <button
      className={cls}
      onClick={onClick}
      style={style}
      data-cursor="link"
      {...rest}
    >
      {content}
    </button>
  );
}
