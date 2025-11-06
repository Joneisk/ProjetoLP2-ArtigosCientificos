import { createApp } from 'vue'
import App from './App.vue'
import { provideAuth } from '@/contexts/AuthContext'

const app = createApp(App)
provideAuth() // fornece o contexto antes de montar
app.mount('#app')