// Initialise Express, connecte MongoDB, définit les routes et gère les fichiers images

const express     = require('express');
const app         = express();
const helmet      = require('helmet');
const mongoose    = require('mongoose');

const path        = require('path');
const userRoutes  = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

require('dotenv').config();
//mongoose.set('strictQuery', true);

mongoose.connect(process.env.CONNECT_MDB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(helmet());

//CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

//analyse du corps de la requête en tant qu'objet JSON (POST)
app.use(express.json());


app.use('/images', express.static(path.join(__dirname, 'images')));

//redirection 
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;