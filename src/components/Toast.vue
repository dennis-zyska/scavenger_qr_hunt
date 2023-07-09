<template>
  <b-container :autohide="false"
               :toast="{root: true}"
               fluid="sm"
               position="position-fixed"
               style="z-index: 1100;"
  />
</template>

<script>
/**
 *  Display toasts
 *
 *  This component shows a message in the dashboard, there are two ways to display a message:
 *  From backend through websocket:
 *  socket.emit("toast", <toastObject>);
 *
 *  Example toast object: (must have a message, others are optional)
 *  {
 *   message: "This is an example!",
 *   title: "Example",
 *   variant: 'info', // 'primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'
 *   delay: 5000, //in ms
 *  }
 *
 * @author: Dennis Zyska
 * More Information: https://cdmoro.github.io/bootstrap-vue-3/components/Toast.html#toasts-on-demand
 */
import {useToast} from 'bootstrap-vue-3'

export default {
  name: "BToast",
  sockets: {
    toast: function (data) {
      this.makeToast(data);
    },
    error(data) {
      if (data && data.code) {
        this.makeToast({
          title: 'Error',
          message: this.$i18n.t('error.' + data.code, data),
          variant: 'danger'
        });
      }
    },
    success(data) {
      if (data && data.code) {
        this.makeToast({
          title: 'Success',
          message: this.$i18n.t('success.' + data.code, data),
          variant: 'success'
        });
      }
    }
  },
  data() {
    return {
      toastCount: 0,
      toaster: null,
    }
  },
  mounted() {
    this.toaster = useToast();
  },
  methods: {
    makeToast(data) {
      this.toaster.show(
        {
          title: (data.title !== undefined) ? data.title : "",
          body: data.message,
          solid: true,

        },
        {
          variant: (data.variant !== undefined) ? data.variant : "info",
          delay: (data.delay !== undefined) ? data.delay : 2500,
          pos: 'top-center',
          id: "toast_" + this.toastCount++,
        }
      );
    }
  }
}
</script>

<style>
.toast {
  width: 100% !important;
  min-width: 250px !important;
}

</style>
