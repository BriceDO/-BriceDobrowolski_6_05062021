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

            if(req.body.like == 1) {
                // Incrémentation des likes 
                sauce.likes += 1;
                // Rajout de l'user dans le tableau 
                sauce.userLiked.push(req.body.userId);
            } 
            
            if (req.body.like == -1) {
                // Incrémentation des dislikes
                sauce.dislikes += 1;
                // Rajout de l'user dans le tableau 
                sauce.userDisliked.push(req.body.userId);
            }

            if (req.body.like == 0) {
                
                if (sauce.userLiked.includes(req.body.userId)) {
                    // Décrémentation des likes
                    sauce.likes -= 1;
                    // Suppression de l'user dans le tableau
                    positionLiked = sauce.userLiked.indexOf(req.body.userId);
                    sauce.userLiked.splice(positionLiked, 1);

                } else if (sauce.userDisliked.includes(req.body.userId)) {
                    // Décrémentation des likes
                    sauce.dislikes -= 1;
                    // Suppression de l'user dans le tableau
                    positionDisliked = sauce.userDisliked.indexOf(req.body.userId);
                    sauce.userDisliked.splice(positionDisliked, 1);
                }
            }

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