//création d'un routeur 
const express   = require('express');
const router    = express.Router();

//importation du chemin comprenant la logique de traitement
const sauceCtrl = require('../controllers/sauce');
const auth      = require('../middleware/auth');
const multer    = require('../middleware/multer-config');

//chemin d'authentification, de gestion de fichiers entrants et de traitement associé
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
module.exports = router;