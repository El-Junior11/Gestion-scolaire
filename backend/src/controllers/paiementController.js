const { Paiement, Etudiant, Classe } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const { etudiantId } = req.query;
    const where = {};
    if (etudiantId) where.etudiantId = etudiantId;

    const paiements = await Paiement.findAll({
      where,
      include: [{ model: Etudiant, include: [{ model: Classe }] }],
      order: [["datePaiement", "DESC"]],
    });
    res.json(paiements);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { etudiantId, montant, datePaiement, methode, reference, note, mois, anneeMois } = req.body;
    if (!etudiantId || !montant) {
      return res.status(400).json({ message: "Étudiant et montant sont requis." });
    }
    if (parseFloat(montant) <= 0) {
      return res.status(400).json({ message: "Le montant doit être supérieur à zéro." });
    }
    if (mois && (mois < 1 || mois > 12)) {
      return res.status(400).json({ message: "Le mois doit être compris entre 1 et 12." });
    }

    const etudiant = await Etudiant.findByPk(etudiantId);
    if (!etudiant) return res.status(400).json({ message: "Étudiant introuvable." });

    const paiement = await Paiement.create({
      etudiantId,
      montant,
      datePaiement: datePaiement || undefined,
      methode: methode || "especes",
      reference,
      note,
      mois: mois || null,
      anneeMois: anneeMois || null,
    });

    res.status(201).json(paiement);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) return res.status(404).json({ message: "Paiement introuvable." });

    await paiement.destroy();
    res.json({ message: "Paiement supprimé." });
  } catch (err) {
    next(err);
  }
};
