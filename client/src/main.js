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
  const data = await fetch('/api/auth/isAuthenticated')
    .then(resp => resp.json())
    .catch(console.error);
  store.commit('setIsAuthenticated', data);


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

  const socket = io();
  let disconnected = false;

  socket.connect('localhost:8989');

  socket.on('connect', () => {
    if (disconnected) {
      // The client has reconnected after being disconnected. Force a page reload.
      router.go(0);
    }
    disconnected = false;
  });

  socket.on('disconnect', () => {
    console.log('socket disconnect');
    disconnected = true;
    socket.connect('localhost:8989');
  });

  socket.on('connect_error', () => {
    console.log('connect_error');
    setTimeout(() => {
      socket.connect('localhost:8989');
    }, 5000);
  });

  new Vue({
    router,
    store,
    cookies,
    render: h => h(App),
    data: {
      socket,
    },
  }).$mount('#app');
})();
