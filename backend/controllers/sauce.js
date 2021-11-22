//importation du model Sauce
const Sauce = require('../models/Sauce');
//module de gestion de fichiers(File System)
const fs    = require('fs');

exports.getAllSauces = (req,res,next) =>{
    //methode find pour renvoyer un tableau de ttes les sauces ds la BDD
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};

exports.getOneSauce = (req,res,next) =>{
    //trouve la sauce qui a le même ID que l ID paramètre de la requête
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(400).json({error}));
};

exports.createSauce = (req,res,next) =>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    //création d une nouvelle Sauce(mongoose crée par défaut un champ _id)
    const sauce = new Sauce({
       ...sauceObject ,
       //premier segment(HTTP),hôte du serveur(localhost), /images/ et le nom du fichier
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
       likes: 0,
       dislikes: 0,
       usersLiked: [],
       usersDisliked: []
    });
    // la méthode save() enregistre dans la collection "Sauces" de la BDD
    sauce.save()
    .then(() => res.status(201).json({ message : 'Sauce enregistrée'}))
    .catch(error => res.status(400).json({error}));
};

//gestion des likes
exports.likeSauce = (req,res,next) => {

    //récupération de l userID ds le corps de la requête
    const userId    = req.body.userId;

    //récupération de l'état du like (-1, 0, 1) ds le corps de la requête
    const likeState = req.body.like;

    //recherche de la Sauce concernée par l id du paramètre de la requête
    Sauce.findOne({ _id: req.params.id})
    .then(result => {        
       const sauce          = result; 

       //création de const pour stocker l'index de l'userId ds les tab(usersLiked ou usersDisliked)     
       const indexLike      = sauce.usersLiked.indexOf(userId);
       const indexDislike   = sauce.usersDisliked.indexOf(userId); 

       //si l'index est existant dans un des deux tableaux on supprime pour éviter les doublons     
       if (indexLike > -1)      {sauce.usersLiked.splice(indexLike, 1);}
       if (indexDislike > -1)   {sauce.usersDisliked.splice(indexDislike, 1);}

       //si like = 1 on ajoute userID au tab usersLiked
       if (likeState === 1)     {sauce.usersLiked.push(userId);}

       //si like = -1 on ajoute userID au tab usersDisliked
       if (likeState === -1)    {sauce.usersDisliked.push(userId);}   
       
       // le comptage des like et dislike est équivalent au nombre d'éléments du tab du même nom
       sauce.likes      = sauce.usersLiked.length;
       sauce.disLikes   = sauce.usersDisliked.length;
       
       //mise à jour de la Sauce avec modifications like
        Sauce.updateOne({ _id: req.params.id}, sauce)
        .then(() => res.status(200).json({message: 'likeSauce modifiée'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(400).json({error}));
};

exports.modifySauce = (req,res,next) => {
    // fihier existant?
    const sauceObject = req.file ? { ...JSON.parse(req.body.sauce),
        //si oui on traite la nouvelle image
        //premier segment(HTTP),hôte du serveur(localhost), /images/ et le nom du fichier 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`} 
        //sinon on traite l'objet entrant
    : {...req.body};
    // modifier une 'sauce'comparaison(id = id envoyé ds les params de requête), 2eme argument  nouvelle version de l'objet
    Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
    .then(() => res.status(200).json({message: 'Sauce modifiée'}))
    .catch(error => res.status(400).json({error}));
};

exports.deleteSauce = (req,res,next) =>{
    //recherche de la sauce par ID
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => {
        //on decoupe l URL et on stocke le nom du fichier
        const filename = sauce.imageUrl.split('/images/')[1];
        //on supprime le fichier du server
        fs.unlink(`images/${filename}`, () => {
            //on supprime la sauce de la BDD 
            Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
            .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
}