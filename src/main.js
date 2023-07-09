/**
 * Entry point for the vue application
 *
 * @author Dennis Zyska
 */
import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-3-socket.io';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle.js'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import BootstrapVue3, {BToastPlugin} from "bootstrap-vue-3";
import VueCookies from 'vue3-cookies'
import VueCountdown from '@chenfengyuan/vue-countdown';
import OpenLayersMap from "vue3-openlayers";
import "vue3-openlayers/dist/vue3-openlayers.css";
import {createI18n} from 'vue-i18n'
import messages from './i18n';


const app = createApp(App)

const i18n = createI18n({
    locale: 'en', // set locale
    fallbackLocale: 'de', // set fallback locale
    messages, // set locale messages
})

app.use(i18n);
app.use(BootstrapVue3);
app.use(BToastPlugin);
app.use(OpenLayersMap);

app.use(new VueSocketIO({
    // eslint-disable-next-line no-undef
    connection: SocketIO("ws://" + window.location.hostname + ":" + process.env.VITE_APP_WS_PORT,
        {
            path: '',
        }),
}));

app.use(router)

app.use(VueCookies, {
    expireTimes: "1d",
    path: "",
    domain: "",
    secure: false,
    sameSite: "Lax",
});

// Temporary Config Required until Vue 3.3
// https://vuejs.org/guide/components/provide-inject.html#working-with-reactivity
app.config.unwrapInjectedRef = true

app.component(VueCountdown.name, VueCountdown);
router.isReady().then(() => {
    app.mount('#app')
});
