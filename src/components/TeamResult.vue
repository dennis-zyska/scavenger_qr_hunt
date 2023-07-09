<template>
  <div class="row">
    <div class="col-lg mb-4">
      <div class="row">

        <h3>{{ $t('message.teamTopic') }}</h3>
        <h4>{{ team.taskDescription.topic }}</h4>

        <h5 class="pt-2">{{ $t('message.teamDescription') }}</h5>
        <p style="text-align:justify">{{ team.taskDescription.description }}</p>

        <h6 v-if="team.taskDescription.baseline.length > 0">{{ $t('message.teamBaseline') }}</h6>
        <div v-if="team.taskDescription.baseline.length > 0">
          <ul>
            <li v-for="baseline in team.taskDescription.baseline" :key="baseline" style="text-align:justify">{{
                baseline
              }}
            </li>
          </ul>
        </div>

        <h6>{{ $t('message.teamPowerups') }}</h6>
        <div>
          <ul v-if="team.powerups.length > 0">
            <li v-for="powerup in team.powerups" :key="powerup">{{ powerup }}</li>
          </ul>
          <p v-else>{{ $t('message.teamNoPowerups') }}</p>
        </div>
      </div>
    </div>

    <div class="col col-md-auto">

      <h3>{{ $t('message.teamMembers') }}</h3>
      <Player v-for="p in player.filter(p => team.players.includes(p._key))" :key="p"
              :player="p"></Player>
      <h5 class="pt-3">{{ $t('message.teamSpots') }}</h5>
      <ul v-if="'spots' in team && team.spots.length > 0">
        <li v-for="spot in team.spots" :key="spot">{{ spots.find(s => s._key === spot).Name }}</li>
      </ul>
      <p v-else>{{ $t('message.teamNoSpots') }}</p>
    </div>
  </div>
</template>

<script>
import Player from "./Player.vue";

export default {
  name: "TeamResult",
  components: {Player},
  inject: ['settings', 'player', 'spots'],
  props: {
    team: {
      type: Object,
      required: true
    },
  },
}
</script>

<style scoped>

</style>