import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useTheme } from "../context/ThemeContext";
import { formatDate } from "../utils/format";

const titres = {
  "/dashboard": "Tableau de bord",
  "/classes": "Classes",
  "/etudiants": "Étudiants",
  "/paiements": "Paiements",
  "/aide": "Aide & Documentation",
  "/parametres": "Paramètres du compte",
};

function titrePour(pathname) {
  if (titres[pathname]) return titres[pathname];
  if (pathname.startsWith("/classes/")) return "Détail de la classe";
  if (pathname.startsWith("/etudiants/")) return "Fiche étudiant";
  return "Institut";
}

// Tooltip custom tahaka ilay tamin'ny modely
const Tooltip = ({ children }) => (
  <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap px-2.5 py-1 rounded-lg text-[11px] font-semibold opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-50 bg-surface text-ink border border-line shadow-md">
    {children}
  </span>
);

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [notifOuvert, setNotifOuvert] = useState(false);
  const [retards, setRetards] = useState({ total: 0, retards: [] });
  const ref = useRef(null);

  // Gestion de l'horloge analogique
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourDegrees = ((hours % 12) * 30) + (minutes * 0.5);
  const minuteDegrees = (minutes * 6) + (seconds * 0.1);
  const secondDegrees = seconds * 6;

  useEffect(() => {
    api.get("/dashboard/retards").then(({ data }) => setRetards(data)).catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    function fermerSiExterieur(e) {
      if (ref.current && !ref.current.contains(e.target)) setNotifOuvert(false);
    }
    document.addEventListener("mousedown", fermerSiExterieur);
    return () => document.removeEventListener("mousedown", fermerSiExterieur);
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-line bg-surface px-8">
      <h2 className="font-display text-lg text-ink">{titrePour(location.pathname)}</h2>

      <div className="flex items-center gap-2">
        {/* Horloge Analogique avy amin'ny modely */}
        <div className="relative group w-[24px] h-[24px] rounded-full border-2 border-line mr-1.5 hidden sm:flex items-center justify-center bg-paper shadow-inner">
          <div
            className="absolute bottom-1/2 left-1/2 w-0.5 h-1.5 bg-ink origin-bottom rounded-full"
            style={{ transform: `translateX(-50%) rotate(${hourDegrees}deg)` }}
          />
          <div
            className="absolute bottom-1/2 left-1/2 w-0.5 h-2 bg-emerald-500 origin-bottom rounded-full"
            style={{ transform: `translateX(-50%) rotate(${minuteDegrees}deg)` }}
          />
          <div
            className="absolute bottom-1/2 left-1/2 w-[1px] h-2 bg-sky-400 origin-bottom"
            style={{ transform: `translateX(-50%) rotate(${secondDegrees}deg)` }}
          />
          <div className="absolute w-1 h-1 bg-ink rounded-full"></div>
          <Tooltip>{`Heure : ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`}</Tooltip>
        </div>

        {/* Bouton Mode Sombre / Clair */}
        <button
          onClick={toggleTheme}
          className="relative group rounded-md p-2 text-muted transition-colors hover:bg-paper hover:text-ink"
          aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
        >
          {isDark ? (
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 1.5v2M10 16.5v2M18.5 10h-2M3.5 10h-2M15.6 4.4l-1.4 1.4M5.8 14.2l-1.4 1.4M15.6 15.6l-1.4-1.4M5.8 5.8L4.4 4.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          ) : (
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="M17 11.3A7 7 0 018.7 3a7 7 0 108.3 8.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          )}
          <Tooltip>{isDark ? "Mode clair" : "Mode sombre"}</Tooltip>
        </button>

        {/* Lien Aide */}
        <Link
          to="/aide"
          className="relative group rounded-md p-2 text-muted transition-colors hover:bg-paper hover:text-ink"
          aria-label="Aide"
        >
          <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
            <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M7.8 7.6a2.2 2.2 0 114 1.3c-.5.6-1.8.9-1.8 2.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="14.2" r="0.9" fill="currentColor" />
          </svg>
          <Tooltip>Aide & documentation</Tooltip>
        </Link>

        {/* Icône Paramètres miaraka amin'ny animation rotate amin'ny modely */}
        <Link
          to="/parametres"
          className="relative group rounded-md p-2 text-muted transition-colors hover:bg-paper hover:text-ink"
          aria-label="Paramètres du compte"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 transition-transform duration-300 group-hover:rotate-90"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <Tooltip>Paramètres du compte</Tooltip>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={ref}>
          <button
            onClick={() => setNotifOuvert((o) => !o)}
            className="relative rounded-md p-2 text-muted transition-colors hover:bg-paper hover:text-ink"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
              <path d="M5 8.2a5 5 0 0110 0c0 3.3 1.1 4.3 1.1 4.3H3.9S5 11.5 5 8.2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8.2 15.2a1.9 1.9 0 003.6 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {retards.total > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-brick px-1 text-[10px] font-semibold text-white">
                {retards.total > 9 ? "9+" : retards.total}
              </span>
            )}
          </button>

          {notifOuvert && (
            <div className="absolute right-0 z-20 mt-2 w-80 rounded-lg border border-line bg-surface shadow-xl">
              <div className="border-b border-line px-4 py-3">
                <p className="text-sm font-medium text-ink">Notifications</p>
                <p className="text-xs text-muted">Paiements de scolarité en retard</p>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {retards.retards.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted">Aucun retard de paiement 🎉</p>
                ) : (
                  retards.retards.map((r, i) => (
                    <button
                      key={`${r.etudiantId}-${i}`}
                      onClick={() => {
                        setNotifOuvert(false);
                        navigate(`/etudiants/${r.etudiantId}`);
                      }}
                      className="flex w-full flex-col items-start gap-0.5 border-b border-line/70 px-4 py-2.5 text-left last:border-0 hover:bg-paper"
                    >
                      <p className="text-sm font-medium text-ink">{r.prenom} {r.nom}</p>
                      <p className="text-xs text-brick">{r.classe} · {r.mois} en retard (échéance {formatDate(r.dateLimite)})</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}