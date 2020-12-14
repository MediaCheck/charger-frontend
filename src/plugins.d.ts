import { BackendAPI } from './plugins/BackendPlugin'

declare module 'vue/types/vue' {
  interface Vue {
    $backend: BackendAPI
  }
}
