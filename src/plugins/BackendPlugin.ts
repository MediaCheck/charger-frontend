import Vue from 'vue'
import { VueClass } from 'vue-class-component/lib/declarations'
import Axios, { AxiosInstance, AxiosResponse } from 'axios'

export interface BackendAPIOptions {
  url: string
}

export class BackendAPI {

  options: BackendAPIOptions
  axios: AxiosInstance

  constructor(options: BackendAPIOptions) {
    this.options = options
    this.axios = Axios.create({
      baseURL: options.url
    })
  }

  getCharger(chargerId: string): Promise<any> {
    return this.axios.get(`/charger/hardware/${chargerId}`).then(extractData)
  }

  getChargerByIdentifier(identifier: string): Promise<any> {
    return this.axios.get(`/charger/identifier/${identifier}`).then(extractData)
  }

  startCharging(chargerId: string, email: string, pin: string): Promise<any> {
    return this.axios.put('/charger/start/pin', { email, pin, charger_id: chargerId }).then(extractData)
  }

  stopCharging(transactionId: string, pin: string): Promise<any> {
    return this.axios.put('/charger/stop/pin', { pin, transaction_id: transactionId }).then(extractData)
  }

  checkTransaction(transactionId: string): Promise<any> {
    return this.axios.get('/payment/check/' + transactionId).then(extractData)
  }
}

export class BackendPlugin {

  public install(vue: VueClass<Vue>, options: BackendAPIOptions) {
    vue.prototype.$backend = new BackendAPI(options)
  }
}

function extractData(response: AxiosResponse) {
  return response.data
}
