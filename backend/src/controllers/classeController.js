const { Classe, Etudiant, Paiement, sequelize } = require("../models");

exports.getAll = async (req, res, next) => {
  try {
    const classes = await Classe.findAll({
      order: [["nom", "ASC"]],
    });

    // Ajoute le nombre d'étudiants par classe
    const counts = await Etudiant.findAll({
      attributes: ["classeId", [sequelize.fn("COUNT", sequelize.col("id")), "count"]],
      group: ["classeId"],
      raw: true,
    });
    const countMap = Object.fromEntries(counts.map((c) => [c.classeId, parseInt(c.count, 10)]));

    const result = classes.map((c) => ({
      ...c.toJSON(),
      nombreEtudiants: countMap[c.id] || 0,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const classe = await Classe.findByPk(req.params.id);
    if (!classe) return res.status(404).json({ message: "Classe introuvable." });
    res.json(classe);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { nom, niveau, anneeScolaire, fraisScolarite } = req.body;
    if (!nom) return res.status(400).json({ message: "Le nom de la classe est requis." });

    const classe = await Classe.create({ nom, niveau, anneeScolaire, fraisScolarite });
    res.status(201).json(classe);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const classe = await Classe.findByPk(req.params.id);
    if (!classe) return res.status(404).json({ message: "Classe introuvable." });

    await classe.update(req.body);
    res.json(classe);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const classe = await Classe.findByPk(req.params.id);
    if (!classe) return res.status(404).json({ message: "Classe introuvable." });

    const nbEtudiants = await Etudiant.count({ where: { classeId: classe.id } });
    if (nbEtudiants > 0) {
      return res.status(400).json({
        message: "Impossible de supprimer une classe contenant des étudiants.",
      });
    }

    await classe.destroy();
    res.json({ message: "Classe supprimée." });
  } catch (err) {
    next(err);
  }
};
