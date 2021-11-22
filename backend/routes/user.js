//création d'un routeur
const express   = require('express');
const router    = express.Router();

//importation du chemin comprenant la logique de traitement
const userCtrl  = require('../controllers/user');

//route vers le traitement asssocié
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;