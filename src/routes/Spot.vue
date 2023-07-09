<template>
  <MainCard>
    <template v-slot:body>
      <div v-if="settings.game">
        <div v-if="spot" class="spot-view">
          <div v-if="show_info">
            <h5>{{ $t('message.noQuestsAvailable') }}</h5>
            <p>{{ $t('message.noQuestsPoints') }}</p>
          </div>
          <div v-else-if="timeRemaining > 0">
            <h3>{{ spot.Name }}</h3>
            <p>{{ $t('message.spotFound') }}</p>
            <p v-if="team">{{ $t('message.spotFoundProceed') }}</p>
            <br>
            <div v-if="!team">
              <div class="mb-3">
                <label class="form-label" for="team_code">{{ $t('label.teamCode') }}</label>
                <input id="team_code" v-model="team_code" :placeholder="$t('placeholder.teamCode')" class="form-control"
                       type="text"
                       @keyup.enter="joinTeam(this.team_code)"/>
              </div>
            </div>
          </div>
          <AfterGame v-else/>
        </div>
        <div v-else>
          <h4>{{ $t('message.spotInvalid') }}</h4>
        </div>
      </div>
      <BeforeGame v-else/>

    </template>
    <template v-if="settings.game && timeRemaining > 0" v-slot:footer>
      <div class="btn-group">
        <button v-if="!team" class="btn btn-outline-dark" @click="joinTeam(this.team_code)">
          {{ $t('button.joinTeam') }}
        </button>
        <button v-else-if="spot && !show_info" class="btn btn-outline-dark" @click="quest">
          {{ $t('button.startQuest') }}
        </button>
      </div>
    </template>
  </MainCard>
</template>

<script>
import {sha256} from "js-sha256";
import MainCard from "../components/Card.vue";
import BeforeGame from "../components/BeforeGame.vue";
import AfterGame from "../components/AfterGame.vue";

export default {
  name: "SpotView",
  components: {AfterGame, BeforeGame, MainCard},
  inject: ['settings', 'session', 'teams', 'spots'],
  data() {
    return {
      results: [],
      show_info: false,
      team_code: '',
    }
  },
  sockets: {
    quest(data) {
      if (data) {
        this.$router.push({name: 'quest', params: {id: data}});
      } else {
        this.show_info = true;
      }
    },
  },
  computed: {
    team() {
      if (this.session.team) {
        return this.teams.find((team) => team._key === this.session.team);
      } else {
        return null;
      }
    },
    spot() {
      return this.spots.find((spot) => this.getSpotId(spot) === this.$route.params.id);
    },
    timeRemaining() {
      const totalTimeInMSec = parseInt(this.settings.game.totalTime) * 60 * 1000
      const timeLeftSinceStart = Date.now() - Date.parse(this.settings.started)
      return totalTimeInMSec - timeLeftSinceStart;
    }
  },
  mounted() {
    this.$socket.emit("spotFound", this.$route.params.id);
  },
  methods: {
    getSpotId(spot) {
      return sha256(spot.Name + this.settings.seed).slice(-10);
    },
    quest() {
      this.$socket.emit("startQuest", this.spot._key);
      // TODO show waiting screen until quest is started
    },
    joinTeam(teamCode) {
      this.$socket.emit('joinTeam', teamCode);
    }
  }
}
</script>

<style scoped>

</style>