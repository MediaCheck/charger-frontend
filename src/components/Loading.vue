<template>
  <div class="is-overlay is-loading-overlay has-background-white-ter has-content-centered has-content-leveled">
    <div class="loader is-dark"></div>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import Navigation from '@/components/Navigation.vue'

@Component({
  components: { Navigation }
})
export default class Loading extends Vue {

}

</script>

<style scoped>
  .loader.is-dark {
    border-bottom-color: dimgray;
    border-left-color: dimgray;
  }
</style>
