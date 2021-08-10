const mongoose = require('mongoose') //// Importation du package Mongoose

const postSchema = mongoose.Schema({ //// Création d'un schéma de données 
    id: { type: String, required: true},
    name: {type: String, required: true},
    description: { type: String, required: true},
    imageUrl: { type: String, required: true},
    heat: { type: Number, required: true},
    likes: { type: Number, default: 0},
    dislikes: { type: Number, default: 0},
    usersLiked: { type: [String], default: []},
    usersDisliked: { type: [String], default: []},
});

module.exports = mongoose.model('Post', postSchema);//// Exportation du schéma en tant que modèle Mongoose

