<template>
  <pages :layout="layout" :size="size" class="page">
    <slot></slot>
  </pages>
</template>

<script>
//https://codepen.io/rafaelcastrocouto/pen/poyWPO
export default {
  name: "PageComponent",
  props: {
    size: {
      type: String,
      default: "A4" // A4 or A3 or A5
    },
    layout: {
      type: String,
      default: "portrait" // portrait or landscape
    }
  },
}
</script>

<style scoped>
/*
pages {
  background: white;
  display: block;
  margin: 0 auto;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
}

pages[size="A4"] {
  width: 21cm;
  height: 29.7cm;
}

pages[size="A4"][layout="landscape"] {
  width: 29.7cm;
  height: 21cm;
}

pages[size="A3"] {
  width: 29.7cm;
  height: 42cm;
}

pages[size="A3"][layout="landscape"] {
  width: 42cm;
  height: 29.7cm;
}

pages[size="A5"] {
  width: 14.8cm;
  height: 21cm;
}

pages[size="A5"][layout="landscape"] {
  width: 21cm;
  height: 14.8cm;
}*/

@page {
  size: A4;
  margin: 0;
}

@media print {
  .page {
    margin: 0;
    border: initial;
    border-radius: initial;
    vertical-align: middle;
    width: initial;
    min-height: initial;
    box-shadow: initial;
    background: initial;
    page-break-after: always;
  }
}
</style>