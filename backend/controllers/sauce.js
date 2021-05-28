const Sauce = require("../models/sauce"); //Importation du modèle de sauce
const fs = require("fs"); //Système de gestion de fichier de Node

exports.createSauce = (req, res, next) => {
    //Créer une sauce
    if(!req.body.name || !req.body.imageUrl || !req.body.id || !req.body.manufacturer || !req.body.description || !req.body.mainPepper
        || !req.body.heat || !req.body.likes || !req.body.dislikes || !req.body.usersLiked || !req.body.usersDisliked
        || !req.body.userId) {
        return res.status(400).json({ message: "Bad request !"});
    }

    const sauceObject = JSON.parse(req.body.sauce); // extraire l'object JSON
    delete sauceObject._id; //retire l'id généré automatiquement par MongoDb
    const sauce = new Sauce({
        ...sauceObject, //Utilise l'opérateur spread pour copier les infos du corps de la requête
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, //On génère l'url par rapport à son nom de fichier
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisLiked: []
    });
    sauce
        .save() //Sauvegarde la nouvelle sauce dans la base de données
        .then(() => res.status(201).json({ message: `Votre sauce est enregistrée !` }))
        .catch((error) => res.status(500).json({ error }));
};

//Modifier une sauce
exports.modifySauce = (req, res, next) => {
    if(!req.body.name || !req.body.imageUrl || !req.body.id || !req.body.manufacturer || !req.body.description || !req.body.mainPepper
        || !req.body.heat || !req.body.likes || !req.body.dislikes || !req.body.usersLiked || !req.body.usersDisliked
        || !req.body.userId) {
        return res.status(400).json({ message: "Bad request !"});
    }

    if (req.file) {
        Sauce.findOne({ _id: req.params.id }).then((sauce) => {
            const fileName = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${fileName}`, (err) => {
                //On supprime l'ancienne image
                if (err) throw err;
                console.log("Image supprimée: " + fileName);
            });
        });
    }
    const sauceObject = req.file? {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
        }
        : { ...req.body };
    Sauce.updateOne(
        { _id: req.params.id },
        { ...sauceObject, _id: req.params.id }
    )
        .then(() => res.status(200).json({ message: `Votre sauce a bien été modifiée !` }))
        .catch((error) => res.status(500).json({ error }));
};


//Supprimer une sauce
exports.deleteSauce = (req, res, next) => {
    if(!req.params.id) {
        return res.status(400).json({ message: "Bad request !"});
    }

    Sauce.findOne({ _id: req.params.id }) //Trouve la sauce correspondant à l'id
        .then((sauce) => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                //on supprime l'image du dossier images
                Sauce.deleteOne({ _id: req.params.id }) //et supprime la sauce de la collection
                    .then(() => res.status(200).json({ message: `Votre sauce a bien été supprimée !` }))
                    .catch((error) => res.status(500).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};


//Récupérer une sauce
exports.getOneSauce = (req, res, next) => {
    if(!req.params.id) {
        return res.status(400).json({ message: "Bad request !"});
    }

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(500).json({ error }));
};


//Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    if(!req.body.name || !req.body.imageUrl || !req.body.id || !req.body.manufacturer || !req.body.description || !req.body.mainPepper
        || !req.body.heat || !req.body.likes || !req.body.dislikes || !req.body.usersLiked || !req.body.usersDisliked
        || !req.body.userId){
        return res.status(400).json({ message: "Bad request !"});
    }

    Sauce.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch((error) => res.status(500).json({ error }));
};


//Incrémentation des likes et dislikes des sauces
exports.likeDislikeSauce = (req, res, next) => {
    if(!req.body.like || !req.body.userId || !req.params.id){
        return res.status(400).json({ message: "Bad request !"});
    }

    const like = req.body.like;
    const userId = req.body.userId;
    const id = req.params.id;

    //Définit le statut de like (1,-1,0,defaut)
    switch (like) {

        case 0:
            Sauce.findOne({ _id: id })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.updateOne(
                            { _id: id },
                            {
                                $inc: { likes: -1 }, //On décrémente likes
                                $pull: { usersLiked: userId }, //On sort l'utilisateur du tableau usersLiked
                                _id: req.params.id,
                            }
                        )
                            .then(() => {res.status(201).json({ message: `Vote annulé  pour la sauce ${sauce.name}` });
                            })
                            .catch((error) => res.status(500).json({ error }));
                    }
                    if (sauce.usersDisliked.includes(userId)) {
                        Sauce.updateOne(
                            { _id: id },
                            {
                                $inc: { dislikes: -1 }, //On décrémente dislikes
                                $pull: { usersDisliked: userId }, //On sort l'utilisateur du tableau usersDisliked
                            }
                        )
                            .then(() =>res.status(201).json({ message: `Vote annulé  pour la sauce ${sauce.name}` })
                            )
                            .catch((error) => res.status(500).json({ error }));
                    }
                })
                .catch((error) => res.status(500).json({ error }));
            break;

        case 1: //L'utilisateur aime la sauce
            Sauce.updateOne(
                { _id: id },
                {
                    $inc: { likes: 1 }, //On incrémente les likes
                    $push: { usersLiked: userId }, //On ajoute l'utilisateur au tableau usersLiked
                }
            )
                .then(() =>res.status(201).json({ message: `Votre like a bien été pris en compte !` })
                )
                .catch((error) => res.status(500).json({ error }));
            break;

        case -1: //L'utilisateur n'aime pas la sauce
            Sauce.updateOne(
                { _id: id },
                {
                    $inc: { dislikes: 1 }, //On incrémente les dislikes
                    $push: { usersDisliked: userId }, //On ajoute l'utilisateur au tableau usersDisliked
                }
            )
                .then(() =>res.status(201).json({ message: `Votre dislike a bien été pris en compte !` })
                )
                .catch((error) => res.status(500).json({ error }));
            break;

        default:
            return res.status(400).json({ message: "Bad request"});
        }
    };

