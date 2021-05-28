const bcrypt = require("bcrypt"); //Permet de hasher et saler les mots de passe
const jwt = require("jsonwebtoken"); //Permet de créer un token utilisateur
const MaskData = require("../node_modules/maskdata");

const User = require("../models/user");

const passwordValidator = require("password-validator");
const schema = new passwordValidator(); //Création d'un schema pour obtenir des mots de passe plus sécurisés
schema
    .is().min(8)
    .has().digits(1)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().symbols(1)
    .has().not().spaces();

//On masque l'email
const emailMask2Options = {
    maskWith: "*",
    unmaskedStartCharactersBeforeAt: 0,
    unmaskedEndCharactersAfterAt: 0,
    maskAtTheRate: false,
};

//Output: ********@**********

//Enregistrement d'un nouvel utilisateur
exports.signup = (req, res, next) => {

    //Vérification de l'intégrité des données
    if (!req.body.password || !req.body.email){
        return res.status(400).json({ message: "Bad request !"});
    }

    if (!schema.validate(req.body.password)) {
        //Renvoie une erreur si le schema de mot de passe n'est pas respecté
        return res.status(400).json({ message: "Le mot de passe doit contenir au moins 8 caractères, un chiffre, une majuscule, une minuscule, un symbole et ne pas contenir d'espace !" });
    }
    bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
            const user = new User({
                email: MaskData.maskEmail2(req.body.email, emailMask2Options),
                password: hash,
            });
            user
                .save()
                .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
                .catch((error) => res.status(500).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//Connexion d'un utlisateur existant
exports.login = (req, res, next) => {

    // Vérification de l'intégrité des données
    if (!req.body.password || !req.body.email){
        return res.status(400).json({ message: "Bad request !"});
    }

    User.findOne({
        email: MaskData.maskEmail2(req.body.email, emailMask2Options),
    }) //On cherche l'email correspondant dans la collection
        .then((user) => {
            if (!user) {
                return res.status(401).json({error: "Utilisateur non trouvé !"});
            }
            bcrypt
                .compare(req.body.password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).json({error: "Mot de passe incorrect !"});
                    }
                    return res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            //On attribue un token d'authentification
                            {userId: user._id},
                            process.env.JWT_SECRET_TOKEN,
                            {expiresIn: "60s"}
                        ),
                    });
                })
                .catch((error) => res.status(500).json({error}));
        })
        .catch((error) => res.status(500).json({error}));
    };
