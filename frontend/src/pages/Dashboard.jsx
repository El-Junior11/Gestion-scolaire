import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import StatCard from "../components/StatCard";
import { formatMontant, formatDate, initiales } from "../utils/format";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COULEURS_SEXE = { "Féminin": "#C9A227", "Masculin": "#1B2A4A", "Non renseigné": "#E4E1D6" };

// Infobulle réutilisable pour les graphiques : "formatter" détermine
// comment afficher la valeur (nombre d'étudiants ou montant en Ariary).
function InfobulleGraphique({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-lg border border-line bg-surface p-3 shadow-xl">
      <p className="text-xs font-semibold text-ink">{label}</p>
      <p className="mt-1 text-sm font-medium text-gold">{formatter(payload[0].value)}</p>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/stats").then(({ data }) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="animate-pulse text-sm font-medium text-muted">Chargement des données...</p>
      </div>
    );
  }

  const tauxRecouvrement = stats.totalDu > 0
    ? Math.round((stats.totalEncaisse / stats.totalDu) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-ink">Tableau de bord</h1>
        <p className="mt-1 text-sm text-muted">Vue d'ensemble et statistiques de l'année scolaire</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard label="Étudiants actifs" value={stats.totalEtudiants} />
        <StatCard label="Classes" value={stats.totalClasses} />
        <StatCard
          label="Frais encaissés"
          value={formatMontant(stats.totalEncaisse)}
          sub={`${tauxRecouvrement}% du montant dû`}
          accent="text-forest"
        />
        <StatCard
          label="Solde restant dû"
          value={formatMontant(stats.soldeGlobal)}
          sub={stats.soldeGlobal > 0 ? "à recouvrer" : "tout est réglé"}
          accent={stats.soldeGlobal > 0 ? "text-brick" : "text-forest"}
        />
        <StatCard
          label="Mensualités en retard"
          value={stats.totalRetards}
          sub={stats.totalRetards > 0 ? "échéance dépassée (10 du mois)" : "aucun retard"}
          accent={stats.totalRetards > 0 ? "text-brick" : "text-forest"}
        />
      </div>

      {/* Répartition des étudiants par classe */}
      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className="font-display text-lg text-ink">Répartition des étudiants par classe</h2>
            <p className="text-xs text-muted">Effectif actif réparti par classe</p>
          </div>
          <span className="rounded-full bg-paper px-3 py-1 text-xs font-medium text-muted">
            {stats.totalClasses} classe{stats.totalClasses > 1 ? "s" : ""}
          </span>
        </div>

        <div className="mt-5 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.repartitionParClasse} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E1D6" vertical={false} />
              <XAxis dataKey="classe" tick={{ fontSize: 12, fill: "#6F6B5E" }} axisLine={false} tickLine={false} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6F6B5E" }} axisLine={false} tickLine={false} />
              <Tooltip
                content={<InfobulleGraphique formatter={(v) => `${v} étudiant${v > 1 ? "s" : ""}`} />}
                cursor={{ fill: "#F7F6F1" }}
              />
              <Bar dataKey="nombre" fill="#1B2A4A" radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Répartition par âge + taux M/F */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="border-b border-line pb-4">
            <h2 className="font-display text-lg text-ink">Répartition par âge</h2>
            <p className="text-xs text-muted">Étudiants actifs, calculée à partir de la date de naissance</p>
          </div>

          {!stats.repartitionParAge || stats.repartitionParAge.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">
              Aucune date de naissance renseignée pour le moment.
            </p>
          ) : (
            <div className="mt-5 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.repartitionParAge}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E1D6" />
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    type="category"
                    dataKey="age"
                    tick={{ fontSize: 12, fill: "#6F6B5E" }}
                    axisLine={false}
                    tickLine={false}
                    width={56}
                  />
                  <Tooltip
                    content={<InfobulleGraphique formatter={(v) => `${v} étudiant${v > 1 ? "s" : ""}`} />}
                    cursor={{ fill: "#F7F6F1" }}
                  />
                  <Bar dataKey="nombre" fill="#2F6B4F" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card p-6">
          <div className="border-b border-line pb-4">
            <h2 className="font-display text-lg text-ink">Répartition Masculin / Féminin</h2>
            <p className="text-xs text-muted">Taux par sexe parmi les étudiants actifs</p>
          </div>

          {!stats.repartitionParSexe || stats.repartitionParSexe.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">Aucune donnée de sexe renseignée pour le moment.</p>
          ) : (
            <div className="mt-2 flex flex-col items-center sm:flex-row sm:gap-4">
              <div className="relative h-56 w-full max-w-[220px] shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.repartitionParSexe}
                      dataKey="nombre"
                      nameKey="sexe"
                      innerRadius="65%"
                      outerRadius="100%"
                      paddingAngle={3}
                      stroke="none"
                    >
                      {stats.repartitionParSexe.map((entry) => (
                        <Cell key={entry.sexe} fill={COULEURS_SEXE[entry.sexe] || "#6F6B5E"} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<InfobulleGraphique formatter={(v) => `${v} étudiant${v > 1 ? "s" : ""}`} />}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <p className="font-display text-2xl text-ink">{stats.totalEtudiants}</p>
                  <p className="text-[11px] text-muted">étudiants</p>
                </div>
              </div>

              <div className="mt-4 flex w-full flex-col gap-2.5 sm:mt-0">
                {stats.repartitionParSexe.map((s) => {
                  const pourcentage = stats.totalEtudiants > 0 ? Math.round((s.nombre / stats.totalEtudiants) * 100) : 0;
                  return (
                    <div key={s.sexe} className="flex items-center gap-2.5">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: COULEURS_SEXE[s.sexe] || "#6F6B5E" }}
                      />
                      <span className="flex-1 text-sm text-ink">{s.sexe}</span>
                      <span className="text-sm font-medium text-ink">{pourcentage}%</span>
                      <span className="w-14 text-right text-xs text-muted">({s.nombre})</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Frais par méthode + derniers paiements */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="border-b border-line pb-4">
            <h2 className="font-display text-lg text-ink">Frais encaissés par méthode</h2>
            <p className="text-xs text-muted">Montants réellement enregistrés, par mode de paiement</p>
          </div>

          {!stats.repartitionParMethode || stats.repartitionParMethode.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">Aucun paiement enregistré pour le moment.</p>
          ) : (
            <div className="mt-5 h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={stats.repartitionParMethode}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E4E1D6" />
                  <XAxis type="number" allowDecimals={false} hide />
                  <YAxis
                    type="category"
                    dataKey="methode"
                    tick={{ fontSize: 12, fill: "#6F6B5E" }}
                    axisLine={false}
                    tickLine={false}
                    width={70}
                  />
                  <Tooltip content={<InfobulleGraphique formatter={(v) => formatMontant(v)} />} cursor={{ fill: "#F7F6F1" }} />
                  <Bar dataKey="total" fill="#C9A227" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="card flex flex-col p-6">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="font-display text-lg text-ink">Derniers paiements</h2>
            <Link to="/paiements" className="text-xs font-medium text-ink underline decoration-line underline-offset-4 hover:text-ink-light">
              Tout voir
            </Link>
          </div>
          <div className="mt-4 flex-1 space-y-3.5">
            {stats.derniersPaiements.length === 0 && (
              <p className="py-8 text-center text-sm text-muted">Aucun paiement enregistré pour le moment.</p>
            )}
            {stats.derniersPaiements.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink">
                  {initiales(p.Etudiant?.prenom, p.Etudiant?.nom)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">
                    {p.Etudiant?.prenom} {p.Etudiant?.nom}
                  </p>
                  <p className="text-xs text-muted">
                    {p.Etudiant?.Classe?.nom} · {formatDate(p.datePaiement)}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-medium text-forest">+{formatMontant(p.montant)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Retards de paiement */}
      <div className="card p-6">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <h2 className={`font-display text-lg ${stats.totalRetards > 0 ? "text-brick" : "text-ink"}`}>
              Alertes de retard
            </h2>
            <p className="text-xs text-muted">Mensualités dont l'échéance (le 10 du mois) est dépassée</p>
          </div>
          {stats.totalRetards > 0 && (
            <span className="rounded-full bg-brick/10 px-3 py-1 text-xs font-medium text-brick">
              {stats.totalRetards} mensualité{stats.totalRetards > 1 ? "s" : ""} en retard
            </span>
          )}
        </div>

        {stats.totalRetards === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-forest/10 text-forest">
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-sm font-medium text-ink">Aucun retard détecté</p>
            <p className="text-xs text-muted">Tous les étudiants sont à jour de leurs paiements.</p>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {stats.retards.map((r, i) => (
              <Link
                key={`${r.etudiantId}-${i}`}
                to={`/etudiants/${r.etudiantId}`}
                className="flex items-center justify-between rounded-md border border-brick/20 bg-brick/5 p-4 transition-colors hover:bg-brick/10"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{r.prenom} {r.nom}</p>
                  <p className="text-xs text-muted">{r.classe}</p>
                </div>
                <span className="rounded-full bg-brick/10 px-2.5 py-1 text-xs font-medium text-brick">
                  {r.mois}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}