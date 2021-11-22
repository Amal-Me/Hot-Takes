//utilisation de bcrypt pour crypter les données
const bcrypt    = require('bcrypt');
//importation du model User
const User      = require('../models/User');
//jeton permettant d’échanger des informations de manière sécurisée
const jwt       = require('jsonwebtoken');

exports.signup = (req,res,next) =>{
    //chiffrement du mot de passe
    bcrypt.hash(req.body.password, 10)
    .then(hash => { 
        // création utilisateur
        const user = new User({
           email: req.body.email,
           password: hash 
        });
        //enregistrement dans la collection Users de la BDD
        user.save()
        .then(() => res.status(201).json({message: 'Utilisateur crée'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
};

exports.login = (req,res,next) =>{  
    //on trouve l'utilisateur par l'email du corps de la requête 
    User.findOne({ email: req.body.email}) 
    .then(user => {
        if(!user) { return res.status(401).json({error: 'Utilisateur non trouvé'});}
        //comparaison des mots de passe
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {
            if (!valid) { return res.status(401).json({error: 'Mot de passe incorrect'});}
            //renvoi du userId et du token au front
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    //encodage du token
                    { userId: user._id},
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch(error => res.status(500).json({error}));
}