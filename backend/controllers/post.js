const Post = require('../models/Post');///// Importation du modèle schéma Post 
const fs = require('fs');///// Importation du package file-system

exports.createPost = (req, res, next) =>{////// Exportation de la route post 
    const postObject = JSON.parse(req.body.post); //// Récupération des informations de l'objet 
    delete postObject._id;
    const post = new Post({
      ...postObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//// Pour générer l'Url de l'image
    });
    post.save()
      .then(() => res.status(201).json({ message: 'Publication enregistrée!'}))
      .catch(error => res.status(400).json({ error }));
};

exports.modifyPost = (req, res, next) =>{//// Exportation de la route put 
    const postObject = req.file ?//// création de l'objet sauce et utilisation d'un opérateur ternaire
    {
      ...JSON.parse(req.body.post),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`//// Traitement de la nouvelle image 
    } : { ...req.body }; //// traitement uniquement de l'objet
    Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })//// mise à jour de l'objet dans la base de données
      .then(() => res.status(200).json({ message: 'Publication modifiée !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.deletePost = (req, res, next) =>{ ///// Exportation de la route delete
    Post.findOne({ _id: req.params.id }) /// Trouver l'objet dans la base de donnée
        .then(post => {
            const filename = post.imageUrl.split('/images/')[1]; //// Extraction du nom du fichier à supprimer
            fs.unlink(`images/${filename}`, () => {//// Suppression du fichier
                Post.deleteOne({ _id: req.params.id })//// Suppression de l'objet dans la base de donnée
                .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
                .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOnePost = (req, res, next) =>{//// Exportation de la route get, ciblage de paramètre de requête
    Post.findOne({_id: req.params.id}).then((post) => {
        res.status(200).json(post);
    })
    .catch((error) => {
        res.status(404).json({
            error: error
        });
    });
};

exports.likePost = (req, res, next) =>{///// Exportation da la route like/dislike 
    Post.findOne({ _id: req.params.id })
        .then(post => {
            console.log(req.body);
            switch(req.body.like){
                case -1:
                    post.dislikes = post.dislikes++;
                    post.usersDisliked.push(req.body.userId);
                    postObject = {
                        "dislikes": post.usersDisliked.length,
                        "usersDisliked": post.usersDisliked
                    }
                    
                    break;
                case 0:

                    if(post.usersDisliked.find(user => user === req.body.userId)) {
                        console.log("if");
                        post.usersDisliked = post.usersDisliked.filter(user => user !== req.body.userId);
                        post.dislikes = post.dislikes--;
                        postObject = {
                            "dislikes": post.usersDisliked.length,
                            "usersDisliked": post.usersDisliked
                        }
                    }else{
                        post.usersLiked = post.usersLiked.filter(user => user !== req.body.userId);
                        console.log("else");
                        post.likes = post.likes--;
                        postObject = {
                            "likes": post.usersLiked.length,
                            "usersLiked": post.usersLiked

                        }  
                    }
                    break;
                case +1:
                    post.likes = post.likes++;
                    post.usersLiked.push(req.body.userId);
                    postObject = {
                        "likes": post.usersLiked.length,
                        "usersLiked": post.usersLiked
                    }
                    break;
                default:
                    return res.status(500).json({ error });
            }
            console.log(postObject);
            Post.updateOne({ _id: req.params.id }, { ...postObject, _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Post modifié !' }))
                .catch(error => res.status(400).json({ error }));
        })
    .catch(() => res.status(400).json({ error: 'Post non trouvée !' }));
}

exports.getAllPosts = (req, res, next) =>{ //// Exportation de la route get globale 
    Post.find().then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
        res.status(400).json({
            error: error
        });
    });
};
