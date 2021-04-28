const express = require("express"); //Import du framework express pour node.js
const mongoose = require("mongoose"); //Importe Mongoose qui permet la création de modèle pour mongoDB
const helmet = require("helmet");//Importe helmet pour sécuriser les en-têtes des requêtes
const mongoSanitize = require('express-mongo-sanitize');//Import mongo-sanitize qui sert à empêcher l'injection de code dans les champs utilisateurs
const path = require('path');//Permet d'accéder aux chemins d'accès des fichiers
require('dotenv').config();//Permet de créer un environnement de variables

const sauceRoutes = require('./routes/sauce');//Importe le routeur pour les sauces
const userRoutes = require('./routes/user');//Importe le routeur pour les utilisateurs

const app = express(); //Applique le framework express
app.use(helmet());//Applique les sous-plugins de helmet

mongoose //Connecte l'API à la base de données MongoDB grâce à Mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_CLUSTER}.6vps7.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

//Définit les paramètres d'en-tête
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); //Permet l'accès à l'API depuis n'importe quelle origine
    res.setHeader(
        //Autorise les en-têtes spécifiés
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        //Permet l'utilisation des méthodes définies ci-dessous
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});

//Permet de récupérer le corps de la requête au format json
app.use(express.json());

//Nettoie les champs utilisateurs des tentatives d'injection de code commençant par "$" ou "."
app.use(mongoSanitize());

app.use('/images', express.static(path.join(__dirname, 'images')));//Permet de servir les fichiers statiques présents dans le dossier images

app.use('/api/sauces', sauceRoutes);//Sert les routes concernant les sauces pour toute demande vers le endpoint /api/sauces
app.use('/api/auth', userRoutes);//Sert les routes concernant les utilisateurs pour toute demande vers le endpoint /api/auth

module.exports = app;
