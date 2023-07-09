<template>
  <QRCodeVue3
    :backgroundOptions="{ color: '#ffffff' }"
    :cornersDotOptions="{ type: undefined, color: '#000000' }"
    :cornersSquareOptions="{ type: 'square', color: '#000000' }"
    :dotsOptions="{
          type: 'square',
          color: '#000000'
        }"
    :height="height"
    :imageOptions="{ hideBackgroundDots: true, imageSize: 0.4, margin: 0 }"
    :qrOptions="{ typeNumber: 0, mode: 'Byte', errorCorrectionLevel: 'H' }"
    :width="width"
    downloadButton="my-button"
    fileExt="png"
    image="/logo.png"
    imgclass="img-qr"
    myclass="my-qur"
    :value="value"
  />
</template>

<script>
// https://github.com/scholtz/qrcode-vue3
import QRCodeVue3 from 'qrcode-vue3'

export default {
  name: "QRCode",
  props: {
    value: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 300
    },
    height: {
      type: Number,
      default: 300
    },
  },
  components: {
    QRCodeVue3
  }
}
</script>

<style scoped>

</style>