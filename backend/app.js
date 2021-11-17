const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

// const User = require('./models/User');
// const Sauce = require('./models/Sauce');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
mongoose.connect('mongodb+srv://user_1:YanissouTest1@cluster0.ri6na.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');//on autorise ttes les origines
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//autorisation de certains en-têtes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//autorisations des methodes de requêtes
  next();//passage au middleware suivant
});

app.use(express.json());
// app.use((req, res) => {
//    res.json({ message: 'Votre requête a bien été reçue !' }); 
// });
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
module.exports = app;

