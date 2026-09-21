// Génère les 12 mois d'une année scolaire (ex: "2026-2027" -> Septembre 2026 à Août 2027)
// et calcule la date limite de paiement (le 10 de chaque mois) pour chacun.

const NOMS_MOIS = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function genererMoisAnneeScolaire(anneeScolaire) {
  const anneeDebut = parseInt(String(anneeScolaire).split("-")[0], 10) || new Date().getFullYear();
  const sequence = [];

  for (let m = 9; m <= 12; m++) sequence.push({ mois: m, annee: anneeDebut });
  for (let m = 1; m <= 8; m++) sequence.push({ mois: m, annee: anneeDebut + 1 });

  return sequence.map((x) => ({
    mois: x.mois,
    annee: x.annee,
    libelle: `${NOMS_MOIS[x.mois - 1]} ${x.annee}`,
    // Date limite : le 10 du mois concerné
    dateLimite: new Date(x.annee, x.mois - 1, 10, 23, 59, 59),
  }));
}

module.exports = { genererMoisAnneeScolaire, NOMS_MOIS };
