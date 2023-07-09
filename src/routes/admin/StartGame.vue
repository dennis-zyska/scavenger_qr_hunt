<template>
  <MainCard>
    <template v-slot:body>
      <form>
        <div class="mb-4">
          <div class=" form-label"><b>{{ $t('message.currentPlayers') }}</b> {{ player.length }}</div>
          <Players :players="player" :settings="settings"/>
        </div>
        <div class="mb-4">
          <label class="form-label" for="teams">{{ $t('label.numberTeams', {teams: teams}) }}</label>
          <input id="teams" v-model="teams" :max="maxTeams" class="form-range" min="1" step="1" type="range">
          <div class="form-text">{{ $t('info.numberTeams', {teams: teams, players: playersPerTeam}) }}</div>
        </div>
        <div class="mb-4">

          <div class="form-label">{{ $t('label.playerAssignment') }}</div>
          <div class="form-check">
            <input id="flexRadioDefault2" checked class="form-check-input" name="flexRadioDefault" type="radio">
            <label class="form-check-label" for="flexRadioDefault2">
              {{ $t('label.randomAssignment') }}
            </label>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label" for="totalTime">{{ $t('label.totalTime', {minutes: totalTime}) }}</label>
          <input id="totalTime" v-model="totalTime" class="form-range" max="300" min="30" step="10" type="range">
          <div class="form-text">
            {{ $t('info.totalTime', {hours: Math.round(totalTime * 100 / 60) / 100, minutes: totalTime}) }}
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">{{ $t('label.taskAssignment') }}</label>
          <div class="form-check">
            <input id="taskAssignmentUnique" v-model="taskAssignment" :value="0" checked class="form-check-input"
                   name="taskAssignmentUnique" type="radio">
            <label class="form-check-label" for="taskAssignmentUnique">
              {{ $t('label.taskAssignmentUnique') }}
            </label>
          </div>
          <div class="form-check">
            <input id="taskAssignmentMultiple" v-model="taskAssignment" :value="1" class="form-check-input"
                   name="taskAssignmentMultiple" type="radio">
            <label class="form-check-label" for="taskAssignmentMultiple">
              {{ $t('label.taskAssignmentMultiple') }}
            </label>
          </div>

        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-outline-dark" @click="assign">
        {{ $t('button.assignTeams') }}
      </button>
    </template>
  </MainCard>
</template>

<script>
import MainCard from "../../components/Card.vue";
import Players from "../../components/Players.vue";

export default {
  name: "StartGameView",
  components: {Players, MainCard},
  inject: ['settings', 'player'],
  data() {
    return {
      teams: 1,
      totalTime: 60,
      taskAssignment: 0
    }
  },
  watch: {
    settings: {
      handler() {
        if (this.settings.assigned && !this.$route.meta.overwrite) {
          this.$router.push({name: 'game'});
        }
      },
      deep: true
    },
    maxTeams() {
      if (this.teams > this.maxTeams) {
        this.teams = this.maxTeams;
      }
    }
  },
  mounted() {
    if (this.settings.assigned && !this.$route.meta.overwrite) {
      this.$router.push({name: 'game'});
    }
  },
  computed: {
    maxPlayersperTeam() {
      return Math.ceil(this.player.length / this.teams);
    },
    minPlayersperTeam() {
      return Math.floor(this.player.length / this.teams);
    },
    playersPerTeam() {
      if (this.minPlayersperTeam === this.maxPlayersperTeam)
        return this.minPlayersperTeam;
      else
        return this.minPlayersperTeam + " - " + this.maxPlayersperTeam;
    },
    maxTeams() {
      if (this.taskAssignment === 0) {
        console.log(this.settings, this.player.length)
        return Math.min(this.settings.num_tasks, this.player.length);
      } else {
        return Math.min(this.player.length, 10);
      }


    }
  },
  sockets: {
    assigned() {
      this.$router.push({name: 'game'});
    }
  },

  methods: {
    assign() {
      this.$socket.emit('assign_teams', {
        'teams': this.teams,
        'totalTime': this.totalTime,
        'taskAssignment': this.taskAssignment
      });
    }
  }
}
</script>

<style scoped>

</style>