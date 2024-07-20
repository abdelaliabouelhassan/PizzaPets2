import { Inscription } from 'ordinalsbot'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

const app = createApp(App)

const pinia = createPinia()

const inscription = new Inscription('', import.meta.env.VITE_NETWORK)

app.use(inscription)
app.use(pinia)

app.mount('#app')
