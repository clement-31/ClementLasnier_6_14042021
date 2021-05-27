const express = require("express");
const router = express.Router();//Permet de charger le middleware au niveau du routeur
const userCtrl = require("../controllers/user");//Appel de la logique métier de nos routes
const authenticationLimiter = require("../middleware/authenticationLimiter");//Appel du middleware authenticationLimiter

const rateLimit = require("express-rate-limit");
const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5, //
    message: " Trop de tentatives échouées, réessayez dans 5 minutes",
});

router.post("/signup", userCtrl.signup);//Création d'un nouvel utilisateur
router.post("/login",authenticationLimiter, userCtrl.login);//Login d'un utilisateur existant

module.exports = router;

