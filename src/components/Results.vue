<template>
  <div id="teamTab" class="nav nav-tabs nav-justified justify-content-center" role="tablist">
    <button id="nav-score-tab" aria-controls="nav-score" aria-selected="true" class="nav-link active nav-item"
            data-bs-target="#nav-score" data-bs-toggle="tab" href="#"
            role="tab" type="button">
      Scores
    </button>
    <button v-for="(team, i) in teams.sort(sortByName)"
            :id="'nav-' + team._key + '-tab'"
            :key="team._key + '_nav'"
            :aria-controls="'nav-' + team._key"
            :data-bs-target="'#nav-' + team._key"
            aria-selected="true"
            class="nav-link nav-item"
            data-bs-toggle="tab"
            href="#"
            role="tab" type="button">{{ team.name }}
    </button>
  </div>
  <div id="teamContent" class="tab-content">
    <div id="nav-score"
         aria-labelledby="nav-score-tab"
         class="tab-pane fade show active"
         role="tabpanel"
    >
      <h3 class="pt-2">{{ $t('message.highScoreTitle') }}</h3>
      <div class="d-flex flex-grow-1 align-middle justify-content-center">
      <HighScores ></HighScores>
      </div>
    </div>
    <div v-for="(team, i) in teams" :id="'nav-' + team._key" :key="team._key + 'content_'"
         :aria-labelledby="'nav-' + team._key +'-tab'"
         class="tab-pane fade"
         role="tabpanel"
    >
      <div class="m-3">
        <TeamResult :team="team"/>
      </div>

    </div>
  </div>
</template>

<script>

import TeamResult from "../components/TeamResult.vue";
import HighScores from "../components/HighScores.vue";

export default {
  name: "ResultsPage",
  inject: ['settings', 'player', 'online', 'teams', 'spots'],
  components: {HighScores, TeamResult},
  methods: {
    sortByName(a, b) {
      if (a.name < b.name) {
        return -1;
      } else if (a.name > b.name) {
        return 1
      } else {
        return 0;
      }
    },
  }
}
</script>

<style scoped>

</style>