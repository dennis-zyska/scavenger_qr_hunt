<template>
  <div class="book">
    <Page class="px-3 subpage" layout="portrait" size="A4">
      <div class="row">
        <div v-for="(spot, i) in spots" :key="i" class="col">
          <QRCode :height="120" :value="settings.url + '/spot/' + getSpotId(spot)" :width="120" class="p-2"/>
        </div>
      </div>
    </Page>
    <Page v-for="spot in spots" :key="spot._key" class="subpage" layout="portrait" size="A4"
          style="padding-top:150px;">
      <h1>{{ spot.Name }}</h1>

      <QRCode :value="settings.url + '/spot/' + getSpotId(spot)" height="650" width="650"/>
      <br>
      <div class="row mx-lg-5 text-center">
        <h1>
          {{ $t('message.spotQRSubtitle') }}
        </h1>
      </div>
    </Page>
  </div>

</template>

<script>
import {sha256} from 'js-sha256';

import Page from "../../components/Page.vue";
import QRCode from "../../components/QRCode.vue";

export default {
  name: "SpotGeneration",
  inject: ['settings', 'spots'],
  components: {
    QRCode, Page
  },
  unmounted() {
    this.$i18n.locale = this.settings.locale;
  },
  mounted() {
    this.$i18n.locale = this.settings.visitorLocale;
  },
  methods: {
    getSpotId(spot) {
      return sha256(spot.Name + this.settings.seed).slice(-10);
    }
  }
}
</script>

<style scoped>
.subpage {
  width: 100%;
  height: 100%;
  display: flex;
  vertical-align: middle;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>