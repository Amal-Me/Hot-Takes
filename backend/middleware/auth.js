//middleware d'authentification pour securiser les routes
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    //extraction du token dans l en-tête "Authorization" de la requête
    const token         = req.headers.authorization.split(' ')[1];
    //verification-décodage
    const decodedToken  = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    //recuperation userId du token
    const userId        = decodedToken.userId;
    //comparaison userId avec celui extrait du token
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Utilisateur non valide';
    } else { next();}
  } catch {
    res.status(401).json({
      error: error | 'Requête non authentifiée'});
  }
}