<template>
  <div class="d-flex align-content-start flex-wrap">
    <Player v-for="p in players" :delete-active="deleteActive" :key="p.id" :player="p"></Player>
  </div>
</template>

<script>
import Player from "./Player.vue";

export default {
  name: "PlayersList",
  components: {Player},
  props: {
    players: {
      type: Object,
      required: true
    },
    deleteActive: {
      type: Boolean,
      default: false
    }
  },
  inject: ['settings']
}
</script>

<style scoped>

</style>