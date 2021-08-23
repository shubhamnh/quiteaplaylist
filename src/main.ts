import App from './App.vue'
import { createApp } from 'vue'
import router from './router'
// import { createMetaManager, defaultConfig, resolveOption } from 'vue-meta'
// import VueMeta from 'vue-meta'


// import { createSSRApp } from 'vue'
// import { createRouter } from './router'


// Client SPA

// const decisionMaker5000000 = resolveOption((prevValue, context : any) => {
//     const { uid = 0 } = context.vm || {}
//     if (!prevValue || prevValue < uid) {
//       return uid
//     }
//   })
  
// const metaManager = createMetaManager({
//     ...defaultConfig,
//     esi: {
//         group: true,
//         namespaced: true,
//     }
// }, decisionMaker5000000)

createApp(App).use(router).mount('#app')

// SSR requires a fresh app instance per request, therefore we export a function
// that creates a fresh app instance. If using Vuex, we'd also be creating a
// fresh store here.
// export function createApp() {
//     const app = createSSRApp(App)
//     const router = createRouter()
//     app.use(router)
//     return { app, router }
//   }
