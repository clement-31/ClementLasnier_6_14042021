const express = require("express");
const router = express.Router(); //Permet de charger le middleware au niveau du routeur

const sauceCtrl = require('../controllers/sauce'); //Appel de la logique métier de nos routes
const auth = require("../middleware/auth"); //Appel du middleware d'authentification
const multer = require('../middleware/multer-config'); //Appel du middleware pour la gestion des images
const sauceLimiter = require('../middleware/sauceLimiter'); //Appel du middleware sauceLimiter


//Lier les routes aux controllers
router.post('/', auth, sauceLimiter, multer, sauceCtrl.createSauce); //Créer une sauce
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce); //Like et dislike une sauce
router.get('/:id', auth, sauceCtrl.getOneSauce); // Récupérer une seule sauce
router.get('/', auth, sauceCtrl.getAllSauces); // Récupérer toutes les sauces
router.put('/:id', auth, sauceLimiter, multer, sauceCtrl.modifySauce); //Modifier une sauce existante
router.delete('/:id', auth, sauceCtrl.deleteSauce); //Supprimer une sauce

module.exports = router;

