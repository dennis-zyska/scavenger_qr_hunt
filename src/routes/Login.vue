<template>
  <MainCard>
    <template v-slot:body>
      <div class="mb-3">
        <label class="form-label" for="password">{{ $t('label.password') }} </label>
        <input id="password" v-model="password" class="form-control" type="password" @keyup.enter="login"/>
      </div>
    </template>
    <template v-slot:footer>
      <button class="btn btn-outline-dark" @click="login">
        {{ $t('button.login') }}
      </button>
    </template>
    <template v-slot:nav>
      <span></span>
    </template>
  </MainCard>
</template>

<script>
import MainCard from "../components/Card.vue";

export default {
  name: "LoginView",
  components: {MainCard},
  emits: ['login'],
  inject: ['settings'],
  data() {
    return {
      password: '',
    }
  },
  methods: {
    login() {
      this.$socket.emit('login', this.password);
    }
  },
}
</script>

<style scoped>

</style>