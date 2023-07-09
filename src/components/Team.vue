<template>
  <div class="row m-1">
    <div class="col col-xl">
      <div class="row">
        <h4>{{ team.name }}</h4>
      </div>
      <Members :team="team"></Members>

      <h4 v-if="showTeamCode">{{ $t('message.teamCode') }}</h4>
      <p v-if="showTeamCode">{{ team.code }}</p>

      <h4 class="pt-1">{{ $t('message.teamTask') }}</h4>
      <h6>{{ team.taskDescription.topic }}</h6>
      <p style="text-align:justify">{{ team.taskDescription.description }}</p>

      <h6 v-if="team.taskDescription.baseline.length > 0">
        {{ $t('message.teamBaseline') }}
      </h6>
      <ul v-if="team.taskDescription.baseline.length > 0">
        <li v-for="baseline in team.taskDescription.baseline" :key="baseline" style="text-align:justify">{{
            baseline
          }}
        </li>
      </ul>

      <h4>{{ $t('message.teamGamePlay') }}</h4>
      <h6>{{ $t('message.teamPowerups') }}</h6>
      <ul v-if="team.powerups.length > 0">
        <li v-for="powerup in team.powerups" :key="powerup">{{ powerup }}</li>
      </ul>
      <p v-else>{{ $t('message.teamNoPowerups') }}</p>
      <h6>{{ $t('message.teamSpots') }}</h6>
      <ul v-if="'spots' in team && team.spots.length > 0">
        <li v-for="spot in team.spots" :key="spot">{{ spotName(spot) }}</li>
      </ul>
      <p v-else>{{ $t('message.teamNoSpots') }}</p>
    </div>
    <div v-if="showQR" class="col col-md-auto">

      <h5><a :href="settings.url + '/team/' + teamCode(team) + '?game_code=' + settings.game_code">Sync</a> new device
      </h5>
      <p>{{ $t('message.teamCode') }}: {{ team.code }}</p>
      <QRCode :height="270" :value="settings.url + '/team/' + teamCode(team) + '?game_code=' + settings.game_code"
              :width="270"></QRCode>

    </div>
  </div>
</template>

<script>
import QRCode from "./QRCode.vue";
import {sha256} from "js-sha256";
import Members from "./Members.vue";

export default {
  name: "TeamPage",
  inject: ['player', 'settings', 'spots'],
  components: {Members, QRCode},
  props: {
    team: {
      type: Object,
      required: true
    },
    showQR: {
      type: Boolean,
      default: true
    },
    showTeamCode: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    teamCode(team) {
      return sha256(team.code).slice(-10);
    },
    spotName(spot) {
      const spotData = this.spots.find(s => s._key === spot)
      if (spotData) {
        return spotData.Name;
      } else {
        return ""
      }
    }
  }
}

</script>

<style scoped>

</style>