<template>
  <MainCard>
    <template v-slot:body>
      <div class="container">
        <h2>{{ $t('message.rulesInstructions') }}</h2>
        <ul>
          <li v-for="line in $tm('instructions',)" :key="line">{{ line }}</li>
        </ul>

        <h2>{{ $t('message.rulesRules') }}</h2>
        <ul>
          <li v-for="line in $tm('rules',)" :key="line">{{ line }}</li>
        </ul>
      </div>
    </template>
  </MainCard>
</template>

<script>
import MainCard from "../components/Card.vue";

export default {
  name: "RulesView",
  components: {MainCard},
}
</script>

<style scoped>

</style>