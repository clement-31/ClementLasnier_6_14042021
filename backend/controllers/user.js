const bcrypt = require("bcrypt"); //Permet de hasher et saler les mots de passe
const jwt = require("jsonwebtoken"); //Permet de créer un token utilisateur
const MaskData = require("../node_modules/maskdata");

const User = require("../models/user");

const passwordValidator = require("password-validator");
const schema = new passwordValidator(); //Création d'un schema pour obtenir des mots de passe plus sécurisés
schema
    .is().min(8) // minimum 8 caractères
    .has().digits(1) // minimum 1 chiffre
    .has().uppercase(1) // minimum 1 caractère majuscule
    .has().lowercase(1) // minimum 1 caractère minuscule
    .has().symbols(1) // minimum 1 symbole
    .has().not().spaces(); // ne doit pas contenir d'espace

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
    if (!schema.validate(req.body.password)) {
        //Renvoie une erreur si le schema de mot de passe n'est pas respecté
        res.status(401).json({ message: "Mot de passe pas assez sécurisé, il doit contenir au moins 8 caractères, un chiffre, une majuscule, une minuscule, un symbole et ne pas contenir d'espace !" });
        return false;
    }
    bcrypt
        .hash(req.body.password, 10) //On hashe le mot de passe et on le sale 10 fois
        .then((hash) => {
            const user = new User({
                email: MaskData.maskEmail2(req.body.email, emailMask2Options), //l'email est masqué
                password: hash, //le mot de passe est crypté
            });
            user
                .save() //on sauvegarde les données du nouvel utilisateur dans la base de données
                .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }));
};

//Connexion d'un utlisateur existant
exports.login = (req, res, next) => {
    console.log(process.env.JWT_SECRET_TOKEN);
    User.findOne({
        email: MaskData.maskEmail2(req.body.email, emailMask2Options),
    }) //On cherche l'email correspondant dans la collection
        .then((user) => {
            if (!user) {
                return res.status(404).json({error: "Utilisateur non trouvé !"});
            }
            bcrypt
                .compare(req.body.password, user.password) //on compare le mot de passe de la requête avec le hash de l'utilisateur
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
                            {expiresIn: "1h"}
                        ),
                    });
                })
                .catch((error) => res.status(500).json({error}));
        })
        .catch((error) => res.status(500).json({error}));
    };
