// ** React Imports
import { lazy } from 'react'
import { Redirect } from 'react-router-dom'

const AppRoutes = [
  {
    path: '/apps/email',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/apps/email'))
  },
  {
    path: '/apps/email/:folder',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/apps/email')),
    meta: {
      navLink: '/apps/email'
    }
  },
  {
    path: '/apps/email/label/:label',
    exact: true,
    appLayout: true,
    className: 'email-application',
    component: lazy(() => import('../../views/apps/email')),
    meta: {
      navLink: '/apps/email'
    }
  },
  {
    path: '/apps/email/:filter',
    component: lazy(() => import('../../views/apps/email')),
    meta: {
      navLink: '/apps/email'
    }
  },
  {
    path: '/apps/chat',
    appLayout: true,
    className: 'chat-application',
    component: lazy(() => import('../../views/apps/chat'))
  },
  {
    path: '/apps/todo',
    exact: true,
    appLayout: true,
    className: 'todo-application',
    component: lazy(() => import('../../views/apps/todo'))
  },
  {
    path: '/apps/todo/:filter',
    appLayout: true,
    exact: true,
    className: 'todo-application',
    component: lazy(() => import('../../views/apps/todo')),
    meta: {
      navLink: '/apps/todo'
    }
  },
  {
    path: '/apps/todo/tag/:tag',
    appLayout: true,
    className: 'todo-application',
    component: lazy(() => import('../../views/apps/todo')),
    meta: {
      navLink: '/apps/todo'
    }
  },
  {
    path: '/apps/calendar',
    component: lazy(() => import('../../views/apps/calendar'))
  },
  {
    path: '/apps/invoice/list',
    component: lazy(() => import('../../views/apps/invoice/list'))
  },
  {
    path: '/apps/invoice/preview/:id',
    component: lazy(() => import('../../views/apps/invoice/preview')),
    meta: {
      navLink: '/apps/invoice/preview'
    }
  },
  {
    path: '/apps/invoice/preview',
    exact: true,
    component: () => <Redirect to='/apps/invoice/preview/4987' />
  },
  {
    path: '/apps/invoice/edit/:id',
    component: lazy(() => import('../../views/apps/invoice/edit')),
    meta: {
      navLink: '/apps/invoice/edit'
    }
  },
  {
    path: '/apps/invoice/edit',
    exact: true,
    component: () => <Redirect to='/apps/invoice/edit/4987' />
  },
  {
    path: '/apps/invoice/add',
    component: lazy(() => import('../../views/apps/invoice/add'))
  },
  {
    path: '/apps/invoice/print',
    layout: 'BlankLayout',
    component: lazy(() => import('../../views/apps/invoice/print'))
  },
  {
    path: '/apps/ecommerce/shop',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/shop'))
  },
  {
    path: '/apps/ecommerce/wishlist',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/wishlist'))
  },
  {
    path: '/apps/ecommerce/product-detail',
    exact: true,
    className: 'ecommerce-application',
    component: () => <Redirect to='/apps/ecommerce/product-detail/apple-i-phone-11-64-gb-black-26' />
  },
  {
    path: '/apps/ecommerce/product-detail/:product',
    exact: true,
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/detail')),
    meta: {
      navLink: '/apps/ecommerce/product-detail'
    }
  },
  {
    path: '/apps/ecommerce/checkout',
    className: 'ecommerce-application',
    component: lazy(() => import('../../views/apps/ecommerce/checkout'))
  },
  {
    path: '/apps/clients/list',
    component: lazy(() => import('../../views/apps/clients/list'))
  },
  {
    path: '/apps/user/list',
    component: lazy(() => import('../../views/apps/user/list'))
  },
  {
    path: '/apps/user/view',
    exact: true,
    component: () => <Redirect to='/apps/user/view/1' />
  },
  {
    path: '/apps/user/view/:id',
    component: lazy(() => import('../../views/apps/user/view')),
    meta: {
      navLink: '/apps/user/view'
    }
  },
  {
    path: '/apps/roles',
    component: lazy(() => import('../../views/apps/roles-permissions/roles'))
  },
  {
    path: '/apps/permissions',
    component: lazy(() => import('../../views/apps/roles-permissions/permissions'))
  },
  {
    path: '/apps/clients/list',
    component: lazy(() => import('../../views/apps/clients/list'))
  },
  {
    path: '/apps/contractors/list/:id?',
    component: lazy(() => import('../../views/apps/contractors/list'))
  },
  {
    path: '/apps/contractors/view/:id',
    component: lazy(() => import('../../views/apps/contractors/view'))
  },
  {
    path: '/apps/drivers/list/:id?',
    component: lazy(() => import('../../views/apps/drivers/list'))
  },
  {
    path: '/apps/drivers/view/:id',
    component: lazy(() => import('../../views/apps/drivers/view'))
  },
  {
    path: '/apps/helpers/list/:id?',
    component: lazy(() => import('../../views/apps/helpers/list'))
  },
  {
    path: '/apps/helpers/view/:id',
    component: lazy(() => import('../../views/apps/helpers/view'))
  },
  {
    path: '/apps/buses/list/:id?',
    component: lazy(() => import('../../views/apps/buses/list'))
  },
  {
    path: '/apps/buses/view/:id',
    component: lazy(() => import('../../views/apps/buses/view'))
  },
  {
    path: '/apps/routes/list',
    component: lazy(() => import('../../views/apps/routes/list'))
  },
  {
    path: '/apps/employees/list/',
    component: lazy(() => import('../../views/apps/employees/list'))
  },
  {
    path: '/apps/employees/view/:id',
    component: lazy(() => import('../../views/apps/employees/view'))
  },
  {
    path: '/apps/tracking/list/',
    component: lazy(() => import('../../views/apps/tracking/list'))
  },
  {
    path: '/apps/tracking/view/:id',
    component: lazy(() => import('../../views/apps/tracking/view'))
  },
  {
    path: '/apps/capacity',
    component: lazy(() => import('../../views/apps/capacity'))
  },
  {
    path: '/apps/routes/view/:id',
    component: lazy(() => import('../../views/apps/routes/view'))
  },
  {
    path: '/apps/roster/list',
    component: lazy(() => import('../../views/apps/roster/list'))
  },
  {
    path: '/apps/roster/view/:id',
    component: lazy(() => import('../../views/apps/roster/view'))
  },
  {
    path: '/apps/roster/edit/:id',
    component: lazy(() => import('../../views/apps/roster/view'))
  },
  {
    path: '/apps/clients/view/:id',
    component: lazy(() => import('../../views/apps/clients/view'))
  }
]

export default AppRoutes
