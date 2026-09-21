const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Paiement = sequelize.define("Paiement", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  montant: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
  },
  datePaiement: {
    type: DataTypes.DATEONLY,
    defaultValue: DataTypes.NOW,
  },
  methode: {
    type: DataTypes.ENUM("especes", "cheque", "virement", "autre"),
    defaultValue: "especes",
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: true,
    // n° de reçu / chèque
  },
  mois: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: { min: 1, max: 12 },
    // mois scolaire couvert par ce paiement (1 = Janvier ... 12 = Décembre)
  },
  anneeMois: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // année civile correspondant au champ "mois" ci-dessus
  },
  note: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: "paiements",
  timestamps: true,
});

module.exports = Paiement;
