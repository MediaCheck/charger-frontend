<template>
  <div class="is-fullwidth is-absolute is-fixed-top">
    <div class="is-padded-1">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import LayoutDark from '@/components/layout/LayoutDark.vue'

@Component({
  components: { LayoutDark }
})
export default class Layout extends Vue {

}

</script>

<style scoped>
</style>
