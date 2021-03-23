<template>
  <div class="container">
  <div class="login">
    <h2>Login</h2>

    <div ref="loginFailed" class="red hidden">
      <h2>Login failed, please try again.</h2>
    </div>

    <form>
      <label>Username</label>
      <input v-model="loginUsername" class="form-control" type="text"/>
      <label>Password</label>
      <input v-model="loginPassword" class="form-control" type="text"/>
      <button v-on:click="login()">Login</button>
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
    <form>
      <label>Username</label>
      <input v-model="registerUsername" class="form-control" type="text"/>
      <label>Password</label>
      <input v-model="registerPassword" class="form-control" type="text"/>
      <button v-on:click="register()">Register</button>
    </form>
  </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {

    login() {
      fetch('/api/authenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.loginUsername,
          password: this.loginPassword,
        }),
      }).then((resp) => {
        if (!resp.ok) {
          this.$refs.loginFailed.classList.remove('hidden');
          throw new Error('Unauthorized');
        } else {
          return resp.json();
        }
      }).then((data) => {
        console.log(data);
        this.$router.push('/lobbybrowser');
      })
        .catch(console.error);
      this.loginUsername = '';
      this.loginPassword = '';
    },

    register() {
      console.log('register');
      fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: this.registerUsername,
          password: this.registerPassword,
        }),
      }).then((resp) => {
        console.log('Register complete');
        console.log(resp.status);
        console.log(resp.status === 200);
        if (resp.status === 200) {
          console.log(this.$refs.register);
          this.$refs.register.classList.add('hidden');
          this.$refs.registerSuccessful.classList.remove('hidden');
        } else {
          this.$refs.register.classList.remove('hidden');
          this.$refs.registerSuccessful.classList.add('hidden');
          this.$refs.registerFailed.classList.remove('hidden');
        }
      }).catch(console.error);
      this.registerUsername = '';
      this.registerPassword = '';
    },
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
