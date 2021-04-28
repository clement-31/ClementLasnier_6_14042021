const rateLimit = require("express-rate-limit");

const authenticationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // Durée de 15 minutes
    max: 100, // Limite les requêtes d'authentification à 100 toutes les 15 minutes
    message:
        "Vous avez dépassé la limite autorisée de 100 requêtes, veuillez attendre 15 minutes !",
});

module.exports = authenticationLimiter;

