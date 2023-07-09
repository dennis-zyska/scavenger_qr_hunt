<template>
  <MainCard>
    <template v-slot:body>
      <div class="row">
        <div class="col">
          <h2 class="mb-2">
            {{ $t('message.welcome') }}
          </h2>

          <h5 class="mb-4">
            {{ $t('message.welcomeMessage') }}
          </h5>

          <div v-if="settings.game_code" class="row d-none d-lg-block">
            <div class="row">
              <h6>
                {{ $t('message.welcomeGameCode') }}:
                {{ settings.game_code }}
              </h6>
            </div>
          </div>

          <div class="row">
            <h6>{{ $t('message.currentOnline') }}
              <svg class="bi bi-circle-fill" fill="currentColor" height="16" style="color:green" viewBox="0 0 16 16"
                   width="16" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="8"/>
              </svg>
              {{ online }}
            </h6>
          </div>
          <div class="row">
            <h6>{{ $t('message.currentPlayers') }} ({{ $t('message.totalPlayers', [player.length]) }})
              <button class="btn" @click="deleteActive = !deleteActive">
                <svg :style="{color:(deleteActive)?'darkred':'black'}" class="bi bi-trash-fill" fill="currentColor"
                     height="16"
                     viewBox="0 0 16 16"
                     width="16" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                </svg>
              </button>
            </h6>
            <Players :delete-active="deleteActive" :players="player"/>
          </div>
        </div>
        <div class="col col-md-auto d-none d-lg-block">
          <h5>{{ $t('message.joinGameTitle') }}</h5>
          <QRCode :height="270" :value="settings.url + '/join?game_code=' + settings.game_code" :width="270"
                  class="sticky-top" style="top:20px"/>
        </div>
      </div>

    </template>
    <template v-slot:footer>
      <div class="btn-group">
        <button class="btn btn-outline-dark" @click="join">
          <svg class="bi bi-person-fill-add" fill="currentColor" height="16" viewBox="0 0 16 16"
               width="16" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0Zm-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            <path
              d="M2 13c0 1 1 1 1 1h5.256A4.493 4.493 0 0 1 8 12.5a4.49 4.49 0 0 1 1.544-3.393C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4Z"/>
          </svg>
          {{ $t('button.joinGame') }}
        </button>
        <button v-if="auth" class="btn btn-outline-dark" @click="start">
          {{ $t('button.startGame') }}
        </button>
      </div>
    </template>
  </MainCard>
</template>

<script>
import QRCode from "../components/QRCode.vue";
import MainCard from "../components/Card.vue";
import Players from "../components/Players.vue";

export default {
  name: "GameView",
  components: {Players, MainCard, QRCode},
  inject: ['settings', 'auth', 'player', 'online'],
  data() {
    return {
      deleteActive: false
    }
  },
  watch: {
    settings: {
      handler() {
        if (this.settings.assigned) {
          this.$router.push({name: 'game'});
        }
      },
      deep: true
    }
  },
  mounted() {
    if (this.settings.assigned) {
      this.$router.push({name: 'game'});
    }
  },
  methods: {
    join() {
      this.$router.push({name: 'join'});
    },
    start() {
      this.$router.push({name: 'start'});
    }
  }
}
</script>

<style scoped>

</style>