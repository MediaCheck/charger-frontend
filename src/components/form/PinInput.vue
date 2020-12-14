<template>
  <div class="field">
    <label v-if="label" class="label has-text-white">{{label}}</label>
    <div class="control has-content-centered">
      <pincode-input :autofocus="false" v-bind:value="value" v-on:input="$emit('input', $event)"/>
    </div>
    <p v-if="msg" class="help is-danger">{{msg}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Validation } from 'vuelidate'
import { getValidationMessage } from '@/util'
import PincodeInput from 'vue-pincode-input'

@Component({
  components: { PincodeInput }
})
export default class PinInput extends Vue {

  @Prop() validation!: Validation
  @Prop() label!: string
  @Prop() message!: string
  @Prop() value!: any

  get msg() {
    if (this.message) {
      return this.message
    } else {
      return getValidationMessage(this.validation)
    }
  }
}

</script>

<style scoped>
  input.vue-pincode-input {
    border-bottom: solid 2px black;
  }
</style>
