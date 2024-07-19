import { Ordinalsbot } from 'ordinalsbot'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

const pinia = createPinia()

const ordinalsbot = new Ordinalsbot('apikey', 'testnet')

app.use(ordinalsbot)
app.use(pinia)

app.mount('#app')
