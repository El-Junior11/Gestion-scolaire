const { Etudiant, Classe, Paiement, sequelize } = require("../models");
const { genererMoisAnneeScolaire } = require("../utils/moisScolaire");

// Génère un matricule simple : EL-2026-0001
async function genererMatricule() {
  const annee = new Date().getFullYear();
  const count = await Etudiant.count();
  const numero = String(count + 1).padStart(4, "0");
  return `EL-${annee}-${numero}`;
}

// Ajoute totalPaye / solde à un étudiant
async function enrichirAvecSolde(etudiant) {
  const total = await Paiement.sum("montant", { where: { etudiantId: etudiant.id } });
  const totalPaye = total || 0;
  const fraisScolarite = etudiant.Classe ? parseFloat(etudiant.Classe.fraisScolarite) : 0;
  return {
    ...etudiant.toJSON(),
    totalPaye,
    solde: fraisScolarite - totalPaye,
  };
}

exports.getAll = async (req, res, next) => {
  try {
    const { classeId, search, statut } = req.query;
    const where = {};
    if (classeId) where.classeId = classeId;
    if (statut) where.statut = statut;

    const etudiants = await Etudiant.findAll({
      where,
      include: [{ model: Classe }],
      order: [["nom", "ASC"], ["prenom", "ASC"]],
    });

    let filtered = etudiants;
    if (search) {
      const q = search.toLowerCase();
      filtered = etudiants.filter(
        (e) =>
          e.nom.toLowerCase().includes(q) ||
          e.prenom.toLowerCase().includes(q) ||
          e.matricule.toLowerCase().includes(q)
      );
    }

    const enriched = await Promise.all(filtered.map(enrichirAvecSolde));
    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const etudiant = await Etudiant.findByPk(req.params.id, {
      include: [{ model: Classe }, { model: Paiement, order: [["datePaiement", "DESC"]] }],
    });
    if (!etudiant) return res.status(404).json({ message: "Étudiant introuvable." });

    const enriched = await enrichirAvecSolde(etudiant);
    res.json(enriched);
  } catch (err) {
    next(err);
  }
};

// Détail des 12 mensualités de l'année scolaire pour un étudiant,
// avec le statut de paiement et le retard éventuel (échéance : le 10 du mois).
exports.getMensualites = async (req, res, next) => {
  try {
    const etudiant = await Etudiant.findByPk(req.params.id, { include: [{ model: Classe }] });
    if (!etudiant) return res.status(404).json({ message: "Étudiant introuvable." });
    if (!etudiant.Classe) return res.status(400).json({ message: "Cet étudiant n'a pas de classe." });

    const fraisMensuel = parseFloat(etudiant.Classe.fraisScolarite) / 12;
    const moisListe = genererMoisAnneeScolaire(etudiant.Classe.anneeScolaire);

    const paiements = await Paiement.findAll({
      where: { etudiantId: etudiant.id },
      order: [["datePaiement", "DESC"]],
    });

    const maintenant = new Date();

    const mensualites = moisListe.map((m) => {
      const paiementsDuMois = paiements.filter((p) => p.mois === m.mois && p.anneeMois === m.annee);
      const montantPaye = paiementsDuMois.reduce((acc, p) => acc + parseFloat(p.montant), 0);
      const paye = fraisMensuel > 0 && montantPaye >= fraisMensuel;
      const enRetard = !paye && maintenant > m.dateLimite;

      return {
        mois: m.mois,
        annee: m.annee,
        libelle: m.libelle,
        dateLimite: m.dateLimite,
        fraisMensuel,
        montantPaye,
        paye,
        enRetard,
        paiements: paiementsDuMois,
      };
    });

    res.json({ etudiantId: etudiant.id, fraisMensuel, mensualites });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { nom, prenom, classeId, dateNaissance, sexe, nomTuteur, telephoneTuteur, adresse, statutAcademique } = req.body;
    if (!nom || !prenom || !classeId) {
      return res.status(400).json({ message: "Nom, prénom et classe sont requis." });
    }

    const classe = await Classe.findByPk(classeId);
    if (!classe) return res.status(400).json({ message: "Classe invalide." });

    const matricule = await genererMatricule();

    const etudiant = await Etudiant.create({
      matricule,
      nom,
      prenom,
      classeId,
      dateNaissance: dateNaissance || null,
      sexe: sexe || null,
      nomTuteur,
      telephoneTuteur,
      adresse,
      statutAcademique: statutAcademique || "nouveau",
    });

    res.status(201).json(etudiant);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const etudiant = await Etudiant.findByPk(req.params.id);
    if (!etudiant) return res.status(404).json({ message: "Étudiant introuvable." });

    await etudiant.update(req.body);
    res.json(etudiant);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const etudiant = await Etudiant.findByPk(req.params.id);
    if (!etudiant) return res.status(404).json({ message: "Étudiant introuvable." });

    await etudiant.destroy();
    res.json({ message: "Étudiant supprimé." });
  } catch (err) {
    next(err);
  }
};

// Fait passer un étudiant vers une autre classe (année suivante), en précisant
// s'il est promu ("passant") ou redouble ("redoublant") dans cette nouvelle classe.
exports.promouvoir = async (req, res, next) => {
  try {
    const { classeId, statutAcademique } = req.body;
    if (!classeId) return res.status(400).json({ message: "La nouvelle classe est requise." });
    if (!["passant", "redoublant"].includes(statutAcademique)) {
      return res.status(400).json({ message: "Le statut doit être 'passant' ou 'redoublant'." });
    }

    const etudiant = await Etudiant.findByPk(req.params.id);
    if (!etudiant) return res.status(404).json({ message: "Étudiant introuvable." });

    const nouvelleClasse = await Classe.findByPk(classeId);
    if (!nouvelleClasse) return res.status(400).json({ message: "Classe invalide." });

    await etudiant.update({ classeId, statutAcademique });

    const resultat = await Etudiant.findByPk(etudiant.id, { include: [{ model: Classe }] });
    res.json(resultat);
  } catch (err) {
    next(err);
  }
};
