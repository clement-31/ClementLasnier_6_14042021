const express = require ('express'); // Import du framework Express pour Node.js
const app = express(); // Applique le framework Express
const bodyParser = require('body-parser');
const mongoose = require("mongoose"); //Importe mongoose qui permet la création de modèle pour MongoDb

const path = require("path"); //Permet d'accéder aux chemins d'accès des fichiers
const xss = require('xss-clean');
const helmet = require('helmet'); //Importe helmet pour sécuriser les en-tête des requêtes
const mongoSanitize = require('express-mongo-sanitize'); //Import mongo-sanitize qui sert à empêcher l'injection de code dans les champs utilisateurs
const saucesRoutes = require('./routes/sauces'); //Importe le routeur pour les sauces
const userRoutes = require('./routes/user'); //Importe le routeur pour les utilisateurs
const rateLimit = require("express-rate-limit");


//Crée un environnement de variable pour db
require('dotenv').config();

//Connecte l'API à la base de données mongoDB grâce à mongoose
mongoose.connect(process.env.connection,
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//Définit les paramètres d'en-tête
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permet l'accès à l'API depuis n'importe quelle origine

    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Autorise les en-tête spécifiés

    //Permet l'utilisation des méthodes ci-dessous
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//Limite la taille du body
app.use(express.json({limit: "10kb" }));

//Permet de servir les fichiers statiques, présents dans le dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Sert les routes concernant les sauces pour toute demande vers le endpoint /api/sauces
app.use('/api/sauces', saucesRoutes);

//Sert les routes concernant les utilisateurs pour toutes demande vers le endpoint /api/auth
app.use('/api/auth', userRoutes);

app.use(xss());

//Applique les sous-plugins de helmet
app.use(helmet());

//Nettoie les champs utilisateurs des tentatives d'injection de code commençant par $ ou "."
app.use(mongoSanitize());

//Limite plusieurs sessions dans un temps limite pour éviter des attaques
app.use(rateLimit());

module.exports= app;