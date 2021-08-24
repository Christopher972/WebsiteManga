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
        <h1>Le top du Pure Animé</h1>
        <span v-if = "posts.length < 1">Désolé aucune publication sur l'interface</span>
        <section id = "postsSection">
            <div  v-for="post in posts" :key="post._id">
                <figure class ="figurePost">
                    <div class= "figurePostItems" @click="imagePost(post._id)" :data-id="post._id">
                        <h4> {{ post.name }} </h4>
                        <img class="figureImage" v-if="post.imageUrl" :src="post.imageUrl" :alt="post._id"><br>
                        <p> Heat : {{ post.heat}}/10 </p>
                    </div>
                </figure>
            </div>
        </section>
        <h3 id="erreur" v-show="success===false"> Echec de la requête : {{ message }} </h3>
    </div> 
</template>

<script>
export default {
    name: 'Posts',
    data: function() {
        return {
            success: true, //affichage d'un message d'erreur si passe à false
            message :"", //message d'erreur
            id:"",
            token:"",
            posts: []
        }
    },
    mounted() {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            this.id = userInfo.id;
            this.token = userInfo.token;
            this.getAllPosts();
        } else {
            this.$router.push({ name: 'login' });
        }
    },
    methods: {
        getAllPosts() { /// Fonction appelée pour afficher toutes les publications 
            const data = {
                method: 'GET',
                headers:{'Authorization':`Bearer ${this.token}`}
            };
            fetch("http://localhost:3000/posts", data)
            .then (res => {
                if (res.status == 200) {
                    res.json()
                    .then (posts =>{
                        this.posts = posts;      
                    })
                } else {
                    this.success=false;
                    this.message = "Retente ta chance";
                } 
            })
            .catch (() => {
                this.success = false;
                this.message = "Désolé, le serveur ne répond pas ! Reviens vers nous ultérieurement";
            })  
        },
        disconnected() {
            localStorage.clear();
            this.$router.push({ name: 'login' });
        },
        imagePost(id) {
            this.$router.push({ path:`/post/${id}`}); 
        }
    },     
}
</script>
<style lang="scss">
.headerPosts
{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
#imagePirate{
    width: 150px;
}

#imageLogo{
    width: 250px;
}
#postsSection{
 display: flex;
 flex-flow: wrap;

}

.figureImage {
    max-width: 200px;
    max-height: 250px;
  }
  h4 {
    margin: 0;
    font-weight: 500;
  }
  p {
    margin: 0;
  }

.figurePostItems{
    text-align: center;
    width: 220px;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
        box-shadow: 1px 1px 20px rgba(120, 120, 120, 0.3);
    }
}

@media screen and (max-width:800px){
    #logo img
  {
    width: 100px;
  }

  #logoPirate img{
    width:  100px;
    margin: 30px;
  }
  #nav ul {
      padding: 5px;
  }
}
</style>