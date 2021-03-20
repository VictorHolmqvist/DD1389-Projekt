import Vue from 'vue';
import cookies from 'vue-cookies';
import io from 'socket.io-client';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.use(require('vue-cookies'));

console.debug('main.js');

Vue.config.productionTip = false;

(async () => {
  // Find out if the user is already logged in
  // const { isAuthenticated } = await fetch('/api/isAuthenticated')
  //   .then(resp => resp.json())
  //   .catch(console.error);
  // store.commit('setIsAuthenticated', isAuthenticated);

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
