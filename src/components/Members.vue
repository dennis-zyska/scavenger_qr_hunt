<template>
  <button v-if="!showMembers" class="btn btn-outline-dark my-1" type="button" @click="showMembers = !showMembers">
    {{ $t('button.showMembers') }}
    <svg class="bi bi-arrow-right-circle-fill members collapse show" fill="currentColor" height="16"
         viewBox="0 0 16 16"
         width="16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
    </svg>
  </button>
  <div v-if="showMembers">
    <div class="card-body">
      <div class="row">
        <Player v-for="p in player.filter(p => team.players.includes(p._key))" :key="p"
                :player="p"></Player>
      </div>
    </div>
  </div>
</template>

<script>

import Player from "./Player.vue";

export default {
  name: "MembersView",
  components: {Player},
  inject: ['player', 'spots', 'settings'],
  data() {
    return {
      showMembers: false
    }
  },
  props: {
    team: {
      type: Object,
      required: true
    }
  },
  computed: {
    teamPlayer() {
      if (this.player.length > 0 && this.team.players.length > 0) {
        return this.player.filter(player => this.team.players.map(tp => tp._key).includes(player._key));
      }
      return [];
    }
  },

}
</script>

<style scoped>

</style>