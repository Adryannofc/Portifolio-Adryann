interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="admin-coming-soon">
      <div className="admin-coming-soon-icon">◻</div>
      <h2 className="admin-coming-soon-title">{title}</h2>
      <p className="admin-coming-soon-desc">
        {description ?? 'Este módulo está em desenvolvimento e estará disponível em breve.'}
      </p>
    </div>
  );
}
