import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuelidate from 'vuelidate'
import { BackendPlugin } from '@/plugins/BackendPlugin'
import './style.scss'

Vue.config.productionTip = false

let url: string = process.env.NODE_ENV === 'development' ? 'http://localhost:9000' : 'https://charger-backend.cluster.cloud.byzance.cz'

Vue.use(new BackendPlugin(), { url })

Vue.use(Vuelidate)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
