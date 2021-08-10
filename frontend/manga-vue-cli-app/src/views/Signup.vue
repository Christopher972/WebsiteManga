<template>
  <div class="signup">
    <header class="header">
      <div id="logo">
        
      </div>
    </header>
    <h1> Welcome On WebSite Manga! </h1>
    <h2> Crée ton compte </h2>

    <!-- Formulaire de création de compte -->
    <main id="formId">
      <form id="form" @submit.prevent="formSend">
        <label for="e-mail">Adresse E-mail</label>
        <input type="email" name="e-mail" v-model="email" id="e-mail" required>
        <label for="password">Mot de Passe </label>
        <input  type="password" name="password" v-model="password" id="password">  
        <p v-show="submitted && ! password" class="invalid-feedback">Votre mot de passe doit contenir 8 caractères, au moins une Majuscule, une minuscule et un nombre !</p>
        <input type="submit" id="userSignup" value="Enregistrer">
      </form>
      <p id="erreur" v-show="success===false"> Echec de l'inscription : {{ message }} </p>
      <div id="account">
        <p> Déjà un compte ? <router-link to="/login">Se connecter</router-link> </p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data: function() {
    return {
      success: true, //affichage d'un message d'erreur si passe à false
      message :"", //message d'erreur
      email:"",
      password:"",
      submitted: false  
    }
  },
  methods: {
    formSend() {///// Fonction appelée lors de la soumission du formulaire à l'API

      const email = this.email;
      const password = this.password;
      this.submitted = true;
      const user = {"email":email, "password":password};
      const data = {
        method: 'POST',
        body: JSON.stringify(user),
        headers: {'Content-Type': 'application/json'}
      };
      fetch("http://localhost:3000/auth/signup", data)
      .then (res => {
        if (res.status == 201) {
          this.success=true;
          this.$router.push({ name: 'login' });
        } else {
          this.success=false;
          this.message = "Veuillez vous réinscrire";
        }
      })
      .catch (() => {
        this.success= false;
        this.message = "Désolé, le serveur ne répond pas ! Veuillez réessayer ultérieurement";
      })
    }
  }   
}
</script>
