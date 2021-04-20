const express = require('express');

//Permet de charger le middleware niveau routeur
const router = express.Router();

const auth = require('../middleware/auth'); //Appel du middleware d'authentification
const multer = require('../middleware/multer-config'); //Appel du middleware pour la gestion des images

const saucesCtrl = require('../controllers/sauce'); //Appel de la logique métier des routes

//Liaison des routes aux controllers
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/', auth, saucesCtrl.getAllSauce);
router.get('/:id', auth, saucesCtrl.getOneSauce);
router.put('/:id', auth, multer, saucesCtrl.modifySauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.like);

module.exports = router;
