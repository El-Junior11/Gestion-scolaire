export default function EmptyState({ title, message, action }) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-14 text-center">
      <p className="font-display text-lg text-ink">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
