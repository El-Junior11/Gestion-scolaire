const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Classe = sequelize.define("Classe", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    // ex: "6ème A", "Terminale D"
  },
  niveau: {
    type: DataTypes.STRING,
    allowNull: true,
    // ex: "Collège", "Lycée"
  },
  anneeScolaire: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "2026-2027",
  },
  fraisScolarite: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    defaultValue: 0,
    // montant total annuel dû par élève pour cette classe
  },
}, {
  tableName: "classes",
  timestamps: true,
});

module.exports = Classe;
