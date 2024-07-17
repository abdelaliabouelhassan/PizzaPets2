import './assets/main.css'
import { Ordinalsbot } from 'ordinalsbot'
import App from './App.vue'
import { createApp } from 'vue'

const app = createApp(App)

const ordinalsbotObj = new Ordinalsbot('apikey', 'testnet')

app.use(ordinalsbotObj)

app.mount('#app')
