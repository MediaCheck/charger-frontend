<template>
  <div>
    <p class="title has-text-white">Platba</p>
    <p class="subtitle has-text-white">Na kartě Vám zablokujeme 200,- Kč a po ukončení nabíjení strhneme částku za spotřebovanou energii a zbytek uvolníme.</p>
    <div class="field">
      <div class="has-background-white-ter is-padded-1" id="card-element"></div>
      <p v-if="cardError" class="help is-danger" role="alert">
        {{cardError}}
      </p>
    </div>
    <div class="field">
      <div class="control">
        <button class="button is-large is-warning is-fullwidth" v-on:click="onClick">Odeslat</button>
      </div>
    </div>
    <div v-if="requestError" class="notification is-danger">
      <button class="delete" @click="requestError = ''"></button>
      {{requestError}}
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Payment extends Vue {

  @Prop() clientSecret!: string

  stripe!: stripe.Stripe
  elements!: stripe.elements.Elements
  card!: stripe.elements.Element

  cardError: string = ''
  requestError: string = ''

  created() {
    this.stripe = Stripe('pk_test_RQzUyiaWu2pp5w0Z4NOphsn4005mWpLjSi')
    this.elements = this.stripe.elements()
    this.card = this.elements.create('card')
  }

  mounted() {
    this.card.mount('#card-element')
    this.card.on('change', (e) => {
      if (e && e.error && e.error.message) {
        this.cardError = e.error.message
      } else {
        this.cardError = ''
      }
    })
  }

  onClick() {
    // @ts-ignore
    this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: { card: this.card }
    }).then((result) => {
      if (result.error) {
        this.requestError = result.error.message
      } else {
        if (result.paymentIntent.status === 'requires_capture') {
          this.$emit('success')
        }
      }
    })
  }
}

</script>

<style scoped>
</style>
