const express = require("express");
const router = express.Router();//Permet de charger le middleware niveau router

const userCtrl = require("../controllers/user");//Appel de la logique métier de nos routes
const authenticationLimiter = require("../middleware/authenticationLimiter");//Appel du middleware sauceLimiter

router.post("/signup", userCtrl.signup);//Création d'un nouvel utilisateur
router.post("/login", authenticationLimiter, userCtrl.login);//Login d'un utilisateur existant

module.exports = router;

