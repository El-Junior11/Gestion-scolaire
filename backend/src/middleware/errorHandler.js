// Middleware global de gestion des erreurs
function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Erreur interne du serveur.",
  });
}

module.exports = errorHandler;
