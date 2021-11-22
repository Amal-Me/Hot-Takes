const mongoose = require('mongoose');

//utilisation de la méthode SCHEMA de mongoose pour créer un schéma de données
const sauceSchema = mongoose.Schema({
    userId : { type: String, required: true},
    name: { type: String, required: true},
    manufacturer: { type: String},
    description: { type: String},
    mainPepper: { type: String},
    imageUrl: { type: String},
    heat: { type: Number},
    likes: { type: Number},
    dislikes: { type: Number},
    usersLiked: { type: [String]},
    usersDisliked: { type: [String]}
});

module.exports = mongoose.model('Sauce', sauceSchema);
