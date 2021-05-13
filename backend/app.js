const express = require("express"); //Import du framework express pour node.js
const mongoose = require("mongoose"); //Importe Mongoose qui permet la création de modèle pour mongoDB
const helmet = require("helmet");//Importe helmet pour sécuriser les en-têtes des requêtes
const cookieSession = require('cookie-session');
const mongoSanitize = require('express-mongo-sanitize');//Import mongo-sanitize qui sert à empêcher l'injection de code dans les champs utilisateurs
const path = require('path');//Permet d'accéder aux chemins d'accès des fichiers
const xssClean = require("xss-clean");
require('dotenv').config();//Permet de créer un environnement de variables
console.log(process.env);
const sauceRoutes = require('./routes/sauce');//Importe le routeur pour les sauces
const userRoutes = require('./routes/user');//Importe le routeur pour les utilisateurs
const bodyParser= require('body-parser');

//Connecte l'API à la base de données MongoDB grâce à Mongoose
mongoose.connect(
    'mongodb+srv://newuserP6:P6Xolosa31@clusterp6.whu2r.mongodb.net/Projet6OC?retryWrites=true&w=majority',
    { useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true}
)
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express(); //Applique le framework express

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
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
});

// Options pour la sécurité des cookies
//Les cookies de session sont donc utilisés pour stocker des informations sur la session en cours.
//ils utilisent des cookies de session pour se souvenir d’un utilisateur pendant une période limitée.
const expireDate = new Date(Date.now()+ 3600000); //1 heure (60*60*1000)
app.use(cookieSession({
    name : 'session',
    secret : process.env.SECRET_SES,
    cookie: {
        secure: true,
        httpOnly: true,
        domain: 'http://localhost:3000',
        expires: expireDate
    }
}));

app.use(helmet());//Applique les sous-plugins de helmet

//Permet de récupérer le corps de la requête au format json
app.use(express.json());

//Transforme les données arrivant des requêtes POST en objet JSON
app.use(bodyParser.json());

//Nettoie les champs utilisateurs des tentatives d'injection de code commençant par "$" ou "."
app.use(mongoSanitize());

//Protection contre les attaques XSS
app.use(xssClean());

app.use('/images', express.static(path.join(__dirname, 'images')));//Permet de servir les fichiers statiques présents dans le dossier images

app.use('/api/sauces', sauceRoutes);//Sert les routes concernant les sauces pour toute demande vers le endpoint /api/sauces
app.use('/api/auth', userRoutes);//Sert les routes concernant les utilisateurs pour toute demande vers le endpoint /api/auth

module.exports = app;
