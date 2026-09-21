const { Etudiant, Classe, Paiement, sequelize } = require("../models");
const { Op } = require("sequelize");
const { genererMoisAnneeScolaire } = require("../utils/moisScolaire");

// Calcule, pour tous les étudiants actifs, les mensualités échues (après le 10 du mois)
// et non réglées. Réutilisé par /stats et /retards.
async function calculerRetards() {
  const etudiants = await Etudiant.findAll({
    where: { statut: "actif" },
    include: [{ model: Classe }],
  });
  const paiements = await Paiement.findAll();
  const maintenant = new Date();
  const retards = [];

  for (const e of etudiants) {
    if (!e.Classe) continue;
    const fraisMensuel = parseFloat(e.Classe.fraisScolarite) / 12;
    if (fraisMensuel <= 0) continue;

    const moisListe = genererMoisAnneeScolaire(e.Classe.anneeScolaire);
    for (const m of moisListe) {
      if (maintenant <= m.dateLimite) continue;
      const montantPaye = paiements
        .filter((p) => p.etudiantId === e.id && p.mois === m.mois && p.anneeMois === m.annee)
        .reduce((acc, p) => acc + parseFloat(p.montant), 0);
      if (montantPaye < fraisMensuel) {
        retards.push({
          etudiantId: e.id,
          nom: e.nom,
          prenom: e.prenom,
          classe: e.Classe.nom,
          mois: m.libelle,
          dateLimite: m.dateLimite,
        });
      }
    }
  }

  retards.sort((a, b) => new Date(a.dateLimite) - new Date(b.dateLimite));
  return retards;
}

exports.getStats = async (req, res, next) => {
  try {
    const totalEtudiants = await Etudiant.count({ where: { statut: "actif" } });
    const totalClasses = await Classe.count();

    const totalEncaisse = (await Paiement.sum("montant")) || 0;

    // Montant total dû = somme des frais de scolarité de la classe de chaque étudiant actif
    const etudiants = await Etudiant.findAll({
      where: { statut: "actif" },
      include: [{ model: Classe }],
    });
    const totalDu = etudiants.reduce(
      (acc, e) => acc + (e.Classe ? parseFloat(e.Classe.fraisScolarite) : 0),
      0
    );

    // Répartition par sexe (Masculin / Féminin / non renseigné), sur les étudiants actifs
    const nbFeminin = etudiants.filter((e) => e.sexe === "F").length;
    const nbMasculin = etudiants.filter((e) => e.sexe === "M").length;
    const nbNonRenseigne = etudiants.length - nbFeminin - nbMasculin;
    const repartitionParSexe = [
      { sexe: "Féminin", nombre: nbFeminin },
      { sexe: "Masculin", nombre: nbMasculin },
      ...(nbNonRenseigne > 0 ? [{ sexe: "Non renseigné", nombre: nbNonRenseigne }] : []),
    ].filter((s) => s.nombre > 0);

    // Répartition par âge, calculée à partir de la date de naissance réelle de
    // chaque étudiant actif (ceux sans date de naissance renseignée sont ignorés).
    const maintenant = new Date();
    const compteAges = {};
    for (const e of etudiants) {
      if (!e.dateNaissance) continue;
      const naissance = new Date(e.dateNaissance);
      let age = maintenant.getFullYear() - naissance.getFullYear();
      const anniversairePasse =
        maintenant.getMonth() > naissance.getMonth() ||
        (maintenant.getMonth() === naissance.getMonth() && maintenant.getDate() >= naissance.getDate());
      if (!anniversairePasse) age -= 1;
      compteAges[age] = (compteAges[age] || 0) + 1;
    }
    const repartitionParAge = Object.keys(compteAges)
      .map(Number)
      .sort((a, b) => a - b)
      .map((age) => ({ age: `${age} ans`, nombre: compteAges[age] }));

    // Paiements des 30 derniers jours, groupés par jour
    const trenteJours = new Date();
    trenteJours.setDate(trenteJours.getDate() - 30);
    const paiementsRecents = await Paiement.findAll({
      where: { datePaiement: { [Op.gte]: trenteJours } },
      attributes: [
        [sequelize.fn("date_trunc", "day", sequelize.col("date_paiement")), "jour"],
        [sequelize.fn("SUM", sequelize.col("montant")), "total"],
      ],
      group: [sequelize.fn("date_trunc", "day", sequelize.col("date_paiement"))],
      order: [[sequelize.fn("date_trunc", "day", sequelize.col("date_paiement")), "ASC"]],
      raw: true,
    });

    // Répartition des étudiants par classe
    const parClasse = await Classe.findAll({
      attributes: ["id", "nom"],
      include: [{ model: Etudiant, attributes: [], where: { statut: "actif" }, required: false }],
    });
    const repartition = await Promise.all(
      parClasse.map(async (c) => ({
        classe: c.nom,
        nombre: await Etudiant.count({ where: { classeId: c.id, statut: "actif" } }),
      }))
    );

    // Derniers paiements
    const derniersPaiements = await Paiement.findAll({
      include: [{ model: Etudiant, include: [{ model: Classe }] }],
      order: [["createdAt", "DESC"]],
      limit: 6,
    });

    // Répartition des frais réellement encaissés, par méthode de paiement
    // (utilisée par le tableau de bord à la place de tout chiffre inventé)
    const parMethode = await Paiement.findAll({
      attributes: ["methode", [sequelize.fn("SUM", sequelize.col("montant")), "total"]],
      group: ["methode"],
      raw: true,
    });
    const libellesMethode = { especes: "Espèces", cheque: "Chèque", virement: "Virement", autre: "Autre" };
    const repartitionParMethode = parMethode.map((m) => ({
      methode: libellesMethode[m.methode] || m.methode,
      total: parseFloat(m.total) || 0,
    }));

    const retards = await calculerRetards();

    res.json({
      totalEtudiants,
      totalClasses,
      totalEncaisse,
      totalDu,
      soldeGlobal: totalDu - totalEncaisse,
      paiementsRecents,
      repartitionParClasse: repartition,
      repartitionParMethode,
      repartitionParAge,
      repartitionParSexe,
      derniersPaiements,
      totalRetards: retards.length,
      retards: retards.slice(0, 8),
    });
  } catch (err) {
    next(err);
  }
};

// Endpoint léger dédié aux notifications (utilisé par la navbar)
exports.getRetards = async (req, res, next) => {
  try {
    const retards = await calculerRetards();
    res.json({ total: retards.length, retards: retards.slice(0, 15) });
  } catch (err) {
    next(err);
  }
};