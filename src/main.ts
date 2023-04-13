import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
import Icon from '@/components/Icon.vue'

createApp(App).use(router).component('Icon', Icon).mount('#app')