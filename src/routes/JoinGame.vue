<template>
  <MainCard>
    <template v-slot:body>
      <div>
        <h3>
          {{ $t('message.joinGameTitle') }}
        </h3>
        <h6>
          {{ $t('label.joinName') }}
        </h6>
        <div class="row">
          <div class="col">
            <input v-model="name" :placeholder="$t('placeholder.playerName')" maxlength="12" type="text"
                   @keyup.enter="join"/>
            <div v-if="name.length > 5" class="small pb-3 info">{{ name.length }}/12</div>
          </div>
          <div class="row">
            <div class="col">
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <button class="btn btn-outline-dark" @click="join">
        {{ $t('button.joinGame') }}
      </button>
    </template>
  </MainCard>

</template>

<script>
import MainCard from "../components/Card.vue";

export default {
  name: "JoinGameView",
  components: {MainCard},
  data() {
    return {
      name: '',
    }
  },
  sockets: {
    success(data) {
      if (data.code === 200) {
        this.$router.push({name: 'home'});
      }
    }
  },
  inject: ['settings'],
  methods: {
    join() {
      this.$socket.emit('join', {'name': this.name});
    }
  }
}
</script>

<style scoped>

</style>