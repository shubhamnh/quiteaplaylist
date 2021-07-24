// import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from 'vue-router'
import {createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import About from '@/pages/About.vue'
import NotFound from '@/pages/NotFound.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: About
  },
  {
      path: '/:pathMatch(.*)',
      component: NotFound
  }
]
  
// Auto generates routes from vue files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
// const pages = import.meta.glob('./pages/*.vue')

// const routes = Object.keys(pages).map((path) => {
//   const name = path.match(/\.\/pages(.*)\.vue$/)[1].toLowerCase()
//   return {
//     path: name === '/home' ? '/' : name,
//     component: pages[path] // () => import('./pages/*.vue')
//   }
// })

// export function createRouter() {
//   return _createRouter({
//     // use appropriate history implementation for server/client
//     // import.meta.env.SSR is injected by Vite.
//     history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
//     routes
//   })
// }


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router