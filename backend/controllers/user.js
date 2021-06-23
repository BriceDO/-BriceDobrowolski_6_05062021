const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Pour l'enregistrement de nouveaux utilisateurs
exports.signup = (req, res, next) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
    
    if (!regex.test(req.body.password)) {
        res.status(400).json("Le mot de passe doit comporter au moins 6 caractères dont au moins un chiffre")
    } else {
        // Hasher le mot de passe
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            // Prend le mot de passe crypté et créé un nouvel utilisateur avec email et mot de passe
            const user = new User({
                email: req.body.email,
                password: hash
            });
            // Enregistre l'utilisateur dans la base de donnée
            user.save()
                .then(console.log(user))
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ "message erreur" : error.message }))
        })
        .catch(error => res.status(500).json({ "message erreur" : error.message }));
    } 
};

// Pour connecter les utilisateurs existants
exports.login = (req, res, next) => {
    // Trouver l'utilisateur dans la base de donnée grâce à l'email
    User.findOne({ email: req.body.email })
        .then(user => {
            // On vérifie s'il y a un utilisateur ou non
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // bcrypt va comparer le mot de passe avec le hash de la base de donnée
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    /* Si on a bien trouvé le mot de passe, on renvoie un status 200 et un objet json
                       qui contient un userID et un Token d'authentification grâce à jsonwebtoken */
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ "message" : error.message }));
        })
        // Uniquement si il y a un problème de connexion / base de donnée
        .catch(error => res.status(500).json({ "message" : error.message }));
};