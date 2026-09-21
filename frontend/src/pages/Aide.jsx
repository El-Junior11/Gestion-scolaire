import { useState } from "react";

const sections = [
  {
    titre: "Classes",
    contenu: [
      "Créez une classe avec son nom, son niveau, son année scolaire et son frais de scolarité annuel.",
      "Le frais annuel est automatiquement réparti sur les 12 mois de l'année scolaire pour calculer chaque mensualité.",
      "Une classe contenant des étudiants ne peut pas être supprimée : retirez ou déplacez d'abord les élèves.",
    ],
  },
  {
    titre: "Étudiants",
    contenu: [
      "Chaque étudiant reçoit un matricule généré automatiquement à l'inscription.",
      "Le statut « nouveau », « passant » ou « redoublant » indique sa situation dans la classe actuelle.",
      "Depuis la fiche d'un étudiant, le bouton « Faire passer en classe suivante » permet de le déplacer vers une nouvelle classe en le marquant passant ou redoublant.",
    ],
  },
  {
    titre: "Paiements mensuels",
    contenu: [
      "La scolarité se règle mois par mois : chaque fiche étudiant affiche les 12 mensualités de l'année scolaire.",
      "La date limite de chaque mensualité est fixée au 10 du mois concerné.",
      "Un mois non réglé après le 10 s'affiche automatiquement en rouge comme « en retard ».",
      "Pour enregistrer un règlement, ouvrez la fiche de l'étudiant, cliquez sur « Enregistrer un paiement » et choisissez le mois concerné.",
    ],
  },
  {
    titre: "Tableau de bord & notifications",
    contenu: [
      "Le tableau de bord résume les effectifs, les montants encaissés, le solde restant dû et la répartition par classe.",
      "La cloche de notifications, dans la barre du haut, liste les mensualités en retard et vous amène directement à la fiche de l'étudiant concerné.",
    ],
  },
  {
    titre: "Apparence",
    contenu: [
      "Le bouton en forme de soleil / lune dans la barre du haut bascule entre mode clair et mode sombre.",
      "Votre préférence est mémorisée automatiquement pour vos prochaines visites.",
    ],
  },
];

export default function Aide() {
  const [ouvert, setOuvert] = useState(0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-ink">Aide & documentation</h1>
        <p className="mt-1 text-sm text-muted">Comprendre et utiliser les fonctionnalités de l'application</p>
      </div>

      <div className="space-y-3">
        {sections.map((s, i) => (
          <div key={s.titre} className="card overflow-hidden">
            <button
              onClick={() => setOuvert(ouvert === i ? -1 : i)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="font-display text-lg text-ink">{s.titre}</span>
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className={`h-5 w-5 text-muted transition-transform ${ouvert === i ? "rotate-180" : ""}`}
              >
                <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {ouvert === i && (
              <ul className="space-y-2.5 border-t border-line px-5 py-4">
                {s.contenu.map((ligne, j) => (
                  <li key={j} className="flex gap-2.5 text-sm text-ink">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {ligne}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
