<template>
  <MainCard>
    <template v-slot:header>
      <h2>{{ $t('message.setup') }}</h2>
    </template>
    <template v-slot:body>
      <div class="label">{{ $t('label.setupSpots') }}</div>
      <div>
        <div class="row row-cols-1 row-cols-md-3 g-4">
          <div v-for="s in spots" class="col">
            <div class="form-check">
              <input :id="s + 'b'" v-model="selected" :value="s" class="form-check-input" type="checkbox"/>
              <label :for="s + 'b'" class="form-check-label">{{ s.Name }}</label>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label class="label" for="title">{{ $t('label.setupTitle') }}</label>
        <input id="title" v-model="title" class="form-control" type="text"/>
      </div>
      <div>
        <label class="label" for="seed">{{ $t('label.setupQRSeed') }}</label>
        <input id="seed" v-model="seed" class="form-control" type="text"/>
        <div class="small pb-3 info">{{ $t('info.setupQRSeed') }}</div>
      </div>
      <div>
        <label class="label" for="url">{{ $t('label.setupURL') }}</label>
        <input id="url" v-model="url" class="form-control" type="text"/>
        <div class="small pb-3 info">{{ $t('info.setupURL') }}</div>
      </div>

      <div>
        <label class="label" for="game_code">{{ $t('label.setupGameCode') }}</label>
        <input id="game_code" v-model="game_code" class="form-control" type="text"/>
        <div class="small pb-3 info">{{ $t('info.setupGameCode') }}</div>
      </div>
      <div>
        <label class="label" for="map_url">{{ $t('label.setupMapURL') }}</label>
        <input id="map_url" v-model="map_url" class="form-control" type="text"/>
        <div class="small pb-3 info">{{ $t('info.setupMapURL') }}</div>
      </div>
      <div>
        <label class="label">{{ $t('label.setupLanguage') }}</label>
        <select id="game_locale" v-model="locale" class="form-select">
          <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
            <span v-t="{ path: 'message.lang', locale: locale }"></span>
          </option>
        </select>
      </div>
      <div>
        <label class="label">{{ $t('label.setupLanguageVisitor') }}</label>
        <select id="visitor_locale" v-model="visitorLocale" class="form-select">
          <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
            <span v-t="{ path: 'message.lang', locale: locale }"></span>
          </option>
        </select>
      </div>
      <div>
        <label class="label" for="email">{{ $t('label.setupEmail') }}</label>
        <input id="email" v-model="email" class="form-control" type="text"/>
        <div class="small pb-3 info">{{ $t('info.setupEmail') }}</div>
      </div>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="init">
        {{ $t('button.initGame') }}
      </button>

    </template>
  </MainCard>
</template>

<script>
import spots from "../../assets/spots.csv";
import MainCard from "../../components/Card.vue";

export default {
  name: "SetupView",
  components: {MainCard},
  data() {
    return {
      initialized: -1,
      spots: spots,
      selected: [...spots],
      game_code: process.env.VITE_APP_SETUP_GAME_CODE || '',
      seed: process.env.VITE_APP_SETUP_SEED || '1234567890',
      url: process.env.VITE_APP_SETUP_URL || 'http://localhost:8050',
      title: process.env.VITE_APP_SETUP_TITLE || 'Scavenger Hunt',
      map_url: process.env.VITE_APP_SETUP_MAP_URL || '',
      locale: this.$i18n.locale,
      visitorLocale: this.$i18n.locale,
      email: process.env.VITE_APP_SETUP_EMAIL || '',
    }
  },
  sockets: {
    setup_done() {
      this.$router.push("/");
    },
  },
  methods: {
    init() {
      this.$socket.emit('setup', {
        spots: this.selected,
        seed: this.seed,
        title: this.title,
        url: this.url,
        game_code: this.game_code,
        map_url: this.map_url,
        locale: this.locale,
        visitorLocale: this.visitorLocale,
        email: this.email,
      });
    }
  }
}
</script>

<style scoped>
.list-games {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  display: flex;
}
</style>