import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import Modal from "../components/Modal";
import { formatMontant, formatDate, initiales } from "../utils/format";
import { LIBELLES_STATUT, badgeStatut } from "../utils/statuts";

const paiementVide = { montant: "", datePaiement: "", methode: "especes", reference: "", note: "", moisCle: "" };

export default function EtudiantDetail() {
  const { id } = useParams();
  const [etudiant, setEtudiant] = useState(null);
  const [mensualites, setMensualites] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(paiementVide);
  const [error, setError] = useState("");

  const [promotionOpen, setPromotionOpen] = useState(false);
  const [promotionForm, setPromotionForm] = useState({ classeId: "", statutAcademique: "passant" });
  const [promotionErr, setPromotionErr] = useState("");

  async function charger() {
    const [{ data: e }, { data: m }] = await Promise.all([
      api.get(`/etudiants/${id}`),
      api.get(`/etudiants/${id}/mensualites`),
    ]);
    setEtudiant(e);
    setMensualites(m);
    setLoading(false);
  }

  useEffect(() => {
    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  function ouvrirPaiement() {
    const prochainMoisImpaye = mensualites?.mensualites.find((m) => !m.paye);
    setForm({
      ...paiementVide,
      moisCle: prochainMoisImpaye ? `${prochainMoisImpaye.mois}-${prochainMoisImpaye.annee}` : "",
    });
    setError("");
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const [mois, anneeMois] = form.moisCle ? form.moisCle.split("-").map(Number) : [null, null];
      const { moisCle, ...reste } = form;
      await api.post("/paiements", { ...reste, mois, anneeMois, etudiantId: id });
      setModalOpen(false);
      charger();
    } catch (err) {
      setError(err.response?.data?.message || "Une erreur est survenue.");
    }
  }

  async function supprimerPaiement(paiementId) {
    if (!window.confirm("Supprimer ce paiement ?")) return;
    await api.delete(`/paiements/${paiementId}`);
    charger();
  }

  async function ouvrirPromotion() {
    setPromotionErr("");
    setPromotionForm({ classeId: "", statutAcademique: "passant" });
    if (classes.length === 0) {
      const { data } = await api.get("/classes");
      setClasses(data);
    }
    setPromotionOpen(true);
  }

  async function handlePromotion(e) {
    e.preventDefault();
    setPromotionErr("");
    try {
      await api.put(`/etudiants/${id}/promouvoir`, promotionForm);
      setPromotionOpen(false);
      charger();
    } catch (err) {
      setPromotionErr(err.response?.data?.message || "Une erreur est survenue.");
    }
  }

  if (loading || !etudiant) return <p className="text-sm text-muted">Chargement...</p>;

  return (
    <div>
      <Link to="/etudiants" className="text-sm text-muted hover:text-ink">← Retour aux étudiants</Link>

      <div className="mt-3 mb-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-lg font-medium text-white">
            {initiales(etudiant.prenom, etudiant.nom)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="font-display text-2xl text-ink">{etudiant.prenom} {etudiant.nom}</h1>
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${badgeStatut(etudiant.statutAcademique)}`}>
                {LIBELLES_STATUT[etudiant.statutAcademique] || "Nouveau"}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted">
              {etudiant.matricule} · {etudiant.Classe?.nom}
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button className="btn-secondary" onClick={ouvrirPromotion}>Faire passer en classe suivante</button>
          <button className="btn-primary" onClick={ouvrirPaiement}>+ Enregistrer un paiement</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-sm text-muted">Frais de scolarité annuel</p>
          <p className="mt-1.5 font-display text-2xl text-ink">{formatMontant(etudiant.Classe?.fraisScolarite)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted">Total payé</p>
          <p className="mt-1.5 font-display text-2xl text-forest">{formatMontant(etudiant.totalPaye)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-muted">Solde restant</p>
          <p className={`mt-1.5 font-display text-2xl ${etudiant.solde > 0 ? "text-brick" : "text-forest"}`}>
            {formatMontant(etudiant.solde)}
          </p>
        </div>
      </div>

      {mensualites && (
        <div className="card mt-6 p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg text-ink">Mensualités de l'année scolaire</h2>
            <p className="text-xs text-muted">Échéance : le 10 de chaque mois · {formatMontant(mensualites.fraisMensuel)} / mois</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {mensualites.mensualites.map((m) => (
              <div
                key={`${m.mois}-${m.annee}`}
                className={`rounded-md border p-3 ${
                  m.paye
                    ? "border-forest/20 bg-forest/5"
                    : m.enRetard
                    ? "border-brick/30 bg-brick/5"
                    : "border-line bg-paper/40"
                }`}
              >
                <p className="text-sm font-medium text-ink">{m.libelle}</p>
                <p className="mt-1 text-xs text-muted">{formatMontant(m.montantPaye)} / {formatMontant(m.fraisMensuel)}</p>
                <p
                  className={`mt-1.5 text-xs font-medium ${
                    m.paye ? "text-forest" : m.enRetard ? "text-brick" : "text-muted"
                  }`}
                >
                  {m.paye ? "Réglé" : m.enRetard ? "⚠ En retard" : "À venir"}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-5">
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-display text-lg text-ink">Informations</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-muted">Date de naissance</dt><dd className="text-ink">{formatDate(etudiant.dateNaissance)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Sexe</dt><dd className="text-ink">{etudiant.sexe === "F" ? "Féminin" : etudiant.sexe === "M" ? "Masculin" : "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Tuteur / parent</dt><dd className="text-ink">{etudiant.nomTuteur || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Téléphone</dt><dd className="text-ink">{etudiant.telephoneTuteur || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Adresse</dt><dd className="text-ink text-right">{etudiant.adresse || "—"}</dd></div>
            <div className="flex justify-between"><dt className="text-muted">Date d'inscription</dt><dd className="text-ink">{formatDate(etudiant.dateInscription)}</dd></div>
          </dl>
        </div>

        <div className="card p-6 lg:col-span-3">
          <h2 className="font-display text-lg text-ink">Historique des paiements</h2>
          {etudiant.Paiements?.length === 0 ? (
            <p className="mt-4 text-sm text-muted">Aucun paiement enregistré pour cet étudiant.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {etudiant.Paiements?.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-line/70 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-ink">{formatMontant(p.montant)}</p>
                    <p className="text-xs text-muted">
                      {formatDate(p.datePaiement)} · {p.methode}
                      {p.mois ? ` · couvre ${String(p.mois).padStart(2, "0")}/${p.anneeMois}` : ""}
                      {p.reference ? ` · Réf. ${p.reference}` : ""}
                    </p>
                  </div>
                  <button onClick={() => supprimerPaiement(p.id)} className="text-xs text-brick hover:underline">
                    Supprimer
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Enregistrer un paiement">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-field">Mois concerné</label>
            <select className="input-field" value={form.moisCle} onChange={(e) => setForm({ ...form, moisCle: e.target.value })} required>
              <option value="" disabled>Sélectionner un mois</option>
              {mensualites?.mensualites.map((m) => (
                <option key={`${m.mois}-${m.annee}`} value={`${m.mois}-${m.annee}`}>
                  {m.libelle}{m.paye ? " — déjà réglé" : m.enRetard ? " — en retard" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Montant (Ar)</label>
            <input type="number" min="1" step="100" className="input-field" value={form.montant} onChange={(e) => setForm({ ...form, montant: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Date de paiement</label>
              <input type="date" className="input-field" value={form.datePaiement} onChange={(e) => setForm({ ...form, datePaiement: e.target.value })} />
            </div>
            <div>
              <label className="label-field">Méthode</label>
              <select className="input-field" value={form.methode} onChange={(e) => setForm({ ...form, methode: e.target.value })}>
                <option value="especes">Espèces</option>
                <option value="cheque">Chèque</option>
                <option value="virement">Virement</option>
                <option value="autre">Autre</option>
              </select>
            </div>
          </div>
          <div>
            <label className="label-field">Référence (n° reçu, chèque...)</label>
            <input className="input-field" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
          </div>
          <div>
            <label className="label-field">Note</label>
            <input className="input-field" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
          </div>

          {error && <p className="text-sm text-brick">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary">Enregistrer</button>
          </div>
        </form>
      </Modal>

      <Modal open={promotionOpen} onClose={() => setPromotionOpen(false)} title="Faire passer en classe suivante">
        <form onSubmit={handlePromotion} className="space-y-4">
          <div>
            <label className="label-field">Nouvelle classe</label>
            <select
              className="input-field"
              value={promotionForm.classeId}
              onChange={(e) => setPromotionForm({ ...promotionForm, classeId: e.target.value })}
              required
            >
              <option value="" disabled>Sélectionner une classe</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.nom} · {c.anneeScolaire}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-field">Statut dans la nouvelle classe</label>
            <select
              className="input-field"
              value={promotionForm.statutAcademique}
              onChange={(e) => setPromotionForm({ ...promotionForm, statutAcademique: e.target.value })}
            >
              <option value="passant">Passant (promu)</option>
              <option value="redoublant">Redoublant</option>
            </select>
          </div>
          <p className="text-xs text-muted">
            L'historique des paiements de {etudiant.prenom} est conservé ; les mensualités affichées correspondront
            désormais à l'année scolaire de la nouvelle classe.
          </p>
          {promotionErr && <p className="text-sm text-brick">{promotionErr}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-secondary" onClick={() => setPromotionOpen(false)}>Annuler</button>
            <button type="submit" className="btn-primary">Confirmer le passage</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
