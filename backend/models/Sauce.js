//Création d'un schéma de données grâce à mongoose avec les propriétés désirées
const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({

    name: { type: String, required: true, maxLength:15 },
    manufacturer: { type: String, required: true, maxLength:15},
    description: { type: String, required: true, minLength:10 },
    heat: { type: Number, required: true, max:10 },
    likes: { type: Number, required: true, default: 0 },
    dislikes: { type: Number, required: true, default:0 },
    imageUrl: { type: String, required: true },
    mainPepper: { type: String, required: true, maxLength:15 },
    usersLiked: { type: [String], required: true},
    usersDisliked: { type: [String], required: true},
    userId: { type: String, required: true },
});

//Exportation en tant que modèle
module.exports = mongoose.model('Sauce', sauceSchema);

