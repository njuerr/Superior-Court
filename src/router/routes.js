const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      }
    ]
  },
  {
    path: '/monitor',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/monitorPage.vue')
      }
    ]
  },
  {
    path: '/devicecontrol/:id',
    component: () => import('layouts/MainLayout.vue'),
    params: {
      id: 1
    },
    children: [
      {
        path: '',
        component: () => import('pages/deviceControl.vue')
      }
    ]
  },
  {
    path: '/devicecontroluser/:id',
    component: () => import('layouts/MainLayout.vue'),
    params: {
      id: 1
    },
    children: [
      {
        path: '',
        component: () => import('pages/deviceControluser.vue')
      }
    ]
  },
  {
    path: '/log',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/logPage.vue')
      }
    ]
  },
  {
    path: '/test',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/test.vue')
      }
    ]
  },
  {
    path: '/user',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/admin/user.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('pages/login.vue')
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
