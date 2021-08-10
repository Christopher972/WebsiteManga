import { createRouter, createWebHashHistory } from 'vue-router'
import Signup from '../views/Signup.vue';
import Login from '../views/Login.vue';
import Posts from '../views/Posts.vue';
import CreatePost from '../views/CreatePost.vue';
import Post from '../views/Post.vue';
import Modify from '../views/Modify.vue';

const routes = [
  {
    path: '/',
    name: 'signup',
    component: Signup
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/posts',
    name: 'posts',
    component: Posts
  },
  {
    path: '/createPost',
    name: 'createPost',
    component: CreatePost
  },
  {
    path: '/post/:_id',
    name: 'post',
    component: Post
  },
  {
    path: '/modify/:_id',
    name: 'modify',
    component: Modify
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
