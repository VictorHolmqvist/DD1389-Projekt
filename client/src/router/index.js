import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from '../views/Login.vue';
import ProfileView from '../views/Profile.vue';
import LobbyBrowserView from '../views/LobbyBrowser.vue';
import ChessLobbyView from '../views/ChessLobby.vue';
import store from '../store';

console.debug('client index.js');

Vue.use(VueRouter);

const requireAuth = (to, from, next) => {
  if (store.state.isAuthenticated) {
    console.log('requireAuth: true');
    next();
  } else {
    console.info('Unauthenticated user. Redirecting to login page.');
    next('/login');
  }
};

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/profile', component: ProfileView, beforeEnter: requireAuth },
  { path: '/lobbybrowser', component: LobbyBrowserView, beforeEnter: requireAuth },
  { path: '/chesslobby/:gameid', component: ChessLobbyView, beforeEnter: requireAuth },

];

// const routes = [
//   { path: '/', redirect: '/login' },
//   { path: '/login', component: LoginView },
//   { path: '/profile', component: ProfileView },
//   { path: '/lobbybrowser', component: LobbyBrowserView },
//   { path: '/chesslobby/:gameid', component: ChessLobbyView },
//
// ];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

console.log(store);

// router.beforeEach((to, from, next) => {
//   if (store.state.isAuthenticated || to.path === '/login') {
//     next();
//   } else {
//     console.info('Unauthenticated user. Redirecting to login page.');
//     next('/login');
//   }
// });


export default router;
