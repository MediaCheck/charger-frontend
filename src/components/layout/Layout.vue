<template>
  <div class="wrapper">
    <navigation></navigation>
    <div class="page-content">
      <div class="container">
        <div class="columns is-centered is-marginless">
          <div class="column is-full-mobile is-half-tablet is-half-desktop is-one-third-fullhd">
            <slot></slot>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          <strong>ChargerApp</strong> od <a href="https://www.byzance.cz">Byzance</a>. &copy;2019
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import Navigation from '@/components/Navigation.vue'

@Component({
  components: { Navigation }
})
export default class Layout extends Vue {

}

</script>

<style scoped>
</style>
