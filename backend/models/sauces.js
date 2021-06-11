const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId: { type : String, required : true},
    name: { type : String, required : true},
    manufacturer: { type : String, required : true},
    description: { type : String },
    mainPepper: { type : String },
    imageUrl: { type : String },
    heat: { type : Number },
    likes: { type : Number, default : 0 },
    dislikes: { type : Number, default : 0  },
    userLiked: { type : [String] },
    userDisliked: { type : [String] }
});

module.exports = mongoose.model('Sauce', sauceSchema);