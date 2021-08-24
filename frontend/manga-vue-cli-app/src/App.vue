<template>
  <div id="app">
    <router-view/>
    <footer class= "footer">
        <p class= "copyright">{{ copyright }} </p>
    </footer>
  </div>
</template>

<script>

export default {
  computed:{
      copyright(){
          const year = new Date().getFullYear()
          return `© Copyright WebSite Manga ${year}`
      }
  }
}
</script>

<style lang = "scss">

body
{
  padding: 0px;
  margin: 0px;
  
}

.header
{
  display: flex;
  justify-content: center;
}

h1
{
  font-family: Jazz LET, fantasy;
  color:silver;   
}

#app, h2 
{
  font-family: Comic Sans MS, Comic Sans, cursive;
  text-align: center;
  color: rgb(163, 163, 163);
  background: rgb(8, 8, 8);
  padding-top: 17px;
  
}

#form
{
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 10px;
}

label
{
  font-size:22px;
  font-weight: bold;
  color:silver;
  text-decoration: none;
}

input 
{
  margin:10px;
  height:24px;
}

#userSignup 
{
  margin:20px auto 0;
  height:auto;
  border:none;
  padding:10px;
  border-radius:8px;
  background: silver;
  font-weight:bold;
  font-size:20px;
  cursor:pointer;
  color: rgb(8, 8, 8) ;
}

.invalid-feedback, #erreur
{
  color:red;

}

.footer
{
  padding-bottom: 50px;
}

.copyright
{
  padding-top: 50px;
}

a {
    font-size:15px;
    font-weight: bold;
    color:rgb(8, 8, 8);
    text-decoration: none;
    border-radius: 10px;
    display: inline-block;
    padding: 6px 12px;
    border: 2px solid  red;
    background-color: red;
    margin:15px;
    transition: all 0.1s ease-in-out;
    cursor: pointer;
    &:hover {
        transform: scale(1.05);
        box-shadow: 1px 1px 20px red ;
    }
}

textarea
{
    width: 50%;
    height: 150px;
    border-radius: 5px;
}

.fileUpload, .buttonPost
{
    padding:15px;
}

#postCreate, #postModify{
    border: 2px solid silver ;
    background-color:silver ; 
    font-size:15px;
    font-weight:bold;
    border-radius:8px;
    height:auto;
    padding:10px;
    color:rgb(31, 30, 30);
    cursor:pointer; 
}

#nav{
  margin-bottom: 50px;
}

li{
   list-style:none;
};

.disconnexion{
  cursor: pointer;
}


  button {
    margin: 1em 1em 0 0;
    box-shadow: 3px 1px 2px; 
    font-weight: bold;
    cursor: pointer;
  }

#formId
{
   background-image: url(assets/flamme.jpg);
}

@media screen and (max-width:800px){
  #app
  {
    width: 100%;
    padding: 0px;
  }

  
  h1 
  {
    padding: 4px;
  }
  
  textarea, img
  {
    width: 100%;
  }

  .figurePost
  {
    transform: translate(35px, -15px);
  } 
}
</style>