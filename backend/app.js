//importation librairie express dans app pour ajouter les fonctionnalités appropriées
const express     = require('express');
const app         = express();
//MONGOOSE facilite les interactions avec la BDD
const mongoose    = require('mongoose');
//accès au chemin de notre serveur(path)
const path        = require('path');
const userRoutes  = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
//importation dotenv pour masquer les informations voulues 
require('dotenv').config();

//connection a la base de données
mongoose.connect(process.env.CONNECT_MDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


//CORS
app.use((req, res, next) => {
  //on autorise ttes les origines*
  res.setHeader('Access-Control-Allow-Origin', '*');
  //autorisation de certains en-têtes
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  //envoi de requêtes avec les méthodes mentionnées
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  //passage au middleware suivant
  next();
});

//méthode pour analyser le corps de la requête en tant qu'objet JSON (POST)
app.use(express.json());
//gestion de la ressource images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));
//redirection userRoutes
app.use('/api/auth', userRoutes);
//redirection sauceRoutes
app.use('/api/sauces', sauceRoutes);

module.exports = app;