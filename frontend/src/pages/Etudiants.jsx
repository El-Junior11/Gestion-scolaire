import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../api/axios";
import Modal from "../components/Modal";
import EmptyState from "../components/EmptyState";
import { formatMontant, initiales } from "../utils/format";
import { LIBELLES_STATUT, badgeStatut } from "../utils/statuts";

const vide = {
  matricule: "",
  nom: "",
  prenom: "",
  classeId: "",
  dateNaissance: "",
  sexe: "",
  nomTuteur: "",
  telephoneTuteur: "",
  adresse: "",
  statutAcademique: "nouveau",
};

// Tooltip custom épuré
const Tooltip = ({ children }) => (
  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-2 py-1 rounded-md text-[11px] font-semibold opacity-0 scale-95 group-hover/btn:opacity-100 group-hover/btn:scale-100 transition-all duration-150 z-20 bg-surface text-ink border border-line shadow-md">
    {children}
  </span>
);

export default function Etudiants() {
  const [etudiants, setEtudiants] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [classeFiltre, setClasseFiltre] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState(vide);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  async function charger() {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (classeFiltre) params.classeId = classeFiltre;
    try {
      const [{ data: e }, { data: c }] = await Promise.all([
        api.get("/etudiants", { params }),
        api.get("/classes"),
      ]);
      setEtudiants(e);
      setClasses(c);
    } catch (err) {
      console.error("Erreur lors du chargement :", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(charger, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, classeFiltre]);

  function ouvrirCreation() {
    setEditingId(null);
    setForm({ ...vide, classeId: classes[0]?.id || "" });
    setError("");
    setModalOpen(true);
  }

  function ouvrirEdition(e) {
    setEditingId(e.id);
    setForm({
      matricule: e.matricule || "",
      nom: e.nom || "",
      prenom: e.prenom || "",
      classeId: e.classeId || e.Classe?.id || classes[0]?.id || "",
      dateNaissance: e.dateNaissance ? e.dateNaissance.split("T")[0] : "",
      sexe: e.sexe || "",
      nomTuteur: e.nomTuteur || "",
      telephoneTuteur: e.telephoneTuteur || "",
      adresse: e.adresse || "",
      statutAcademique: e.statutAcademique || "nouveau",
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      ...form,
      dateNaissance: form.dateNaissance || null,
      sexe: form.sexe || null,
      matricule: form.matricule || undefined,
    };

    try {
      if (editingId) {
        await api.put(`/etudiants/${editingId}`, payload);
        Swal.fire({
          icon: "success",
          title: "Modifications enregistrées",
          text: "Les informations de l'étudiant ont été mises à jour.",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        await api.post("/etudiants", payload);
        Swal.fire({
          icon: "success",
          title: "Étudiant inscrit",
          text: "Le nouvel étudiant a été ajouté avec succès.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      setModalOpen(false);
      charger();
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.includes("matricule must be unique") || msg.includes("unique constraint")) {
        setError("Ce matricule est déjà attribué à un autre étudiant.");
      } else {
        setError(msg || "Une erreur est survenue lors de l'enregistrement.");
      }
    }
  }

  function handleDelete(id) {
    Swal.fire({
      title: "Supprimer cet étudiant ?",
      text: "Cette action est définitive et supprimera son historique de paiements.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Oui, supprimer",
      cancelButtonText: "Annuler",
      customClass: {
        popup: "rounded-xl",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/etudiants/${id}`);
          Swal.fire({
            icon: "success",
            title: "Supprimé !",
            text: "L'étudiant a été retiré du système.",
            timer: 2000,
            showConfirmButton: false,
          });
          charger();
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Erreur",
            text: err.response?.data?.message || "Impossible de supprimer cet étudiant.",
          });
        }
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Étudiants</h1>
          <p className="mt-1 text-sm text-muted">Gestion administrative et suivi des élèves</p>
        </div>
        <button className="btn-primary" onClick={ouvrirCreation} disabled={classes.length === 0}>
          + Nouvel étudiant
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          className="input-field sm:max-w-xs"
          placeholder="Rechercher un nom, un matricule..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-field sm:max-w-[200px]"
          value={classeFiltre}
          onChange={(e) => setClasseFiltre(e.target.value)}
        >
          <option value="">Toutes les classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.nom}</option>
          ))}
        </select>
      </div>

      {classes.length === 0 && !loading && (
        <EmptyState
          title="Créez d'abord une classe"
          message="Une classe est nécessaire avant de pouvoir inscrire un étudiant."
          action={<Link to="/classes" className="btn-primary">Aller vers Classes</Link>}
        />
      )}

      {classes.length > 0 && !loading && etudiants.length === 0 && (
        <EmptyState
          title="Aucun étudiant trouvé"
          message="Ajustez votre recherche ou inscrivez un nouvel étudiant."
        />
      )}

      {etudiants.length > 0 && (
        <div className="card overflow-hidden border border-line shadow-sm">
          {/* Hauteur ajustée à max-h-[320px] pour afficher exactement 5 lignes + thead */}
          <div className="max-h-[320px] overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-surface shadow-xs border-b border-line">
                <tr>
                  <th className="table-header">Étudiant</th>
                  <th className="table-header">Classe</th>
                  <th className="table-header">Statut</th>
                  <th className="table-header">Matricule</th>
                  <th className="table-header">Solde</th>
                  <th className="table-header text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {etudiants.map((e) => (
                  <tr key={e.id} className="hover:bg-paper/60 transition-colors group">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/5 text-xs font-semibold text-ink">
                          {initiales(e.prenom, e.nom)}
                        </div>
                        <span className="font-medium text-ink">{e.prenom} {e.nom}</span>
                      </div>
                    </td>
                    <td className="table-cell text-muted">{e.Classe?.nom || "—"}</td>
                    <td className="table-cell">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeStatut(e.statutAcademique)}`}>
                        {LIBELLES_STATUT[e.statutAcademique] || "Nouveau"}
                      </span>
                    </td>
                    <td className="table-cell text-muted font-mono text-xs">{e.matricule}</td>
                    <td className="table-cell">
                      <span className={e.solde > 0 ? "font-semibold text-brick" : "font-semibold text-forest"}>
                        {e.solde > 0 ? formatMontant(e.solde) + " dû" : "Soldé"}
                      </span>
                    </td>
                    <td className="table-cell text-right pr-6">
                      <div className="inline-flex items-center gap-1">
                        {/* Icon - Voir les détails */}
                        <Link
                          to={`/etudiants/${e.id}`}
                          aria-label="Détails"
                          className="relative group/btn rounded-md p-1.5 text-muted transition-colors hover:bg-paper hover:text-ink"
                        >
                          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                            <path
                              d="M10 4.5c-4 0-7.2 3.2-8.5 5.5 1.3 2.3 4.5 5.5 8.5 5.5s7.2-3.2 8.5-5.5c-1.3-2.3-4.5-5.5-8.5-5.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                          </svg>
                          <Tooltip>Détails</Tooltip>
                        </Link>

                        {/* Icon - Modifier */}
                        <button
                          onClick={() => ouvrirEdition(e)}
                          aria-label="Modifier"
                          className="relative group/btn rounded-md p-1.5 text-muted transition-colors hover:bg-paper hover:text-ink"
                        >
                          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                            <path
                              d="M13.5 3.5l3 3M4 16l3.5-.8L16.2 6.5a1.5 1.5 0 000-2.1l-1.6-1.6a1.5 1.5 0 00-2.1 0L3.8 11.5 3 15l1 1z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <Tooltip>Modifier</Tooltip>
                        </button>

                        {/* Icon - Supprimer */}
                        <button
                          onClick={() => handleDelete(e.id)}
                          aria-label="Supprimer"
                          className="relative group/btn rounded-md p-1.5 text-brick/80 transition-colors hover:bg-brick/10 hover:text-brick"
                        >
                          <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
                            <path
                              d="M3.5 5.5h13M8.5 8.5v5M11.5 8.5v5M4.5 5.5l.8 10a1.5 1.5 0 001.5 1.4h6.4a1.5 1.5 0 001.5-1.4l.8-10M7.5 5.5v-2a1 1 0 011-1h3a1 1 0 011 1v2"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <Tooltip>Supprimer</Tooltip>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modale Formulaire Condensé */}
      <Modal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={editingId ? "Modifier l'étudiant" : "Inscrire un nouvel étudiant"} 
        wide
      >
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Prénom *</label>
              <input className="input-field" value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} required />
            </div>
            <div>
              <label className="label-field">Nom *</label>
              <input className="input-field" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Classe *</label>
              <select className="input-field" value={form.classeId} onChange={(e) => setForm({ ...form, classeId: e.target.value })} required>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-field">Statut académique</label>
              <select className="input-field" value={form.statutAcademique} onChange={(e) => setForm({ ...form, statutAcademique: e.target.value })}>
                <option value="nouveau">Nouveau</option>
                <option value="passant">Passant</option>
                <option value="redoublant">Redoublant</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Matricule (optionnel)</label>
              <input 
                className="input-field" 
                placeholder="Auto-généré si vide" 
                value={form.matricule} 
                onChange={(e) => setForm({ ...form, matricule: e.target.value })} 
              />
            </div>
            <div>
              <label className="label-field">Sexe</label>
              <select className="input-field" value={form.sexe} onChange={(e) => setForm({ ...form, sexe: e.target.value })}>
                <option value="">Non spécifié</option>
                <option value="F">Féminin</option>
                <option value="M">Masculin</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Date de naissance</label>
              <input type="date" className="input-field" value={form.dateNaissance} onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Téléphone du tuteur</label>
              <input className="input-field" value={form.telephoneTuteur} onChange={(e) => setForm({ ...form, telephoneTuteur: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label-field">Nom du tuteur / parent</label>
              <input className="input-field" value={form.nomTuteur} onChange={(e) => setForm({ ...form, nomTuteur: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Adresse</label>
              <input className="input-field" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} />
            </div>
          </div>

          {error && <p className="rounded-md bg-brick/10 p-2 text-sm text-brick">{error}</p>}

          <div className="flex justify-end gap-3 pt-3">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? "Enregistrer les modifications" : "Inscrire l'étudiant"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}