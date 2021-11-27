const Sauce = require('../models/Sauce');

module.exports = (req, res, next) => {
   // on cherche la sauce pour récupérer l id du créateur
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => { 
    //comparaison id du créateur avec celui extrait du token
    if (sauce.userId !== req.token.userId) {
        throw 'Utilisateur non valide';
      } else { next();}})
    .catch(e => res.status(403).json({message: e}))
}