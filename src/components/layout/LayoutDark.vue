<template>
  <div class="wrapper has-background-black has-text-white">
    <p class="title is-1 is-marginless has-text-white has-title-padded">nabij.se</p>
    <div class="page-content">
      <div class="container">
        <div class="columns is-centered is-marginless">
          <div class="column is-full-mobile is-half-tablet is-half-desktop is-one-third-fullhd is-paddingless">
            <div class="is-fullwidth is-relative">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer has-background-black-ter">
      <div class="content has-text-centered">
        <p>
          <strong class="has-text-white">nabij.se</strong> <small>od</small> <a href="https://www.byzance.cz">Byzance</a> &copy;2019
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'

@Component
export default class LayoutDark extends Vue {

}

</script>

<style scoped>
</style>
