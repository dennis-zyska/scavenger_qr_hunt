<template>
  <MainCard>
    <template v-slot:body>
      <h1>
        {{ $t('message.adminAreaTitle')}}
      </h1>
      <ul>
        <li>
          <router-link to="/logout">
            {{ $t('link.logout') }}
          </router-link>
        </li>
        <li>
          <router-link to="/admin/assign">
            {{ $t('link.assign') }}
          </router-link>
        </li>
        <li>
          <router-link to="/admin/setup">
            {{ $t('link.setup') }}
          </router-link>
        </li>
        <li>
          <router-link to="/admin/spots">
            {{ $t('link.spots') }}
          </router-link>
        </li>
        <li>
          <router-link to="/admin/stats">
            {{ $t('link.stats') }}
          </router-link>
        </li>
        <li>
          <router-link to="/admin/teams">
            {{ $t('link.teams') }}
          </router-link>
        </li>
        <li>
          {{ $t('message.spotLinks') }}
          <ul>
            <li v-for="spot in spots" :key="spot">
              <router-link :to="{ name: 'spot', params: { id: getSpotId(spot) }}">{{ spot.Name }}
              </router-link>
            </li>
          </ul>
        </li>
      </ul>
      <span>
        {{ $t('info.spotGeneration') }}
      </span>
    </template>

  </MainCard>

</template>

<script>
import {sha256} from 'js-sha256';
import MainCard from "../../components/Card.vue";

export default {
  name: "AdminOverviewView",
  components: {MainCard},
  inject: ['spots', 'settings'],
  methods: {
    getSpotId(spot) {
      return sha256(spot.Name + this.settings.seed).slice(-10);
    }
  }
}
</script>

<style scoped>

</style>