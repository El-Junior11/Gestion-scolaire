// Crée le compte administrateur initial à partir des variables d'environnement.
// Usage : npm run seed
require("dotenv").config();
const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");
const { User } = require("../models");

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    const email = process.env.ADMIN_EMAIL;
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      console.log(`Le compte admin ${email} existe déjà.`);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
      name: process.env.ADMIN_NAME || "Administrateur",
      email,
      password: hashed,
      role: "admin",
    });

    console.log("Compte administrateur créé avec succès :");
    console.log(`  Email    : ${email}`);
    console.log(`  Mot de passe : ${process.env.ADMIN_PASSWORD}`);
    process.exit(0);
  } catch (err) {
    console.error("Erreur lors du seed :", err);
    process.exit(1);
  }
}

seed();
