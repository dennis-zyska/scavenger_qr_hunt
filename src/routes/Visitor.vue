<template>
  <MainCard>
    <template v-slot:body>
      <div class="mb-3">
        <h4>{{ $t('message.visitor') }} </h4>
        <label class="form-label" for="game_code">{{ $t('label.gameCode') }}</label>
        <input id="game_code" v-model="game_code" :placeholder="$t('placeholder.gameCode')" class="form-control"
               type="text" @keyup.enter="enter"/>
      </div>
    </template>
    <template v-slot:footer>
      <button class="btn btn-outline-dark" @click="enter">
        {{ $t('button.joinGame') }}
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
  name: "VisitorView",
  components: {MainCard},
  inject: ['settings'],
  data() {
    return {
      game_code: '',
    }
  },
  mounted() {
    if (this.settings && this.settings.visitorLocale) {
      this.$i18n.locale = this.settings.visitorLocale;
    }
  },
  methods: {
    enter() {
      this.$socket.emit('enter', this.game_code);
    }
  },
}
</script>

<style scoped>

</style>