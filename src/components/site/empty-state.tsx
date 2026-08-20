export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p className="muted">{description}</p>
    </div>
  );
}
