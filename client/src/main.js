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

        if (!resp.url.includes('new_move')) {
          router.push('/login');
        } else {
          console.log('Wont to anything');
        }
      }
    });
  });

  const socket = io();
  let disconnected = false;

  socket.connect('localhost:8989');

  socket.on('connect', () => {
    console.error('socket connect');
    if (disconnected) {
      disconnected = false;
      // The client has reconnected after being disconnected. Force a page reload.
      router.go(0);
    }
  });

  socket.on('disconnect', () => {
    console.error('socket disconnect');
    disconnected = true;
    setTimeout(() => {
      socket.connect('localhost:8989');
    }, 100);
  });

  socket.on('connect_error', () => {
    console.error('connect_error');
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
