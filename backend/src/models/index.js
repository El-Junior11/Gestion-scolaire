const sequelize = require("../config/db");
const User = require("./User");
const Classe = require("./Classe");
const Etudiant = require("./Etudiant");
const Paiement = require("./Paiement");

// Une classe a plusieurs étudiants
Classe.hasMany(Etudiant, { foreignKey: "classeId", onDelete: "RESTRICT" });
Etudiant.belongsTo(Classe, { foreignKey: "classeId" });

// Un étudiant a plusieurs paiements
Etudiant.hasMany(Paiement, { foreignKey: "etudiantId", onDelete: "CASCADE" });
Paiement.belongsTo(Etudiant, { foreignKey: "etudiantId" });

module.exports = {
  sequelize,
  User,
  Classe,
  Etudiant,
  Paiement,
};
