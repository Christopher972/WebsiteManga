<template>
    <div class="createPost">
        <header class="headerPosts">
            <div id="logo">
                <img alt="Vue logo" src="../assets/flamme.jpg" id ="imageLogo">
            </div>
            <div id="logoPirate">
                <img alt="logo pirate" src="../assets/pirate.png" id ="imagePirate">    
            </div>
            <nav id ="nav">
                <ul>
                    <li class ="create"><router-link to = "/createPost">Add Ton Post</router-link></li>
                    <li class ="disconnexion" @click="disconnected">Déconnexion</li>
                </ul>
            </nav>
        </header>
        <h1>Read With Calm Down!</h1>
        <section id = "postsSection">
            <div class="figOne">
                <figure id="figOneImage">
                    <img class="oneImage" :src="post.imageUrl" :alt="post._id">
                </figure>
                <figcaption>
                    <h2 id="name">{{ post.name }}</h2>
                    <h3>Description</h3>
                    <p class="description">{{ post.description }}</p>
                    <div class="likeButtons" >
                        <div class="likes" >
                           <i class="like fas fa-thumbs-up liked" @click="likePost"></i>
                            <span>{{ post.likes }}</span>
                        </div>
                        <div class="dislikes">
                            <i class="dislike fas fa-thumbs-down disliked" @click="dislikePost"  ></i>
                            <span>{{ post.dislikes }}</span>
                        </div>
                    </div>
                    <div class="controlButtons">
                        <button class="back" @click="back">BACK</button>
                        <button class="modify" v-if="post.canUpdate" @click="modify">MODIFY</button>
                        <button class="delete" v-if="post.canDelete" @click="deletePost">DELETE</button>
                    </div> 
                </figcaption> 
            </div> 
            
            <h3 id="erreur" v-show="success===false"> Echec de la connexion : {{message}}</h3>     
        </section>
    </div>
</template>

<script>
export default {
    name: 'Post',
    data: function() {
        return {
            success: true, //affichage d'un message d'erreur si passe à false
            message :"", //message d'erreur
            id:"",
            token:"",
            likes:"",
            dislikes:"",
            post: {},
            imageLoaded: false
        }
    },
      mounted() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            this.id = userInfo.id;
            this.token = userInfo.token;
            this.postDetails(); 
             
        }
        else {
            this.$router.push({ name: 'login' });
        }
    },
    methods: {
        postDetails() { /// Fonction appelée pour obtenir une publication spécifique 
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
                        post.canUpdate = post.id == this.id;
                        post.canDelete = post.id == this.id;
                        if (post.usersLiked.find(user => user === this.id)) {
                            this.liked = true;
                        } else if (post.usersDisliked.find(user => user === this.id)) {
                            this.disliked = true;
                        } 
                    })
                    
                } else {
                    alert('Erreur' +  res.status  + '. Veuillez réessayer');
                } 
            })
            .catch (() => {
                this.success = false;
                this.message = "Désolé, le serveur ne répond pas ! Veuillez réessayer ultérieurement";
            })  
        },
        likePost(){
             if (this.disliked) {
                return 0;
            }
            const liked = !this.liked;
            const dataGetLikePost = {
                method: 'POST',
                body: JSON.stringify({ userId: this.id,  like: liked ? 1 : 0}),
                headers: {'Content-Type': 'application/json', 'Authorization':`Bearer ${this.token}`}
            };
           
            this._id= this.$route.params._id;
            fetch(`http://localhost:3000/posts/${this._id}/like`, dataGetLikePost)
            .then (res => {
                if (res.status == 200) {res.json ()
                   .then (message=> {
                       console.log(message);
                        this.liked = liked;
                        if (liked) {
                            this.post.likes++;
                        } else {
                            this.post.likes--;
                        }
                        this.success= true; 
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
        dislikePost(){
              if (this.liked) {
                return 0;
            }
             const disliked = !this.disliked;
            const dataGetDislikePost = {
                method: 'POST',
                body: JSON.stringify({ "userId": this.id, like: disliked ? -1 : 0}),
                headers: {'Content-Type': 'application/json', 'Authorization':`Bearer ${this.token}`}
            };
          
            this._id= this.$route.params._id;
            fetch(`http://localhost:3000/posts/${this._id}/like`, dataGetDislikePost) 
            .then (res => {
                if (res.status == 200) {res.json ()
                    .then (message => {
                        console.log(message)
                        this.disliked = disliked;
                        if (disliked) {
                            this.post.dislikes++;
                        } else {
                            this.post.dislikes--;
                        }
                        this.success = true;    
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
        modify() {/// Redirection pour modifier ou une publication 
            this.$router.push({ path:`/modify/${this.$route.params._id}` });    
        },
        deletePost() { //// Fonction appelée pour supprimer la publication sur l'interface 
            const dataDeletePost = {
                method: 'DELETE',
                headers:{'Authorization':`Bearer ${this.token}`}
            };
            let confirmation = confirm("Votre pulication sera supprimé définitivement sur l'interface");
            if (confirmation == true) {
                fetch(`http://localhost:3000/posts/${this.$route.params._id}`, dataDeletePost)   
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
section > .figOne
{
     margin-left: 40px; 
    font-size:15px;
    font-weight: bold;
    color:rgb(31, 30, 30);
    text-decoration: none;
    border-radius: 10px;
    background-color:silver;
    padding: 6px 12px;
    width: 90%;
    margin-bottom: 20px;
}

#name
{
    font-family: Jazz LET, fantasy;
    background: none;
    color:rgb(31, 30, 30);
    box-shadow: 3px 1px 1px;
}

.description{
    text-align: justify;
}

.figOne{
 display: flex;
}
.oneImage{
   vertical-align: middle;
    border-style:none;
    width:300px;
    margin-top:70px;
}
figcaption{
    padding: 15px 10px;
}

.likeButtons{
    display: flex;
    margin-right: 20px;
    margin-top: 15px;
    
}

.likes{
    margin-right: 20px;
}

.liked{
    margin-right: 10px;
    color: green;
    cursor: pointer;
}

.disliked{
     margin-right: 10px;
     color: red;
    cursor: pointer;
}

.liked {
  &:hover {
    color: rgba(51, 219, 0, 1);
  }
}

.disliked {
  transform: scaleX(-1) translateY(2px);
  &:hover {
    color: rgba(219, 51, 0, 1);
  }
}

.modify{
    background: yellow;
}
.delete{
    background: red;
}
@media screen and (max-width:800px){
 section > .figOne
  {
    margin: auto;
  }
 .figOne
 {
    flex-direction: column;
    width: 100%; 
  }
   
   #figOneImage img{
    width:  250px;
    margin: 0px;
  }
}

</style>