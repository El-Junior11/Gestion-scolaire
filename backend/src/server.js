require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
require("./models"); // charge les associations

const authRoutes = require("./routes/authRoutes");
const classeRoutes = require("./routes/classeRoutes");
const etudiantRoutes = require("./routes/etudiantRoutes");
const paiementRoutes = require("./routes/paiementRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/classes", classeRoutes);
app.use("/api/etudiants", etudiantRoutes);
app.use("/api/paiements", paiementRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use((req, res) => res.status(404).json({ message: "Route introuvable." }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie.");
    // { alter: true } permet d'appliquer automatiquement les changements de schéma
    // (ex. nouvelles colonnes "mois"/"anneeMois") en développement.
    // En production, remplacer par des migrations Sequelize.
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
  } catch (err) {
    console.error("Impossible de démarrer le serveur :", err);
    process.exit(1);
  }
}

start();
