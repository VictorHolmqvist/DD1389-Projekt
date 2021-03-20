import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginView from '../views/Login.vue';
import ProfileView from '../views/Profile.vue';
import LobbyBrowserView from '../views/LobbyBrowser.vue';
import store from '../store';

console.debug('client index.js');

Vue.use(VueRouter);

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/profile', component: ProfileView },
  { path: '/lobbybrowser', component: LobbyBrowserView },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

console.log(store);

// Setup Authentication guard
// router.beforeEach((to, from, next) => {
//   // console.info(`TO: ${to.path} FROM: ${from.path}`);
//   if (store.state.isAuthenticated || to.path === '/login') {
//     next();
//   } else {
//     console.info('Unauthenticated user. Redirecting to login page.');
//     // next('/login');
//     next();
//   }
// });

export default router;
