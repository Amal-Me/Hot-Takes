const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//extraction du token
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//verification-décodage
    const userId = decodedToken.userId;//recuperation id
    if (req.body.userId && req.body.userId !== userId) {//comparaison id
      throw 'Utilisateur non valide';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: error | 'Requête non authentifiée'});
  }
};