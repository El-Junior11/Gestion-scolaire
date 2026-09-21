import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import { formatMontant } from "../utils/format";

const vide = { nom: "", niveau: "", anneeScolaire: "2026-2027", fraisScolarite: "" };

// Tooltip custom épuré
const Tooltip = ({ children }) => (
  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap px-2 py-1 rounded-md text-[11px] font-semibold opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-150 z-20 bg-surface text-ink border border-line shadow-md">
    {children}
  </span>
);

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(vide);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);

  async function charger() {
    setLoading(true);
    try {
      const { data } = await api.get("/classes");
      setClasses(data);
    } catch (err) {
      setError("Impossible de charger les classes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    charger();
  }, []);

  function ouvrirCreation() {
    setForm(vide);
    setEditingId(null);
    setError("");
    setModalOpen(true);
  }

  function ouvrirEdition(classe) {
    setForm({
      nom: classe.nom,
      niveau: classe.niveau || "",
      anneeScolaire: classe.anneeScolaire,
      fraisScolarite: classe.fraisScolarite,
    });
    setEditingId(classe.id);
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/classes/${editingId}`, form);
      } else {
        await api.post("/classes", form);
      }
      setModalOpen(false);
      charger();
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    }
  }

  async function confirmerSuppression() {
    try {
      await api.delete(`/classes/${toDelete.id}`);
      setToDelete(null);
      charger();
    } catch (err) {
      setError(err.response?.data?.message || "Suppression impossible.");
      setToDelete(null);
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-ink">Classes</h1>
          <p className="mt-1 text-sm text-muted">Niveaux et frais de scolarité par classe</p>
        </div>
        <button className="btn-primary" onClick={ouvrirCreation}>
          + Nouvelle classe
        </button>
      </div>

      {error && !modalOpen && (
        <p className="mb-4 rounded-md bg-brick/10 px-3 py-2 text-sm text-brick">{error}</p>
      )}

      {!loading && classes.length === 0 && (
        <EmptyState
          title="Aucune classe pour l'instant"
          message="Créez votre première classe pour commencer à y inscrire des étudiants."
          action={<button className="btn-primary" onClick={ouvrirCreation}>Créer une classe</button>}
        />
      )}

      {classes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {classes.map((c) => (
            <div key={c.id} className="card p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-display text-lg text-ink">{c.nom}</p>
                    <p className="text-xs text-muted">{c.niveau || "Niveau non précisé"} · {c.anneeScolaire}</p>
                  </div>
                  <span className="rounded-full bg-ink/5 px-2.5 py-1 text-xs font-medium text-ink">
                    {c.nombreEtudiants} élève{c.nombreEtudiants > 1 ? "s" : ""}
                  </span>
                </div>

                <p className="mt-4 text-sm text-muted">Frais de scolarité annuel</p>
                <p className="font-display text-xl text-ink">{formatMontant(c.fraisScolarite)}</p>
              </div>

              {/* Boutons d'action sous forme d'icônes modernes */}
              <div className="mt-5 flex items-center justify-end gap-1.5 pt-3 border-t border-line/50">
                {/* Voir les élèves */}
                <Link
                  to={`/classes/${c.id}`}
                  className="relative group rounded-md p-2 text-muted transition-colors hover:bg-paper hover:text-ink"
                  aria-label="Voir les élèves"
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
                  <Tooltip>Voir les élèves</Tooltip>
                </Link>

                {/* Modifier la classe */}
                <button
                  onClick={() => ouvrirEdition(c)}
                  className="relative group rounded-md p-2 text-muted transition-colors hover:bg-paper hover:text-ink"
                  aria-label="Modifier la classe"
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

                {/* Supprimer la classe */}
                <button
                  onClick={() => setToDelete(c)}
                  className="relative group rounded-md p-2 text-brick/80 transition-colors hover:bg-brick/10 hover:text-brick"
                  aria-label="Supprimer la classe"
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
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Modifier la classe" : "Nouvelle classe"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Nom de la classe</label>
            <input
              className="input-field"
              placeholder="ex. 6ème A"
              value={form.nom}
              onChange={(e) => setForm({ ...form, nom: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label-field">Niveau</label>
            <input
              className="input-field"
              placeholder="ex. Collège"
              value={form.niveau}
              onChange={(e) => setForm({ ...form, niveau: e.target.value })}
            />
          </div>
          <div>
            <label className="label-field">Année scolaire</label>
            <input
              className="input-field"
              value={form.anneeScolaire}
              onChange={(e) => setForm({ ...form, anneeScolaire: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="label-field">Frais de scolarité annuel (Ar)</label>
            <input
              type="number"
              min="0"
              step="1000"
              className="input-field"
              value={form.fraisScolarite}
              onChange={(e) => setForm({ ...form, fraisScolarite: e.target.value })}
              required
            />
          </div>

          {error && <p className="text-sm text-brick">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              {editingId ? "Enregistrer" : "Créer la classe"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Supprimer cette classe ?"
        message={`Cette action supprimera définitivement "${toDelete?.nom}". Cette opération est impossible si des étudiants y sont inscrits.`}
        onConfirm={confirmerSuppression}
        onCancel={() => setToDelete(null)}
        danger
      />
    </div>
  );
}