// import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from 'vue-router'
import {createRouter, createWebHistory, RouteRecordNormalized } from 'vue-router'
import Home from '@/pages/Home.vue'
import Search from '@/pages/Search.vue'

const routes = [
  {path: '/home', redirect: '/'},
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'quite a playlist - Find deleted or private YouTube videos from Playlists',
      metaTags: [
        {
          name: 'title',
          content: 'quite a playlist - Find deleted or private YouTube videos from Playlists'
        },
        {
          name: 'description',
          content: 'Find deleted or private YouTube videos in your playlists with ease!'
        },
        {
          property: 'og:description',
          content: 'Find deleted or private YouTube videos in your playlists with ease!'
        }
      ]
    },
  },
  {
    path: '/search',
    name: 'Search',
    component: Search,
    meta: {
      title: 'Search - quite a playlist',
      metaTags: [
        {
          name: 'description',
          content: 'Search YouTube video details using Playlist or Video URL'
        },
        {
          property: 'og:description',
          content: 'Search YouTube video details using Playlist or Video URL'
        }
      ]
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    component: () => import('../pages/About.vue'),
    meta: {
      title: 'About - quite a playlist',
      metaTags: [
        {
          name: 'title',
          content: 'About - quite a playlist'
        },
        {
          name: 'description',
          content: 'How this app came to be!'
        },
        {
          property: 'og:description',
          content: 'How this app came to be!'
        }
      ]
    },
  },
  {
    path: '/guide',
    name: 'Guide',
    component: () => import('../pages/Guide.vue'),
    meta: {
      title: 'How to Find Deleted or Private YouTube video details from Playlists - quite a playlist',
      metaTags: [
        {
          name: 'title',
          content: 'How to Find Deleted or Private YouTube video details from Playlists - quite a playlist'
        },
        {
          name: 'description',
          content: 'Tutorial on how to find deleted or private video details quickly.'
        },
        {
          property: 'og:description',
          content: 'Tutorial on how to find deleted or private video details quickly.'
        }
      ]
    },
  },
  {
      path: '/:pathMatch(.*)',
      component: () => import('../pages/NotFound.vue'),
      meta: {
        title: 'Oops, where are you wandering around? - quite a playlist',
      },
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
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
        return { el: to.hash, top:-5}
    } else {
        return { left: 0, top: 0 }
    }
  },
  routes
})

router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // e.g., if we have `/some/deep/nested/route` and `/some`, `/deep`, and `/nested` have titles,
  // `/nested`'s will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) {
    document.title = String(nearestWithTitle.meta.title);
  } else if(previousNearestWithMeta) {
    document.title = String(previousNearestWithMeta.meta.title);
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode?.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  if (nearestWithMeta.meta.metaTags instanceof Array) {
    nearestWithMeta.meta.metaTags.map((tagDef: any) => {
        const tag = document.createElement('meta');

        Object.keys(tagDef).forEach(key => {
          tag.setAttribute(key, tagDef[key]);
        });

        // We use this to track which meta tags we create so we don't interfere with other ones.
        tag.setAttribute('data-vue-router-controlled', '');
    
        return tag;
      })
      // Add the meta tags to the document head.
      .forEach((tag: any) => document.head.appendChild(tag));
  }

  next();
});

export default router