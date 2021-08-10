const express = require('express'); /// Importation de l'application express
const router = express.Router(); //// Création du Routeur

const auth = require('../middleware/auth'); //// Importation du middleware d'authentification 
const multer = require('../middleware/multer-config'); //// Importation du middleware multer
const postCtrl = require('../controllers/post');////// Importation de la logique métier ddes routes 


router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, multer, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:id', auth, postCtrl.getOnePost);
router.post('/:id/like', auth, postCtrl.likePost);

module.exports = router; //// Exportation du router du fichier 