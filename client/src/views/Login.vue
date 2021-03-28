<template>
  <div class="container">
  <div class="login">
    <h2>Login</h2>

    <div ref="loginFailed" class="red hidden">
      <h2>Login failed, please try again.</h2>
    </div>

    <form v-on:submit.prevent="login">
      <label>Username</label>
      <input v-model="loginUsername" class="form-control" type="text"/>
      <label>Password</label>
      <input v-model="loginPassword" class="form-control" type="text"/>
      <button>Login</button>
    </form>
  </div>

  <div ref="registerSuccessful" class="green hidden">
    <h2>Your account was created successfully, please login.</h2>
  </div>
  <div ref="registerFailed" class="red hidden">
    <h2>Registration failed, please try again.</h2>
  </div>
  <div id="register" ref="register">
    <h2>Register</h2>
    <form v-on:submit.prevent="register">
      <label>Username</label>
      <input v-model="registerUsername" class="form-control" type="text"/>
      <label>Password</label>
      <input v-model="registerPassword" class="form-control" type="text"/>
      <button>Register</button>
    </form>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginUsername: '',
      loginPassword: '',
      registerUsername: '',
      registerPassword: '',
    };
  },
  methods: {
    login() {
      const username = this.loginUsername;
      const password = this.loginPassword;
      this.$store.dispatch('login', { username, password }).then(() => {
        console.log('Login successful');
        this.$router.push('/lobbybrowser');
      }).catch((err) => {
        console.error(err.message);
        this.$refs.loginFailed.classList.remove('hidden');
      });
    },
    register() {
      const username = this.registerUsername;
      const password = this.registerPassword;
      this.$store.dispatch('register', { username, password }).then(() => {
        this.$refs.register.classList.add('hidden');
        this.$refs.registerSuccessful.classList.remove('hidden');
      }).catch(() => {
        this.$refs.register.classList.remove('hidden');
        this.$refs.registerSuccessful.classList.add('hidden');
        this.$refs.registerFailed.classList.remove('hidden');
      });
      this.registerUsername = '';
      this.registerPassword = '';
    },
  },
  beforeRouteUpdate() {
    console.log('before route update');
  },
};
</script>

<style scoped>

.green {
  color: green;
}

.red {
  color: red;
}

.hidden {
  display: none;
}

</style>
