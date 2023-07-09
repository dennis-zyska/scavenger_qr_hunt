<template>
  <MainCard>
    <template v-slot:body>
      <div v-if="!team">
        <h4>{{ $t('message.teamVisitor') }}</h4>

        <div class="mb-3">
          <label class="form-label" for="team_code"> {{ $t('label.teamCode') }}</label>
          <input id="team_code" v-model="team_code" :placeholder="$t('placeholder.teamCode')" class="form-control"
                 type="text"
                 @keyup.enter="joinTeam(this.team_code)"/>
        </div>

      </div>
      <div v-else>
        <TeamPage :team="team"/>
      </div>
    </template>
    <template v-if="!team" v-slot:footer>
      <div class="btn-group">
        <button class="btn btn-outline-dark" @click="joinTeam(this.team_code)">
          {{ $t('button.joinTeam') }}
        </button>
      </div>
    </template>
  </MainCard>
</template>

<script>
import {sha256} from "js-sha256";

import MainCard from "../components/Card.vue";
import TeamPage from "../components/Team.vue";

export default {
  name: "TeamView",
  components: {TeamPage, MainCard},
  inject: ['settings', 'teams', 'session'],
  props: {
    id: {
      type: String,
      required: false
    },
  },
  data() {
    return {
      team_code: '',
    }
  },
  computed: {
    team() {
      if (this.$route.params.id) {
        const found = this.teams.find((teaml) => this.teamCode(teaml) === this.$route.params.id);
        if (found) {
          this.joinTeam(found.code);
        }
      } else {
        if (this.session.team) {
          return this.teams.find((team) => team._key === this.session.team);
        } else {
          return null;
        }
      }
      return null;
    }
  },
  methods: {
    teamCode(team) {
      return sha256(team.code).slice(-10);
    },
    joinTeam(teamCode) {
      this.$socket.emit('joinTeam', teamCode);
      this.$router.push({name: 'team', params: {id: null}});
    }
  }
}
</script>

<style scoped>

</style>