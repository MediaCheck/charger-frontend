<template>
  <div id="app" class="page">
    <router-view/>
  </div>
</template>

<style>

</style>

<script lang="ts">

import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class App extends Vue {
}

</script>
