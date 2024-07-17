import './assets/main.css'
import { Ordinalsbot } from 'ordinalsbot'
import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'

const app = createApp(App)

const pinia = createPinia()

const ordinalsbotObj = new Ordinalsbot('apikey', 'testnet')

app.use(ordinalsbotObj)
app.use(pinia)

app.mount('#app')
