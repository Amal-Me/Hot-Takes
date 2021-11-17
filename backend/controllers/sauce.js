const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.getAllSauces = (req,res,next) =>{
    Sauce.find()//methode find pour renvoyer un tableau de ttes les sauces ds la BDD
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};
exports.getOneSauce = (req,res,next) =>{
    Sauce.findOne({ _id: req.params.id})//trouve un id particulier grace a l id
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};
exports.createSauce = (req,res,next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
       ...sauceObject ,
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message : 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({error}));
};
exports.likeSauce = (req,res,next) => {
    console.log('likesauce');
};
exports.modifySauce = (req,res,next) => {
    const sauceObject = req.file ?
    { 
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
    // modifier une 'sauce'comparaison(id = id envoyé ds les params de requête), 2eme argument  nouvelle version de l'objet
    .then(() => res.status(200).json({message: 'Sauce modifiée'}))
    .catch(error => res.status(400).json({error}));
};
exports.deleteSauce = (req,res,next) =>{
    Sauce.findOne({ _id: req.params.id})//recherche de la sauce
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];//on decoupe l URL et on stocke le nom du fichier
        fs.unlink(`images/${filename}`, () => {//on supprime le fichier du server
            Sauce.deleteOne({ _id: req.params.id })//on supprime la sauce de la BDD 
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};