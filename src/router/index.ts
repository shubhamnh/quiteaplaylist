import {createRouter, createWebHistory } from 'vue-router'
import Home from '@/pages/Home.vue'
import Search from '@/pages/Search.vue'

const routes = [
  {path: '/home', redirect: '/'},
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'quite a playlist - Find deleted or private YouTube videos',
      metaTags: [
        {
          name: 'title',
          content: 'quite a playlist - Find deleted or private YouTube videos'
        },
        {
          name: 'description',
          content: 'Easily find removed YouTube video details by searching using Playlist or Video URLs. Get video details and search for similar videos.'
        },
        {
          property: 'og:title',
          content: 'quite a playlist - Find deleted or private YouTube videos'
        },
        {
          property: 'og:description',
          content: 'Easily find removed YouTube video details by searching using Playlist or Video URLs. Get video details and search for similar videos.'
        },
        {
          property: 'og:image',
          content: 'https://quiteaplaylist.com/quite-a-playlist-logo-large.png'
        },
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
          name: 'robots',
          content: 'noindex'
        },
        {
          name: 'title',
          content: 'Search - quite a playlist'
        },
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
    component: () => import('../pages/About.vue').catch( err => {
      // TODO: Get version.json (not cached) and load new version 
      window.location.assign(window.location.origin + '/about')
    }),
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
    path: '/find-watch-deleted-private-youtube-video-playlist',
    name: 'Guide',
    component: () => import('../pages/Guide.vue').catch( err => {
      window.location.assign(window.location.origin + '/find-watch-deleted-private-youtube-video-playlist')
    }),
    meta: {
      title: 'How to Find Deleted & Private YouTube videos from Playlists',
      metaTags: [
        {
          name: 'title',
          content: 'How to Find Deleted & Private YouTube videos from Playlists'
        },
        {
          name: 'description',
          content: 'A guide on how to find and watch deleted or private YouTube videos from playlists easily. Get the video title of removed videos and search for similar videos.'
        },
        {
          property: 'og:title',
          content: 'How to Find Deleted & Private YouTube videos from Playlists'
        },
        {
          property: 'og:description',
          content: 'A guide on how to find and watch deleted or private YouTube videos from playlists easily. Get the video title of removed videos and search for similar videos.'
        },
        {
          property: 'og:type',
          content: 'article'
        },
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