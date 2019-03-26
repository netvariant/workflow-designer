import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import Main from '@/components/theme/layouts/Main'
import Full from '@/components/theme/layouts/Full'

Vue.use(Router)

const router = new Router({
  base: process.env.BASE_URL,
  routes: [{
    name: 'Guest',
    path: '/',
    component: Full,
    redirect: { name: 'Login' },
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('@/components/guest/login/Login'),
        meta: {
          secure: false
        }
      }
    ]
  }, {
    name: 'Secure',
    path: '/secure',
    component: Main,
    redirect: { name: 'Workflows' },
    meta: {
      secure: true
    },
    children: [{
      name: 'Workflows',
      path: 'workflow',
      component: () => import('@/components/secure/workflow/Workflow'),
      redirect: { name: 'BrowseWorkflows' },
      meta: {
        secure: true
      },
      children: [{
        name: 'BrowseWorkflows',
        path: 'browse',
        component: () => import('@/components/secure/workflow/WorkflowBrowse'),
        meta: {
          secure: true
        }
      }, {
        name: 'ViewWorkflow',
        path: ':id',
        component: () => import('@/components/secure/workflow/WorkflowView'),
        meta: {
          secure: true
        }
      }, {
        name: 'CreateWorkflow',
        path: 'create',
        component: () => import('@/components/secure/workflow/WorkflowCreate'),
        meta: {
          secure: true
        }
      }, {
        name: 'ModifyWorkflow',
        path: ':id/modify',
        component: () => import('@/components/secure/workflow/WorkflowModify'),
        meta: {
          secure: true
        }
      }, {
        name: 'DesignWorkflow',
        path: ':id/design',
        component: () => import('@/components/secure/workflow/WorkflowDesigner'),
        meta: {
          secure: true
        }
      }]
    }, {
      name: 'WorkflowTasks',
      path: 'workflow-task',
      component: () => import('@/components/secure/workflow-task/WorkflowTask'),
      redirect: { name: 'BrowseWorkflowTasks' },
      meta: {
        secure: true
      },
      children: [{
        name: 'BrowseWorkflowTasks',
        path: 'browse',
        component: () => import('@/components/secure/workflow-task/WorkflowTaskBrowse'),
        meta: {
          secure: true
        }
      }, {
        name: 'ViewWorkflowTask',
        path: ':id',
        component: () => import('@/components/secure/workflow-task/WorkflowTaskView'),
        meta: {
          secure: true
        }
      }]
    }]
  }, {
    name: 'Error',
    path: '*',
    component: Full,
    redirect: '/error/404',
    children: [
      {
        name: 'Error404',
        path: '/error/404',
        component: () => import('@/components/guest/error/Error404'),
        meta: {
          secure: false
        }
      },
      {
        name: 'Error403',
        path: '/error/403',
        component: () => import('@/components/guest/error/Error403'),
        meta: {
          secure: false
        }
      }
    ]
  }]
})

router.beforeEach((to, from, next) => {
  if (to.meta.secure && !store.state.userAuthenticated) {
    store.dispatch('setRequestPath', {
      requestPath: to.path
    })
    next('/login')
  } else {
    next()
  }
})

export default router
