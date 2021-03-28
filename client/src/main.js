import Vue from 'vue';
import cookies from 'vue-cookies';
import io from 'socket.io-client';
import VueResource from 'vue-resource';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(require('vue-cookies'));

Vue.use(VueResource);

console.debug('main.js');

Vue.config.productionTip = false;

(async () => {
  const { isAuthenticated } = await fetch('/api/auth/isAuthenticated')
    .then(resp => resp.json())
    .catch(console.error);
  store.commit('setIsAuthenticated', isAuthenticated);

  Vue.http.interceptors.push((request, next) => {
    console.log('HTTP INTERCEPT Before');
    next((resp) => {
      console.log(`HTTP INTERCEPT After: ${resp.status}`);
      if (resp.status === 401) {
        store.dispatch('unauthenticated');
        router.push('/login');
      }
    });
  });

  new Vue({
    router,
    store,
    cookies,
    render: h => h(App),
    data: {
      socket: io().connect(),
    },
  }).$mount('#app');
})();
