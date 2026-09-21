import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const liens = [
  { to: "/dashboard", label: "Tableau de bord", icone: "grid" },
  { to: "/classes", label: "Classes", icone: "layers" },
  { to: "/etudiants", label: "Étudiants", icone: "users" },
  { to: "/paiements", label: "Paiements", icone: "coins" },
];

const icones = {
  grid: (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
      <rect x="2.5" y="2.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="2.5" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="2.5" y="11" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      <rect x="11" y="11" width="6.5" height="6.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
      <path d="M10 2.5L18 7 10 11.5 2 7 10 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M2 12.5L10 17l8-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M2 9.5L10 14l8-4.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  ),
  users: (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
      <circle cx="7" cy="6.5" r="2.75" stroke="currentColor" strokeWidth="1.4" />
      <path d="M1.8 17c.5-3 2.7-4.7 5.2-4.7s4.7 1.7 5.2 4.7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="14.5" cy="7" r="2.1" stroke="currentColor" strokeWidth="1.4" />
      <path d="M13 12.6c2 .1 3.6 1.5 4.1 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  coins: (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
      <ellipse cx="7" cy="6" rx="4.8" ry="2.7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.2 6v5.2c0 1.5 2.1 2.7 4.8 2.7s4.8-1.2 4.8-2.7V6" stroke="currentColor" strokeWidth="1.4" />
      <path d="M2.2 8.6c0 1.5 2.1 2.7 4.8 2.7s4.8-1.2 4.8-2.7" stroke="currentColor" strokeWidth="1.4" />
      <ellipse cx="13" cy="9.4" rx="4.8" ry="2.7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.2 9.4V14.6c0 1.5 2.1 2.7 4.8 2.7s4.8-1.2 4.8-2.7V9.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.2 12c0 1.5 2.1 2.7 4.8 2.7s4.8-1.2 4.8-2.7" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
};

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col bg-ink text-white">
      <div className="px-6 py-7">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gold text-ink font-display font-semibold">
            É
          </div>
          <div>
            <p className="font-display text-lg leading-none">Institut</p>
            <p className="text-[11px] text-white/50 mt-0.5">Gestion scolaire</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {liens.map((lien) => (
          <NavLink
            key={lien.to}
            to={lien.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {icones[lien.icone]}
            {lien.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-medium">
            {(user?.name || "A")[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-white/50">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-md border border-white/15 px-3 py-2 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
        >
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
