//Création d'un schéma de données grâce à Mongoose avec les propriétés désirées
const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    name: { type: String, required: true},
    manufacturer: { type: String, required: true},
    description: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, required: false, default: 0 },
    dislikes: { type: Number, required: false, default:0 },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true},
    usersLiked: { type: [String], required: false},
    usersDisliked: { type: [String], required: false},
    userId: { type: String, required: true },
});

//Exportation en tant que modèle
module.exports = mongoose.model('Sauce', sauceSchema);



