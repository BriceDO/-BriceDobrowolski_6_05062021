const Sauce = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ... sauceObject, _id : req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

exports.likeAction = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            // Modification de la sauce avant de la mettre à jour dans la base de données
            // Empêcher le user de liker et de disliker plusieurs fois
            if (sauce.userLiked.includes(req.body.userId)){
                console.log('Vous avez déjà liké cette sauce');  
            }

            if(req.body.like == 1){

                // On regarde si l'user est présent dans le tableau
                if (sauce.userLiked.includes(req.body.userId)){
                    console.log('Vous avez déjà liké cette sauce');  
                } else {
                    // Si like = 1, on ajoute le user dans le tableau userLiked
                    sauce.userLiked.push(req.body.userId);
                }

            } else if (req.body.like == 0) {
                // Sinon si like = 0, on enlève le userID des deux tableaux
                positionLiked = sauce.userLiked.indexOf(req.body.userId);
                sauce.userLiked.splice(positionLiked, 1);

                positionDisliked = sauce.userDisliked.indexOf(req.body.userId);
                sauce.userDisliked.splice(positionDisliked, 1);

            } else if (req.body.like == -1){
                // On regarde si l'user est présent dans le tableau
                if (sauce.userDisliked.includes(req.body.userId)){
                    console.log('Vous avez déjà disliké cette sauce');  
                } else {
                    // Si dislike = -1, on ajoute le user dans le tableau userDisliked
                    sauce.userDisliked.push(req.body.userId);
                };
            }

            //mise à jour du nombre de like et de dislike
            sauce.likes = sauce.userLiked.length;
            sauce.dislikes = sauce.userDisliked.length;

            // Mise à jour dans la base de données avec updateOne
            Sauce.updateOne({ _id: req.params.id }, sauce)
            .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
            .catch(error => res.status(400).json({ error }));

        })
        .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    // Trouver l'objet dans la base de données
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // On extrait le nom du ficher à supprimer
            const filename = sauce.imageUrl.split('/images/')[1];
            // On le supprime avec fs.unlink
            fs.unlink(`images/${filename}`, () => {
                // On le supprime de la base de données
                Sauce.deleteOne({ _id: req.params.id })
                .then((() => res.status(200).json({ message: 'Sauce supprimée !' })))
                .catch(error => res.status(400).json({ error }));
            })
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json( sauce ))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};