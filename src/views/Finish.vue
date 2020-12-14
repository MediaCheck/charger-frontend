<template>
  <layout-dark>
    <screen ref="screen">
      <p class="title has-text-white">Ukončení nabíjení</p>
      <p class="subtitle has-text-white">Pro ukončení nabíjení zadejte váš PIN.</p>
      <form v-on:submit="submit">
        <pin-input v-model="$v.pin.$model" v-bind:validation="$v.pin" label="PIN"/>
        <div class="field">
          <div class="control">
            <button class="button is-warning is-large is-fullwidth">Ukončit nabíjení</button>
          </div>
        </div>
        <div v-if="error" class="notification is-danger">
          <button class="delete" @click="error = ''"></button>
          {{error}}
        </div>
      </form>
    </screen>
    <div ref="spacer"></div>
  </layout-dark>
</template>

<script lang="ts">

import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { maxLength, minLength, required } from 'vuelidate/lib/validators'
import { AxiosError } from 'axios'
import PinInput from '@/components/form/PinInput.vue'
import LayoutDark from '@/components/layout/LayoutDark.vue'
import Screen from '@/components/layout/Screen.vue'

@Component({
  components: {
    Screen,
    LayoutDark,
    PinInput
  },
  validations: {
    pin: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(4)
    }
  }
})
export default class Finish extends Vue {

  pin: string = ''

  error: string = ''

  mounted() {
    this.setHeight()
  }

  updated() {
    this.setHeight()
  }

  setHeight() {
    if (this.$refs.spacer && this.$refs.screen) {
      // @ts-ignore
      this.$refs.spacer.style.height = this.$refs.screen.$el.offsetHeight + 'px'
    }
  }

  submit(event: Event) {

    this.error = ''

    event.preventDefault()

    if (this.$v.$invalid) {
      return this.$v.$touch()
    }

    if (!this.$route.query.tid) {
      this.error = 'Není nalezena transakce. Načtěte QR kód.'
      return
    }

    this.$backend.stopCharging(this.$route.query.tid as string, this.pin)
      .catch((error: AxiosError) => {
        if (error.response) {
          this.error = error.response.status + ' ' + error.response.data.message
        } else {
          this.error = 'Požadavek selhal'
        }
      })
  }
}
</script>
