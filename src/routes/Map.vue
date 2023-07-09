<template>
  <MainCard>
    <template v-slot:body>
      <p>
        {{ $t('message.mapLink') }}
      </p>

      <a :href="settings.map_url" target="_blank">{{ settings.map_url }}</a>
      <br><br>
      <a :href="settings.map_url" target="_blank">
        <div class="btn btn-dark" @click="openMap()">
          {{ $t('button.openMap') }}
        </div>
      </a>
    </template>
  </MainCard>
</template>

<script>
import MainCard from "../components/Card.vue";

export default {
  name: "MapPage",
  components: {MainCard},
  inject: ['settings'],
  methods: {
    openMap() {
      let route = this.$router.resolve(this.settings.map_url);
      window.open(route.href, '_blank');
    }
  }
}
</script>

<style scoped>

</style>