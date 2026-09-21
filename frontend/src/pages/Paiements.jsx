import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import EmptyState from "../components/EmptyState";
import { formatMontant, formatDate, initiales } from "../utils/format";

const libellesMethode = {
  especes: "Espèces",
  cheque: "Chèque",
  virement: "Virement",
  autre: "Autre",
};

export default function Paiements() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/paiements").then(({ data }) => {
      setPaiements(data);
      setLoading(false);
    });
  }, []);

  const total = paiements.reduce((acc, p) => acc + parseFloat(p.montant), 0);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Paiements</h1>
          <p className="mt-1 text-sm text-muted">Journal de tous les paiements de scolarité</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">Total encaissé</p>
          <p className="font-display text-2xl text-forest">{formatMontant(total)}</p>
        </div>
      </div>

      {!loading && paiements.length === 0 && (
        <EmptyState
          title="Aucun paiement enregistré"
          message="Les paiements apparaîtront ici dès qu'ils seront enregistrés depuis la fiche d'un étudiant."
        />
      )}

      {paiements.length > 0 && (
        <div className="card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">Étudiant</th>
                <th className="table-header">Classe</th>
                <th className="table-header">Date</th>
                <th className="table-header">Méthode</th>
                <th className="table-header">Montant</th>
              </tr>
            </thead>
            <tbody>
              {paiements.map((p) => (
                <tr key={p.id} className="hover:bg-paper/60">
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-medium text-ink">
                        {initiales(p.Etudiant?.prenom, p.Etudiant?.nom)}
                      </div>
                      <Link to={`/etudiants/${p.Etudiant?.id}`} className="font-medium hover:underline">
                        {p.Etudiant?.prenom} {p.Etudiant?.nom}
                      </Link>
                    </div>
                  </td>
                  <td className="table-cell text-muted">{p.Etudiant?.Classe?.nom || "—"}</td>
                  <td className="table-cell text-muted">{formatDate(p.datePaiement)}</td>
                  <td className="table-cell text-muted">{libellesMethode[p.methode] || p.methode}</td>
                  <td className="table-cell font-medium text-forest">{formatMontant(p.montant)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
