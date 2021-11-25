//middleware d'authentification pour securiser les routes
const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (req, res, next) => {
  try {
    //extraction du token dans l en-tête "Authorization" de la requête
    const token         = req.headers.authorization.split(' ')[1];
    //verification-décodage stocké dans la requête pour réutilisation
    req.token  = jwt.verify(token, process.env.TOKEN_KEY);
    //comparaison userId avec celui extrait du token
    if (req.body.userId && req.body.userId !== req.token.userId) {
      throw 'Utilisateur non valide';
    } else { next();}
  } catch {
    res.status(401).json({
      error: error | 'Requête non authentifiée'});
  }
}