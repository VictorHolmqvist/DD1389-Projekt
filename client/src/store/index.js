import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// no-param-reassign prevents store.isAuthenticated = isAuthenticated
/* eslint-disable no-param-reassign */
export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    username: '',
  },
  mutations: {
    setIsAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
      console.log(`setIsAuthenticated: ${isAuthenticated}`);
    },
    authSuccess(state, resp) {
      console.log(`authSuccess: ${resp}`);
      state.isAuthenticated = true;
      state.username = resp.username;
    },
    authFailed(state) {
      console.log('authFailed');
      state.isAuthenticated = false;
      state.username = '';
    },
    logout(state) {
      state.isAuthenticated = false;
      state.username = '';
    },
  },
  actions: {
    login({ commit }, user) {
      console.log('login');
      return new Promise((resolve, reject) => {
        fetch('/api/auth/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username,
            password: user.password,
          }),
        }).then((resp) => {
          console.log('login: then');
          if (!resp.ok) {
            commit('authFailed');
            reject();
          } else {
            commit('authSuccess', resp.json());
            resolve();
          }
        }).catch((err) => {
          commit('authFailed');
          console.error(`Login failed: ${err.message}`);
          reject();
        });
      });
    },
    register({ commit }, user) {
      const { username } = user;
      const { password } = user;
      console.log(`Register User: ${username}, ${password}`);
      return new Promise((resolve, reject) => {
        fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }).then((resp) => {
          console.log('Register complete');
          console.log(commit);
          if (resp.status === 200) {
            resolve();
          } else {
            reject();
          }
        }).catch(console.error);
      });
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        fetch('/api/profile/logout')
          .then((resp) => {
            if (resp.ok) {
              commit('logout');
              resolve();
            } else {
              console.error('Logout failed');
              reject();
            }
          })
          .catch((err) => {
            console.log(`Error logging out: ${err.message}`);
            reject();
          });
      });
    },
    unauthenticated({ commit }) {
      commit('authFailed');
    },
  },
  modules: {
  },
});
