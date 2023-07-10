import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import Main from './Main.vue';
import Embed from './Embed.vue';

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main
    }, {
      path: '/e/',
      name: 'embed',
      component: Embed
    }
  ]
});

app.use(router);

app.mount('#app');

