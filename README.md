# Institut — Gestion scolaire

Application web de gestion scolaire : classes, étudiants, paiements de scolarité mensuels et suivi des retards.

- **Backend** : Node.js, Express, PostgreSQL (Sequelize), authentification JWT
- **Frontend** : React (Vite), Tailwind CSS, Recharts

## Fonctionnalités

- Page d'accueil publique, puis connexion administrateur sécurisée (JWT)
- Gestion des classes (nom, niveau, année scolaire, frais de scolarité annuel)
- Gestion des étudiants par classe (fiche complète, matricule automatique)
- **Statut de l'étudiant** : nouveau / passant / redoublant, avec passage vers la classe suivante en un clic
- **Paiement mensuel de la scolarité** : les 12 mois de l'année scolaire sont suivis individuellement pour chaque étudiant
- **Échéance fixée au 10 de chaque mois** : tout mois non réglé après cette date est signalé en rouge comme « en retard »
- **Notifications** : cloche dans la barre du haut listant les mensualités en retard, avec accès direct à la fiche concernée
- **Mode clair / mode sombre**, mémorisé automatiquement
- Barre latérale et barre du haut fixes ; seul le contenu principal défile
- Page **Aide & documentation** intégrée
- Page **Paramètres du compte** (informations, mot de passe, apparence)
- Tableau de bord : effectifs, montants encaissés, répartition par classe, retards, derniers paiements

## 1. Prérequis

- Node.js 18+
- PostgreSQL 13+ installé et démarré

## 2. Installation du backend

```bash
cd backend
npm install
cp .env.example .env
```

Ouvrez `.env` et renseignez vos identifiants PostgreSQL (`DB_NAME`, `DB_USER`, `DB_PASSWORD`...).
Créez ensuite la base de données :

```bash
createdb ecole_db
```

Démarrez le serveur (il crée/synchronise automatiquement les tables au démarrage — `sequelize.sync({ alter: true })`, adapté au développement) :

```bash
npm run dev
```

Créez le compte administrateur (à faire une seule fois) :

```bash
npm run seed
```

Les identifiants créés sont ceux définis dans `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`).

L'API est disponible sur `http://localhost:5000/api`.

## 3. Installation du frontend

Dans un second terminal :

```bash
cd frontend
npm install
npm run dev
```

L'application est disponible sur `http://localhost:5173`. Les requêtes vers `/api` sont automatiquement redirigées vers le backend (voir `vite.config.js`).

## 4. Utilisation

1. Sur la page d'accueil, cliquez sur « Se connecter » puis identifiez-vous avec le compte admin créé via `npm run seed`.
2. Créez vos classes avec leur frais de scolarité annuel (réparti automatiquement sur 12 mois).
3. Inscrivez les étudiants dans leur classe, avec leur statut (nouveau par défaut).
4. Depuis la fiche d'un étudiant, enregistrez les paiements en précisant le mois concerné.
5. Les mois non réglés après le 10 apparaissent automatiquement en rouge, dans la fiche étudiant, sur le tableau de bord et dans les notifications.
6. En fin d'année, utilisez « Faire passer en classe suivante » sur la fiche de l'étudiant pour le déplacer vers sa nouvelle classe (passant ou redoublant).

## Structure du projet

```
ecole-app/
├── backend/
│   └── src/
│       ├── config/        # connexion PostgreSQL
│       ├── models/        # User, Classe, Etudiant, Paiement
│       ├── controllers/    # logique métier (dont mensualités, retards, promotion)
│       ├── routes/         # routes Express
│       ├── middleware/     # authentification, gestion d'erreurs
│       └── utils/          # JWT, script de seed, génération des 12 mois scolaires
└── frontend/
    └── src/
        ├── api/            # client axios
        ├── context/        # authentification, thème clair/sombre
        ├── components/     # Sidebar, Navbar, AppLayout, Modal...
        ├── pages/          # Accueil, Login, Dashboard, Classes, Étudiants, Paiements, Aide, Paramètres
        └── utils/          # formatage (montants en Ariary, dates, statuts)
```

## Notes techniques

- Une mensualité est considérée « payée » lorsque la somme des paiements enregistrés pour ce mois atteint le frais mensuel (frais annuel de la classe ÷ 12).
- Le mode sombre s'applique à l'espace administration (tout ce qui suit la connexion) ; la page d'accueil et l'écran de connexion gardent leur apparence fixe.
- Lors d'un passage de classe, l'historique des paiements de l'étudiant est conservé ; la grille des mensualités affichée reflète l'année scolaire de sa classe actuelle.

## Pistes d'évolution

- Rôles supplémentaires (enseignants, parents) avec permissions différenciées
- Génération de reçus de paiement en PDF
- Export Excel des listes d'étudiants et des paiements
- Intégration d'un moyen de paiement en ligne (Mobile Money, carte)
- Historique visible des classes précédentes d'un étudiant après un passage
