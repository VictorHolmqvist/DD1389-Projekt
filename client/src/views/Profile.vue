<template>
  <div class="container">
    <h1>Profile</h1>
    <p>Page where users can view their match history, see their active games and logout</p>
    <p>Users that are not logged in will be redirected to /login</p>
  </div>

</template>

<script>

export default {
  name: 'Profile',
  data() {
    return {
      timeslots: [],
      name: '',
      date: null,
      time: null,
      loginUsername: '',
      loginPassword: '',
      registerUsername: '',
      registerPassword: '',
    };
  },
  methods: {
    logOut() {
      fetch('/api/teacher/logout').then((resp) => {
        if (resp.ok) {
          this.notAuthorized();
          this.$router.push('/booking');
        }
      });
    },
    isAuthorized() {
      this.$refs.auth.classList.add('hidden');
      this.$refs.admin.classList.remove('hidden');
      this.loadTimeSlots();
    },
    notAuthorized() {
      this.timeslots = [];
      this.$refs.auth.classList.remove('hidden');
      this.$refs.admin.classList.add('hidden');
    },
    redirect(timeSlot) {
      this.$router.push(`/confirmation/${timeSlot.id}`);
    },
  },
  created() {
  },
};
</script>

<style scoped>

p {
  text-align: center;
}

h1 {
  text-align: center;
}

.green {
  color: green;
}

.red {
  color: red;
}

.hidden {
  display: none;
}

.red-button {
  background-color: red;
  color: white;
}


.editor {
  margin: 0 auto;
  height: 300px;
}

.editor timeselector {
  width: 50%;
}

</style>
