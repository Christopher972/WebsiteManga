<template>
  <div class="createPost">
        <header class="headerPost">
            <div id="logo">
               
            </div>
            <nav id ="nav">
                <ul>
                    <li class ="disconnexion" @click="disconnected">Déconnexion</li>
                </ul>
            </nav> 
        </header>
    <!-- Formulaire de modification de publication -->
        <h1>Update ton Post</h1>
        <div id ="formModify">
            <form id="form" @submit.prevent="modifyPost()">
                <label for="title">Name</label>
                <input type="text" name="name" v-model="post.name" placeholder="Ton title" id="title" minlength="8" maxlength= "49" required>
                <label for="postContent">Description</label>
                <textarea type="text" name="description" v-model="post.description" placeholder="Open your mind..." id="description" maxlength="1000"></textarea>
                <label for="imageUrl" class="fileUpload"><i class="fa fa-upload" aria-hidden="true"></i> Download Image </label>
                <input @change ="checkImagePost()" type="file" ref="file" id="imageUrl" name="imageUrl" accept="image/*">
                <img :src="post.imageUrl" :alt="post._id" class="image-preview_post"> 
                <label for="heat">Heat</label>
                <input type="range" class="range" min="1" max="10" id="heat" v-model="post.heat">
                <input type="number" class="number" v-model="post.heat">  
                <input type="submit" id="postModify" value= "Publier">
            </form>
        </div>
        <div class ="buttonPost">
            <button class="back" @click="back">BACK</button>
            <button class="delete" @click="deletePost">DELETE</button>
            <p id="erreur" v-show="success===false"> Echec de la modification du Post : {{message}} </p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'modifyPost',
    data: function() {
      return {
        success: true, //affichage d'un message d'erreur si passe à false
        message :"", //message d'erreur
        id:"",
        token:"",
        imageUrl:"",
        post: {},
        imageLoaded: false
      }
    },
    mounted() {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
          this.id = userInfo.id;
          this.token = userInfo.token;
          this.onePost();
            
        } else {
            this.$router.push({ name: 'login' });
        }
    },
    methods: {
          onePost() {  //// Fonction appelée pour obtenir une publication spécifique 
            const dataGetPost = {
                method: 'GET',
                headers:{'Authorization':`Bearer ${this.token}`}
            };
            this._id= this.$route.params._id;
            fetch(`http://localhost:3000/posts/${this._id}`, dataGetPost)
            .then (res => {
                if (res.status == 200) {
                    res.json()
                    .then (post =>{
                        this.post = post;      
                    })
                } else {res.json ().then (() => {
                    // this.$router.push({ name: 'login' });
                    })} 
            })
            .catch (() => {
                this.waiting=false;
                this.success= false;
                this.message = "Désolé, le serveur ne répond pas ! Veuillez réessayer ultérieurement";
            })  
        },
        checkImagePost() { //Fonction appelée pour visualiser l'image 
            let imageToCheckPost = this.$refs.file.files[0];
            if (imageToCheckPost) {
                const reader = new FileReader();
                this.imageToChecPost = true;
                reader.addEventListener("load", function() {
                document.getElementsByClassName('image-preview_post')[0].setAttribute("src", this.result);
            });
                reader.readAsDataURL(imageToCheckPost);
            }
           
        },
       modifyPost() { ///// Fonction appelée pour modifier la publication 
            const imageUrl = this.$refs.file.files[0];
            const post ={"_id":this.post._id, "id":this.post.id, "name":this.post.name, "description":this.post.description, "imageUrl":this.post.imageUrl, "heat":this.post.heat };
            if (! imageUrl){
                var dataPost =null;
                dataPost = {
                    method: 'PUT',
                    body: JSON.stringify(post),
                    headers: {'content-type': 'application/json', 'Authorization':`Bearer ${this.token}`}
                }
            } else {
                let formData = new FormData();
                formData.append('post', JSON.stringify(post))
                formData.append('image', imageUrl);
                dataPost = {
                    method: 'PUT',
                    body: formData,
                    headers: {'Authorization':`Bearer ${this.token}`}
                }
            }
                fetch(`http://localhost:3000/posts/${this.$route.params._id}`, dataPost) 
                .then (res => {
                    if (res.status == 200) {
                        res.json()
                        .then (post =>{
                            this.post = post;
                            this.success = true;
                            this.$router.push({ name: 'posts' })
                            alert('publication modifiée'); 
                        }) 
                    } else {
                        this.success=false;
                        this.message = "Veuillez réessayer";
                    }
                })
                .catch (() => {
                    this.success= false;
                    this.message = "Désolé, le serveur ne répond pas ! Veuillez réessayer ultérieurement";
                })     
        },
        deletePost() { //// Fonction appelée pour supprimer la publication sur l'interface 
            const dataDeletePost = {
                method: 'DELETE',
                headers:{'Authorization':`Bearer ${this.token}`}
            };
            let confirmation = confirm("Ta publication sera supprimé définitivement sur l'interface");
            if (confirmation == true) {
                this._id= this.$route.params._id;
                fetch(`http://localhost:3000/posts/${this._id}`, dataDeletePost)   
                .then (res => {
                    if (res.status == 200) {
                        res.json()
                        .then (post =>{
                            this.post = post;
                             this.$router.push({ name: 'posts' });     
                        })
                    } else {
                        this.success=false;
                        this.message = "Veuillez réessayer";
                    } 
                })
                .catch (() => {
                    this.waiting=false;
                    this.success= false;
                    this.message = "Désolé, le serveur ne répond pas ! Veuillez réessayer ultérieurement";
                })  
            }    
        },
        back() {
            this.$router.push({ name: 'posts' });
        },
        disconnected() {
            localStorage.clear();
            this.$router.push({ name: 'login' });
        } 
    }
} 
</script>

<style lang = "scss">

/* button {
    margin: 1em 1em 0 0;
    box-shadow: 3px 1px 2px; 
    font-weight: bold;
    cursor: pointer;
  } */
</style>
