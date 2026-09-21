import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function IconTitre({ children, icone }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink/5 text-ink">
        {icone}
      </div>
      <h2 className="font-display text-lg text-ink">{children}</h2>
    </div>
  );
}

const icones = {
  profil: (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 17c.7-3.4 3-5.3 6.5-5.3s5.8 1.9 6.5 5.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  mdp: (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
      <rect x="4" y="9" width="12" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6.5 9V6.5a3.5 3.5 0 017 0V9" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="13" r="1.1" fill="currentColor" />
    </svg>
  ),
  apparence: (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 3a7 7 0 000 14V3Z" fill="currentColor" />
    </svg>
  ),
  session: (
    <svg viewBox="0 0 20 20" fill="none" className="h-[18px] w-[18px]">
      <path d="M8 3.5H5a1.5 1.5 0 00-1.5 1.5v10A1.5 1.5 0 005 16.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12.5 13.5L16.5 10l-4-3.5M16.5 10H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

export default function Parametres() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [profil, setProfil] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profilMsg, setProfilMsg] = useState(null);
  const [profilErr, setProfilErr] = useState("");

  const [motDePasse, setMotDePasse] = useState({ currentPassword: "", newPassword: "", confirmation: "" });
  const [mdpMsg, setMdpMsg] = useState(null);
  const [mdpErr, setMdpErr] = useState("");

  async function enregistrerProfil(e) {
    e.preventDefault();
    setProfilErr("");
    setProfilMsg(null);
    try {
      const { data } = await api.put("/auth/me", profil);
      localStorage.setItem("user", JSON.stringify(data.user));
      setProfilMsg("Informations mises à jour. Reconnectez-vous pour les voir partout dans l'application.");
    } catch (err) {
      setProfilErr(err.response?.data?.message || "Une erreur est survenue.");
    }
  }

  async function changerMotDePasse(e) {
    e.preventDefault();
    setMdpErr("");
    setMdpMsg(null);
    if (motDePasse.newPassword !== motDePasse.confirmation) {
      setMdpErr("Les deux mots de passe ne correspondent pas.");
      return;
    }
    try {
      await api.put("/auth/password", {
        currentPassword: motDePasse.currentPassword,
        newPassword: motDePasse.newPassword,
      });
      setMdpMsg("Mot de passe mis à jour avec succès.");
      setMotDePasse({ currentPassword: "", newPassword: "", confirmation: "" });
    } catch (err) {
      setMdpErr(err.response?.data?.message || "Une erreur est survenue.");
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Paramètres du compte</h1>
        <p className="mt-1 text-sm text-muted">Gérez vos informations et les préférences de l'application</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <IconTitre icone={icones.profil}>Informations personnelles</IconTitre>
          <form onSubmit={enregistrerProfil} className="mt-5 space-y-4">
            <div>
              <label className="label-field">Nom complet</label>
              <input
                className="input-field"
                value={profil.name}
                onChange={(e) => setProfil({ ...profil, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="label-field">Adresse email</label>
              <input
                type="email"
                className="input-field"
                value={profil.email}
                onChange={(e) => setProfil({ ...profil, email: e.target.value })}
                required
              />
            </div>
            {profilErr && <p className="text-sm text-brick">{profilErr}</p>}
            {profilMsg && <p className="text-sm text-forest">{profilMsg}</p>}
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Enregistrer</button>
            </div>
          </form>
        </div>

        <div className="card p-6">
          <IconTitre icone={icones.mdp}>Mot de passe</IconTitre>
          <form onSubmit={changerMotDePasse} className="mt-5 space-y-4">
            <div>
              <label className="label-field">Mot de passe actuel</label>
              <input
                type="password"
                className="input-field"
                value={motDePasse.currentPassword}
                onChange={(e) => setMotDePasse({ ...motDePasse, currentPassword: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label-field">Nouveau</label>
                <input
                  type="password"
                  className="input-field"
                  value={motDePasse.newPassword}
                  onChange={(e) => setMotDePasse({ ...motDePasse, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="label-field">Confirmation</label>
                <input
                  type="password"
                  className="input-field"
                  value={motDePasse.confirmation}
                  onChange={(e) => setMotDePasse({ ...motDePasse, confirmation: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            </div>
            {mdpErr && <p className="text-sm text-brick">{mdpErr}</p>}
            {mdpMsg && <p className="text-sm text-forest">{mdpMsg}</p>}
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Mettre à jour</button>
            </div>
          </form>
        </div>

        <div className="card p-6">
          <IconTitre icone={icones.apparence}>Apparence</IconTitre>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">Mode sombre</p>
              <p className="text-xs text-muted">Bascule l'apparence de l'espace administration</p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${isDark ? "bg-ink" : "bg-line"}`}
              aria-label="Basculer le mode sombre"
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${isDark ? "translate-x-5" : "translate-x-0.5"}`}
              />
            </button>
          </div>
        </div>

        <div className="card p-6">
          <IconTitre icone={icones.session}>Session</IconTitre>
          <p className="mt-5 text-sm text-muted">Connecté en tant que <span className="text-ink font-medium">{user?.email}</span></p>
          <button onClick={logout} className="btn-secondary mt-4">Se déconnecter</button>
        </div>
      </div>
    </div>
  );
}