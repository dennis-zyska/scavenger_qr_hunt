<script>
import {defineComponent} from 'vue'
import {useCookies} from "vue3-cookies";
import {useRoute, useRouter} from 'vue-router'

export default defineComponent({
  setup() {
    const {cookies} = useCookies();
    const router = useRouter()
    const route = useRoute()
    return {cookies, router, route};
  },

  mounted() {
    if (this.$cookies.isKey('session')) {
      this.$cookies.remove('session');
    }
    this.$router.push({name: 'home'});
    window.location.reload()
  }
});
</script>