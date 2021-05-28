const express = require("express");
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');
const auth = require("../middleware/auth");
const multer = require('../middleware/multer-config');
const sauceLimiter = require('../middleware/sauceLimiter');


//Liaison des routes aux controllers
router.post('/', auth, sauceLimiter, multer, sauceCtrl.createSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.put('/:id', auth, sauceLimiter, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;

