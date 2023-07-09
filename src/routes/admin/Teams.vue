<template>
  <MainCard>
    <template v-slot:body>
      <div id="teamTab" class="nav nav-tabs nav-justified justify-content-center" role="tablist">
        <button v-for="(team, i) in teams.sort(sortByName)"
                :id="'nav-' + team._key + '-tab'"
                :key="team._key + '_nav'"
                :aria-controls="'nav-' + team._key"
                :class="(i === 0) ? 'nav-link active' : 'nav-link'"
                :data-bs-target="'#nav-' + team._key"
                aria-selected="true"
                class="nav-item"
                data-bs-toggle="tab"
                href="#"
                role="tab" type="button">{{ team.name }}
        </button>
      </div>
      <div id="teamContent" class="nav-tab-content">
        <div v-for="(team, i) in teams" :id="'nav-' + team._key" :key="team._key + 'content_'"
             :aria-labelledby="'nav-' + team._key +'-tab'"
             :class="(i ===0) ? 'tab-pane fade show active' : 'tab-pane fade'"
             role="tabpanel"
        >
          <div class="m-3">
            <TeamPage :team="team"/>
          </div>

        </div>
      </div>
    </template>
  </MainCard>
</template>

<script>
import MainCard from "../../components/Card.vue";
import TeamPage from "../../components/Team.vue";


export default {
  name: "TeamCodeView",
  components: {TeamPage, MainCard},
  inject: ['settings', 'teams', 'player'],
  mounted() {
    this.$socket.emit('get_players');
    this.$socket.emit('get_teams');
  },
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
.tab-pane:not(.active) {
  display: none;
}
</style>