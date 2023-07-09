<template>
  <div id="app">
    <BToast/>
    <div class="container">
      <div v-if="visitor && !($route.meta.guest)">
        <Visitor/>
      </div>
      <Setup v-else-if="initialized === 0"/>
      <div v-else-if="initialized === -1">
        <h1>Loading...</h1>
      </div>
      <div v-else-if="authRequired && !auth">
        <Login/>
      </div>
      <RouterView v-else/>
    </div>
  </div>
</template>

<script>
import {RouterView} from 'vue-router'
import Setup from './routes/admin/Setup.vue'
import Login from "./routes/Login.vue";
import {computed} from 'vue'
import BToast from "./components/Toast.vue";
import Visitor from "./routes/Visitor.vue";

/**
 * Main app component
 *
 * @author: Dennis Zyska
 */
export default {
  name: 'MainApp',
  components: {BToast, Login, RouterView, Setup, Visitor},
  provide() {
    return {
      // explicitly provide a computed property (to make it reactive)
      settings: computed(() => this.settings),
      auth: computed(() => this.auth),
      player: computed(() => this.player),
      teams: computed(() => this.teams),
      session: computed(() => this.session),
      online: computed(() => this.online),
      spots: computed(() => this.spots),
      stats: computed(() => this.stats),
      quests: computed(() => this.quests),
    }
  },
  data() {
    return {
      initialized: -1,
      settings: {},
      auth: false,
      player: [],
      teams: [],
      visitor: false,
      session: {},
      online: 0,
      spots: [],
      stats: [],
      quests: [],
    }
  },
  sockets: {
    disconnect() {
      window.location.reload()
    },
    settings(data) {
      if (data && "title" in data) {
        this.settings = data;
        this.initialized = 1;
      } else {
        this.initialized = 0;
        this.settings = data;
      }
    },
    players(data) {
      this.player = data;
    },
    teams(data) {
      this.teams = data;
    },
    online(data) {
      this.online = data;
    },
    session(data) {
      this.session = data;
      this.$cookies.set('session', data.session_key);
    },
    reset() {
      // delete session
      this.$cookies.remove('session');
    },
    visitor(data) {
      if (this.visitor && !data) {
        window.location.reload()
      }
      this.visitor = data;
    },
    spots(data) {
      this.spots = data;
    },
    allStats(data) {
      this.stats = data;
    },
    addStats(data) {
      this.stats.push(data);
    },
    quests(data) {
      this.quests = data;
    },
    admin(data) {
      if (data) {
        this.auth = true;
        if (!data.without_redirect) {
          this.$router.push({name: this.$route.query.redirectedFrom || 'home'})
        }

      }
    },
    setup_done() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  computed: {
    authRequired() {
      return this.$route.meta.authRequired !== undefined;
    }
  },
  watch: {
    authRequired: {
      handler() {
        if (this.authRequired && !this.auth)
          this.$router.push({name: 'login', query: {redirectedFrom: this.$route.name}});
      },
      immediate: true,
    },
    settings: {
      handler() {
        if (!this.settings.assigned && !(this.$route.meta.guest) && this.$route.name !== 'join' && this.$route.name !== 'start' && this.$route.name !== 'reassign') {
          this.$router.push({name: 'home'});
        }
      },
      deep: true
    }
  },
  methods: {
    init() {
      if (this.$cookies.isKey('session')) {
        this.$socket.emit('load', {
          session: this.$cookies.get('session'),
          game_code: this.$route.query.game_code
        });
      } else {
        this.$socket.emit('load', {game_code: this.$route.query.game_code, session: null});
      }
    }
  }
}
</script>

<style scoped>
#app {
  margin-top: 10px;
}
</style>
