import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import { formatMontant, initiales } from "../utils/format";
import { LIBELLES_STATUT, badgeStatut } from "../utils/statuts";

export default function ClasseDetail() {
  const { id } = useParams();
  const [classe, setClasse] = useState(null);
  const [etudiants, setEtudiants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function charger() {
      setLoading(true);
      const [{ data: c }, { data: e }] = await Promise.all([
        api.get(`/classes/${id}`),
        api.get("/etudiants", { params: { classeId: id } }),
      ]);
      setClasse(c);
      setEtudiants(e);
      setLoading(false);
    }
    charger();
  }, [id]);

  if (loading || !classe) return <p className="text-sm text-muted">Chargement...</p>;

  return (
    <div>
      <Link to="/classes" className="text-sm text-muted hover:text-ink">← Retour aux classes</Link>

      <div className="mt-3 mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">{classe.nom}</h1>
          <p className="mt-1 text-sm text-muted">
            {classe.niveau || "Niveau non précisé"} · {classe.anneeScolaire} · Frais annuel : {formatMontant(classe.fraisScolarite)}
          </p>
        </div>
      </div>

      {etudiants.length === 0 ? (
        <EmptyState title="Aucun élève dans cette classe" message="Inscrivez des étudiants depuis la page Étudiants." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Étudiant</th>
                <th className="table-header">Statut</th>
                <th className="table-header">Matricule</th>
                <th className="table-header">Solde</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {etudiants.map((e) => (
                <tr key={e.id} className="hover:bg-paper/60">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink">
                        {initiales(e.prenom, e.nom)}
                      </div>
                      <span className="font-medium">{e.prenom} {e.nom}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeStatut(e.statutAcademique)}`}>
                      {LIBELLES_STATUT[e.statutAcademique] || "Nouveau"}
                    </span>
                  </td>
                  <td className="table-cell text-muted">{e.matricule}</td>
                  <td className="table-cell">
                    <span className={e.solde > 0 ? "font-medium text-brick" : "font-medium text-forest"}>
                      {e.solde > 0 ? formatMontant(e.solde) + " dû" : "Soldé"}
                    </span>
                  </td>
                  <td className="table-cell text-right">
                    <Link to={`/etudiants/${e.id}`} className="text-sm text-ink underline decoration-line underline-offset-4 hover:text-ink-light">
                      Détails
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
