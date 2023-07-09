<template>
  <div>
    <h4>{{ $t('message.gameOver') }}</h4>
    <h6>{{ $t('message.gameOverQR') }}</h6>
    <p> {{ $t('message.gameOverQRRemove') }}</p>

    <i18n-t v-if="settings.email !== ''" keypath="message.gameContact" tag="p">
      <a :href="'mailto:' + settings.email" target="_blank">{{ settings.email }}</a>
    </i18n-t>
  </div>
</template>

<script>
export default {
  name: "AfterGame",
  inject: ['settings'],
  unmounted() {
    this.$i18n.locale = this.settings.locale;
  },
  mounted() {
    this.$i18n.locale = this.settings.visitorLocale;
  },
}
</script>

<style scoped>

</style>