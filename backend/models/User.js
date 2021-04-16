const mongoose = require('mongoose');

//Permet de vérifier que le champ avec la propriété unique n'est pas déjà présent dans la base de données
const uniqueValidator = require('mongoose-unique-validator');

//Création d'un schéma de données grâce à mongoose avec les propriétés désirées
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Application d'un uniqueValidator au schema
userSchema.plugin(uniqueValidator);

//Exportation du schema en tant que modèle
module.exports = mongoose.model('User', userSchema);
