<template>
  <MainCard>
    <template v-slot:body>
      <div v-if="success">
        <h1>{{ $t('message.questCongrats') }}</h1>
        <p>{{ $t('message.questSolved') }}</p>
        <div v-if="powerup">
          <p>
            {{ $t('message.questPowerup') }}
          </p>
          <button class="btn btn-success" @click="goTeam()">{{ powerup }}</button>
        </div>
      </div>
      <div v-else-if="quest">
        <h1>
          {{ $t('message.questTitle') }}
        </h1>
        <p> {{ quest.question }}</p>
        <div class="mb-3">
          <label class="form-label" for="answer">
            {{ $t('label.questAnswer') }}
          </label>
          <input id="answer" v-model="team_answer" class="form-control" :placeholder="$t('placeholder.questAnswer')" type="text"
                 @keyup.enter="answer()"/>
        </div>
      </div>
      <div v-else class="flex-grow-1 text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">
            {{ $t('message.loading') }}
          </span>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <div class="btn-group">
        <button v-if="!success && quest" class="btn btn-outline-dark" @click="answer()">
          {{ $t('button.submitAnswer') }}
        </button>
        <button v-else class="btn btn-outline-dark" @click="goTeam()">
          {{ $t('button.openTeam') }}
        </button>
      </div>
    </template>
  </MainCard>

</template>

<script>
import MainCard from "../components/Card.vue";

export default {
  name: "QuestView",
  components: {MainCard},
  data() {
    return {
      quest: null,
      team_answer: '',
      powerup: null,
      success: false,
    }
  },
  sockets: {
    questData(data) {
      this.quest = data;
    },
    questSuccess(data) {
      this.powerup = data;
      this.success = true;
    },
    questError() {
      this.$router.push({name: 'team'});
    }
  },
  mounted() {
    this.$socket.emit('getQuest', this.$route.params.id);
  },
  methods: {
    answer() {
      this.$socket.emit('solution', {quest: this.quest._key, answer: this.team_answer});
    },
    goTeam() {
      this.$router.push({name: 'team'});
    }
  }
}
</script>

<style scoped>

</style>