const mongoose = require('mongoose');
const { isEmail } = require('validator');

/* Dans le schéma, la valeur "unique", avec l'élément mongoose-unique-validator passé comme plug-in,
   s'assurera qu'aucun des deux utilisateurs ne peut partager la même adresse e-mail. */
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = mongoose.Schema({
    email: { type: String,
             required: [true, 'Veuillez entrer un email'],
             unique: true,
             validate: [isEmail, 'Veuillez entrer un email valide'] 
            },

    password: { type: String,
                required: [true, 'Veuillez entrer un mot de passe'],
            }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);