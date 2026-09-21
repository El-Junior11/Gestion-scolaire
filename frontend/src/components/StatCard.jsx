export default function StatCard({ label, value, sub, accent }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl text-ink">{value}</p>
      {sub && <p className={`mt-1.5 text-xs ${accent || "text-muted"}`}>{sub}</p>}
    </div>
  );
}
