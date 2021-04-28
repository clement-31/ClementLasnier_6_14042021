const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; //On extrait le token de la requête
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_TOKEN); //On décrypte le token grâce à la clé secrète
        const userId = decodedToken.userId; //On récupère l'userId du token décrypté
        if (req.body.userId && req.body.userId !== userId) {
            throw "Invalid user ID"; //Renvoie une erreur si l'id décodé de la requête ne correspond pas l'id de l'utilisateur
        } else {
            next(); //Sinon, l'authentification est réussie et la suite du code peut s'exécuter
        }
    } catch(err) {
        res.status(401).json({
            error: new Error("Invalid request!"),
        });
    }
};

