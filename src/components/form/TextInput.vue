<template>
  <div class="field">
    <label v-if="label" class="label has-text-white">{{label}}</label>
    <div class="control">
      <input class="input" v-bind:type="type" v-bind:placeholder="placeholder" v-bind:value="value" v-on:input="$emit('input', $event.target.value)"/>
      <span v-if="icon" class="icon is-small is-left">
        <i class="fas fa-user"></i>
      </span>
      <!--<span class="icon is-small is-right">
        <i class="fas fa-check"></i>
      </span>-->
    </div>
    <p v-if="msg" class="help is-danger">{{msg}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Validation } from 'vuelidate'
import { getValidationMessage } from '@/util'

@Component
export default class TextInput extends Vue {
  @Prop({
    type: String,
    default: 'text'
  })
  type!: string

  @Prop() validation!: Validation
  @Prop() label!: string
  @Prop() placeholder!: string
  @Prop() icon!: string
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
</style>
