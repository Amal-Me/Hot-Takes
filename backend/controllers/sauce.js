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
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
       likes: 0,
       dislikes: 0,
       usersLiked: [],
       usersDisliked: []
    });
    sauce.save()
    .then(() => res.status(201).json({ message : 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({error}));
};
exports.likeSauce = (req,res,next) => {
    const userId = req.body.userId;
    const like = req.body.like;
    Sauce.findOne({ _id: req.params.id})
    .then(result => {        
       const sauce = result;
       console.log(sauce);
       const indexLike = sauce.usersLiked.indexOf(userId);
       const indexDislike = sauce.usersDisliked.indexOf(userId); 
             
       if (indexLike > -1)      {sauce.usersLiked.splice(indexLike, 1);}
       if (indexDislike > -1)   {sauce.usersDisliked.splice(indexDislike, 1);}
       if (like === 1)          {sauce.usersLiked.push(userId);}
       if (like === -1)         {sauce.usersDisliked.push(userId);}   

       sauce.likes      = sauce.usersLiked.length;
       sauce.disLikes   = sauce.usersDisliked.length;
       
       Sauce.updateOne({ _id: req.params.id}, sauce)
        .then(() => res.status(200).json({message: 'likeSauce modifiée'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(500).json({error}));
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
}