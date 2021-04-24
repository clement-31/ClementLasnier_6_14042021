const express = require('express');

const router = express.Router(); //Permet de charger le middleware au niveau du routeur

const userCtrl = require('../controllers/user');
const passValidate = require('../middleware/passValidate');
const mailValidate = require('../middleware/mailValidation');
const rateLimit = require("express-rate-limit");

const rateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5, //
    message: " Vos tentatives de connexion ont échoué, veuillez réessayer dans 5 minutes",
});


router.post('/signup',mailValidate, passValidate, userCtrl.signup); //Création d'un nouvel utilisateur
router.post('/login',rateLimiter, userCtrl.login); //Connexion d'un utilisateur existant

module.exports = router;
