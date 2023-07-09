<template>
  <div class="bg-light border p-2 bd-highlight mx-1 my-1" @click="remove(player.name)" :style="{width:'180px', color: (player.name === deleteConfirm) ? 'darkred':''}" >
    <div class="row">
      <div class="col col-sm-auto">
        <svg class="bi bi-person-fill me-1" fill="currentColor" height="24" viewBox="0 0 16 16"
             width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
        </svg>
      </div>
      <div class="col text-left">
        <div class="">{{ player.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PlayerElement",
  props: {
    player: {
      type: Object,
      required: true
    },
    deleteActive: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  data() {
    return {
      deleteConfirm: null,
    }
  },
  inject: ['auth', 'settings'],
  methods: {
    remove(name) {
      if (this.auth && this.deleteActive) {
        if (this.deleteConfirm === name) {
          this.$socket.emit('remove', {'name': name})
        } else {
          this.deleteConfirm = name;
          setTimeout(() => {
            this.deleteConfirm = null;
          }, 3000)
        }
      }

    },
  },

}
</script>

<style scoped>

</style>