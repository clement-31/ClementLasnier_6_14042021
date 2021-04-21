const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
// Analyse la sauce en utilisant une chaîne de caractères

    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    console.log(sauceObject);
    const sauce= new Sauce({
        ...sauceObject,
//Capture et enregistre l'image en définissant correctement son image URL
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
//Remet les sauces aimées et celles détestées à 0
        likes: 0,
        dislikes: 0,
//  et les sauces usersliked et celles usersdisliked aux tableaux vides
        usersLiked: [],
        usersDisliked: [],
    });
//Enregistre la sauce dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
// Renvoie le tableau de toutes les sauces dans la base de données
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

exports.getOneSauce = (req, res, next) => {
// Renvoie la sauce avec l'ID fourni

    Sauce.findOne({
        _id: req.params.id
    }).then(
        (sauce) => {
            res.status(200).json(sauce);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifySauce = (req, res, next) => {
//Met à jour la sauce avec l'identifiant fourni.

    const sauceObject = req.file ?
        {
//Si une image est téléchargée, capturez-la et mettez à jour l'image URL des sauces.
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            /*Si aucun fichier n'est fourni, les détails de la sauce figurent directement dans le
            corps de la demande*/
        }: { ...req.body };
//Si un fichier est fourni, la sauce avec chaîne est en req.body.sauce.


    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })

        .then(() => res.status(200).json({ message: 'Recette modifiée !'}))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
// Supprime la sauce avec l'ID fourni.

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Recette supprimée !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.like = (req, res, next) => {
    const sauceObject = req.body;
//Définit le statut "j'aime" pour userID fourni.

    let likes = req.body.like;
    let userId = req.body.userId;
    delete sauceObject._id;

//Si j'aime = 1, l'utilisateur aime la sauce.
    if (likes === 1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { likes: +1 },
//L'identifiant de l'utilisateur doit être ajouté en gardant une trace de ses préférences
                $push: { usersLiked: userId },
            }
        )
            .then(() => res.status(200).json({ message: "Vous aimez cette sauce !" }))
            .catch((error) => res.status(400).json({ error }));

//Si j'aime = -1, l'utilisateur n'aime pas la sauce.
    } else if (likes === -1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $inc: { dislikes: +1 },
//L'identifiant de l'utilisateur doit être ajouté en gardant une trace de ses préférences
                $push: { usersDisliked: userId },
            }
        )
            .then(() => res.status(200).json({ message: "Vous n'aimez pas cette sauce !" }))
            .catch((error) => res.status(400).json({ error }));
    } else {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                console.log(sauce);

//Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
                if (sauce.usersLiked == userId) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
//L'identifiant de l'utilisateur doit être supprimé en gardant une trace de ses préférences
                            $inc: { likes: -1 },
                            $pull: { usersLiked: userId },
                        }
                    )
                        .then(() => res.status(200).json({ message: " Vous n'aimez plus cette sauce !" }))
                        .catch((error) => res.status(400).json({ error }));
                } else if (sauce.usersDisliked == userId) {
                    Sauce.updateOne(
                        { _id: req.params.id },
                        {
//L'identifiant de l'utilisateur doit être supprimé en gardant une trace de ses préférences
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId },
                        }
                    )
                        .then(() => res.status(200).json({ message: " Dislike retiré !" }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    }
};
