<template>
  <MainCard>
    <template v-slot:body>
      <div v-if="settings.game && timeRemaining > 0">
        <div class="row">
          <div class="col-lg mb-4">
            <div class="row">
              <div v-for="(team, i) in teams.sort(sortByName)" :key="team" class="d-flex flex-grow-1">
                <div class="col">
                  <h5>{{ team.name }}</h5>
                  <PlayersList :players="player.filter(p => team.players.includes(p._key))"
                               :style="{color: colors[i]}"></PlayersList>

                </div>
              </div>
            </div>
          </div>

          <div class="col col-md-auto">
            <div>
              <svg :height="24" :width="24" class="bi bi-alarm my-1 mx-2" fill="currentColor" viewBox="0 0 16 16"
                   xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.5 5.5a.5.5 0 0 0-1 0v3.362l-1.429 2.38a.5.5 0 1 0 .858.515l1.5-2.5A.5.5 0 0 0 8.5 9V5.5z"/>
                <path
                  d="M6.5 0a.5.5 0 0 0 0 1H7v1.07a7.001 7.001 0 0 0-3.273 12.474l-.602.602a.5.5 0 0 0 .707.708l.746-.746A6.97 6.97 0 0 0 8 16a6.97 6.97 0 0 0 3.422-.892l.746.746a.5.5 0 0 0 .707-.708l-.601-.602A7.001 7.001 0 0 0 9 2.07V1h.5a.5.5 0 0 0 0-1h-3zm1.038 3.018a6.093 6.093 0 0 1 .924 0 6 6 0 1 1-.924 0zM0 3.5c0 .753.333 1.429.86 1.887A8.035 8.035 0 0 1 4.387 1.86 2.5 2.5 0 0 0 0 3.5zM13.5 1c-.753 0-1.429.333-1.887.86a8.035 8.035 0 0 1 3.527 3.527A2.5 2.5 0 0 0 13.5 1z"/>
              </svg>
              <vue-countdown v-slot="{ hours, minutes, seconds }" :time="timeRemaining">
                {{ $t('label.timeRemaining', {hours: hours, minutes: minutes, seconds: seconds}) }}
              </vue-countdown>
            </div>
            <div class="">
              <Online/>
            </div>
            <div  v-if="settings.map_url !== ''" class="sticky-top mt-3 d-none d-sm-block">
              <h5>
                {{ $t('message.mapTitle') }}
              </h5>
              <QRCode :height="270"
                      :value="settings.url + '/map?game_code=' + settings.game_code" :width="270"/>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <ResultsPage></ResultsPage>
      </div>
    </template>
  </MainCard>
</template>

<script>
import QRCode from "../components/QRCode.vue";
import MainCard from "../components/Card.vue";
import Player from "../components/Player.vue";
import ResultsPage from "../components/Results.vue";
import Online from "../components/Online.vue";
import PlayersList from "../components/Players.vue";
import colormap from "colormap";

export default {
  name: "GameView",
  components: {PlayersList, Online, ResultsPage, MainCard, QRCode, Player},
  inject: ['settings', 'player', 'online', 'teams'],
  computed: {
    timeRemaining() {
      const totalTimeInMSec = parseInt(this.settings.game.totalTime) * 60 * 1000
      const timeLeftSinceStart = Date.now() - Date.parse(this.settings.started)
      return totalTimeInMSec - timeLeftSinceStart;
    },
    colors() {
      return colormap({
        colormap: 'phase',
        nshades: Math.max(this.teams.length, 9),
        format: 'hex',
        alpha: 1
      })
    }
  },
  mounted() {
    if (!this.settings.assigned) {
      this.$router.push({name: 'home'});
    }
  },
  methods: {
    sortByName(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    }
  }
}
</script>

<style scoped>

</style>