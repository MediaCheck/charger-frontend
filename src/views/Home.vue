<template>
  <layout-dark>
    <transition v-bind:name="transition">
      <screen ref="screen" v-if="screen === 'intro'" key="intro">
        <p class="title has-text-white">Vítejte</p>
        <p class="subtitle has-text-white">Zadejte číslo nabíječky nebo načtěte QR kód.</p>
        <form v-on:submit="findSubmit">
          <text-input v-model="identifier" placeholder="1234"/>
          <div class="field">
            <div class="control">
              <button type="submit" class="button is-warning is-large is-fullwidth" v-bind:class="{ 'is-loading': chargerLoading }">Dále</button>
            </div>
          </div>
          <div v-if="error" class="notification is-danger">
            <button class="delete" @click="error = ''"></button>
            {{error}}
          </div>
        </form>
      </screen>
      <screen ref="screen" v-if="screen === 'form'" key="form">
        <p class="title has-text-white">Vaše údaje</p>
        <p class="subtitle has-text-white">Zadejte email a nastavte si PIN pro ukončení nabíjení.</p>
        <div v-if="charger" class="media has-content-leveled is-relative">
          <div class="media-left">
            <figure class="image is-64x64">
              <img :src="charger.picture_link">
            </figure>
          </div>
          <div class="media-content">
            {{charger.municipality_name}}
          </div>
        </div>
        <div v-if="charger" class="is-divider"></div>
        <form v-on:submit="submit">
          <text-input v-model="$v.email.$model" v-bind:validation="$v.email" label="Email" placeholder="jan@priklad.cz"/>
          <pin-input v-model="$v.pin.$model" v-bind:validation="$v.pin" label="PIN"/>
          <div class="field">
            <div class="control">
              <button type="submit" class="button is-warning is-large is-fullwidth" v-bind:class="{ 'is-loading': submitInProgress }">Dále</button>
            </div>
          </div>
          <div v-if="error" class="notification is-danger">
            <button class="delete" @click="error = ''"></button>
            {{error}}
          </div>
        </form>
      </screen>
      <screen ref="screen" v-if="screen === 'payment'" key="payment">
        <payment v-bind:client-secret="clientSecret" v-on:success="onSuccessPayment"/>
      </screen>
      <screen ref="screen" v-if="screen === 'finish'" key="finish">
        <p class="title has-text-white">Úspěch!</p>
        <p class="subtitle has-text-white">Rezervace proběhla úspěšně. Nabíjení brzy začne.</p>
        <div>
          <div class="notification" v-bind:class="{ 'is-success': !transactionError, 'is-danger': transactionError }">
            <p v-if="transactionError">Něco se pokazilo. Zkuste to prosím později.<br>{{transactionError}}</p>
            <p v-else-if="transactionDone">Nabíjení začalo.</p>
            <p v-else>&nbsp;<br>&nbsp;</p>
            <loading v-if="!transactionDone"/>
          </div>
        </div>
      </screen>
    </transition>
    <div ref="spacer"></div>
  </layout-dark>
</template>

<script lang="ts">

import Layout from '@/components/layout/Layout.vue'
import TextInput from '@/components/form/TextInput.vue'
import { Component } from 'vue-property-decorator'
import Vue from 'vue'
import { AxiosError } from 'axios'
import { email, maxLength, minLength, required } from 'vuelidate/lib/validators'
import PinInput from '@/components/form/PinInput.vue'
import Loading from '@/components/Loading.vue'
import Payment from '@/components/Payment.vue'
import Screen from '@/components/layout/Screen.vue'
import LayoutDark from '@/components/layout/LayoutDark.vue'

@Component({
  components: {
    Screen,
    Payment,
    Loading,
    PinInput,
    Layout,
    TextInput,
    LayoutDark
  },
  validations: {
    email: {
      required,
      email
    },
    pin: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(4)
    }
  }
})
export default class Home extends Vue {

  screen: string = 'intro'
  transition: string = 'slide-forward'

  identifier: string = ''
  email: string = ''
  pin: string = ''

  error: string = ''

  charger: any = null
  transactionId: string = ''
  clientSecret: string = ''

  submitInProgress: boolean = false
  transactionChecker: any
  transactionDone: boolean = false
  transactionError: string = ''
  chargerLoading: boolean = false

  created() {
    if (this.$route.query.cid) {
      this.chargerLoading = true
      this.$backend.getCharger(this.$route.query.cid as string)
        .then((charger) => {
          this.afterChargerGet(charger)
        })
        .catch(this.onError)
        .then(() => {
          this.chargerLoading = false
        })
    }
  }

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

  afterChargerGet(charger) {
    this.charger = charger
    if (charger.is_available) {
      this.screen = 'form'
    } else {
      this.error = 'Tato nabíječka momentálně není k dispozici.'
    }
  }

  findSubmit(event: Event) {
    event.preventDefault()

    if (!this.identifier) {
      this.error = 'Zadejte číslo nabíječky.'
      return
    }

    this.chargerLoading = true
    this.$backend.getChargerByIdentifier(this.identifier)
      .then((charger) => {
        this.afterChargerGet(charger)
      })
      .catch(this.onError)
      .then(() => {
        this.chargerLoading = false
      })
  }

  submit(event: Event) {
    event.preventDefault()

    this.error = ''

    if (this.$v.$invalid) {
      return this.$v.$touch()
    }

    if (!this.charger) {
      this.error = 'Není nalezena zvolená nabíječka. Načtěte QR kód.'
      return
    }

    this.submitInProgress = true
    this.$backend.startCharging(this.charger.hardware_id as string, this.email, this.pin)
      .then(result => {
        this.transactionId = result.transaction_id
        this.clientSecret = result.client_secret
        this.screen = 'payment'
      })
      .catch(this.onError)
      .then(() => {
        this.submitInProgress = false
      })
  }

  onError(error: AxiosError) {
    if (error.response) {
      this.error = error.response.status + ' ' + error.response.data.message
    } else {
      this.error = 'Požadavek selhal.'
    }
  }

  onSuccessPayment() {
    this.clientSecret = ''
    this.screen = 'finish'
    if (this.transactionId) {
      this.transactionChecker = setInterval(() => {
        this.$backend.checkTransaction(this.transactionId)
          .then(result => {
            if (result.status !== 'PENDING' && result.status !== 'RESERVED') {
              clearInterval(this.transactionChecker)
              this.transactionDone = true
            }
            if (result.status === 'ABORTED') {
              this.transactionError = result.error
            }
          })
          .catch(reason => {
            // TODO
          })
      }, 5000)
    }
  }
}
</script>
