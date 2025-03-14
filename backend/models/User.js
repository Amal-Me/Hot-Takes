const mongoose = require('mongoose');

//pré-validation des informations(garantie l'unicité)
const uniqueValidator = require('mongoose-unique-validator');

//création d un schéma de données
const userSchema = mongoose.Schema({
    //mot-clé unique pour l'attribut email
    email: { type: String, required: true, unique: true},
    password:  { type: String, required: true}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);