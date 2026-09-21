const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Etudiant = sequelize.define("Etudiant", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  matricule: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dateNaissance: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  sexe: {
    type: DataTypes.ENUM("M", "F"),
    allowNull: true,
  },
  nomTuteur: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  telephoneTuteur: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  adresse: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dateInscription: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  statut: {
    type: DataTypes.ENUM("actif", "inactif"),
    defaultValue: "actif",
  },
  statutAcademique: {
    type: DataTypes.ENUM("nouveau", "passant", "redoublant"),
    defaultValue: "nouveau",
    // situation de l'élève pour l'année scolaire en cours dans sa classe actuelle
  },
}, {
  tableName: "etudiants",
  timestamps: true,
});

module.exports = Etudiant;
