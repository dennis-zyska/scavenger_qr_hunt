<template>
  <div class="card">
    <div class="card-header d-flex justify-content-start">
      <div class="d-flex flex-grow-1 d-none d-lg-block">
        <slot name="header">
          <div>
            <h4 class="card-title">{{ $t('message.title') }}</h4>
            <h5>{{ settings.title }}</h5>
          </div>
        </slot>
      </div>
      <div class="d-flex w-auto">
        <slot name="nav">
          <button v-if="$route.name !== 'rules'  && show" :title="$t('title.rules')" aria-label="Close" class="btn"
                  type="button"
                  @click="showRules()">
            <svg class="bi bi-question-diamond-fill" fill="currentColor" height="32" viewBox="0 0 16 16"
                 width="32" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M9.05.435c-.58-.58-1.52-.58-2.1 0L.436 6.95c-.58.58-.58 1.519 0 2.098l6.516 6.516c.58.58 1.519.58 2.098 0l6.516-6.516c.58-.58.58-1.519 0-2.098L9.05.435zM5.495 6.033a.237.237 0 0 1-.24-.247C5.35 4.091 6.737 3.5 8.005 3.5c1.396 0 2.672.73 2.672 2.24 0 1.08-.635 1.594-1.244 2.057-.737.559-1.01.768-1.01 1.486v.105a.25.25 0 0 1-.25.25h-.81a.25.25 0 0 1-.25-.246l-.004-.217c-.038-.927.495-1.498 1.168-1.987.59-.444.965-.736.965-1.371 0-.825-.628-1.168-1.314-1.168-.803 0-1.253.478-1.342 1.134-.018.137-.128.25-.266.25h-.825zm2.325 6.443c-.584 0-1.009-.394-1.009-.927 0-.552.425-.94 1.01-.94.609 0 1.028.388 1.028.94 0 .533-.42.927-1.029.927z"/>
            </svg>
          </button>
        </slot>
        <button v-if="$route.name !== 'home' && $route.name !== 'game'  && show" :title="$t('title.home')" class="btn"
                @click="goHome()">
          <svg class="bi bi-house-fill" fill="currentColor" height="32" viewBox="0 0 16 16" width="32"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L8 2.207l6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5Z"/>
            <path d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6Z"/>
          </svg>
        </button>
        <button v-if="$route.name !== 'map' && settings.game && show && settings.map_url !== ''" :title="$t('title.map')"
                class="btn " @click="goMap()">
          <svg class="bi bi-map-fill" fill="currentColor" height="32" viewBox="0 0 16 16" width="32"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M16 .5a.5.5 0 0 0-.598-.49L10.5.99 5.598.01a.5.5 0 0 0-.196 0l-5 1A.5.5 0 0 0 0 1.5v14a.5.5 0 0 0 .598.49l4.902-.98 4.902.98a.502.502 0 0 0 .196 0l5-1A.5.5 0 0 0 16 14.5V.5zM5 14.09V1.11l.5-.1.5.1v12.98l-.402-.08a.498.498 0 0 0-.196 0L5 14.09zm5 .8V1.91l.402.08a.5.5 0 0 0 .196 0L11 1.91v12.98l-.5.1-.5-.1z"
              fill-rule="evenodd"/>
          </svg>
        </button>
        <button v-if="settings.assigned && $route.name !== 'team'  && show" :title="$t('title.team')" class="btn"
                @click="goTeam()">
          <svg class="bi bi-people-fill" fill="currentColor" height="32" viewBox="0 0 16 16" width="32"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
          </svg>
        </button>
        <button v-if="!auth && show" :title="$t('title.admin')" class="btn d-none d-lg-block" @click="goLogin()">
          <svg class="bi bi-key-fill" fill="currentColor" height="32" viewBox="0 0 16 16" width="32"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3.5 11.5a3.5 3.5 0 1 1 3.163-5H14L15.5 8 14 9.5l-1-1-1 1-1-1-1 1-1-1-1 1H6.663a3.5 3.5 0 0 1-3.163 2zM2.5 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
          </svg>
        </button>
        <button v-else-if="$route.name !== 'admin' && show" :title="$t('title.admin')" class="btn d-none d-lg-block"
                @click="goAdmin()">
          <svg class="bi bi-gear-fill" fill="currentColor" height="32 " viewBox="0 0 16 16" width="32"
               xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
          </svg>
        </button>
      </div>
    </div>
    <div class="card-body">
      <div class="card-text">
        <slot name="body"></slot>
      </div>
    </div>
    <div v-if="hasFooterSlot" class="card-footer text-end">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainCard",
  inject: ['settings', 'auth', 'session'],
  data() {
    return {}
  },
  methods: {
    showRules() {
      this.$router.push({name: 'rules'})
    },
    goHome() {
      this.$router.push({name: 'home'})
    },
    goLogin() {
      this.$router.push({name: 'login'})
    },
    goAdmin() {
      this.$router.push({name: 'admin'})
    },
    goTeam() {
      this.$router.push({name: 'team'})
    },
    goMap() {
      this.$router.push({name: 'map'})
    }
  },
  computed: {
    hasFooterSlot() {
      return !!this.$slots.footer;
    },
    show() {
      return (this.$route.name !== 'spot' || this.session.team)
    }
  },
}
</script>

<style scoped>

</style>