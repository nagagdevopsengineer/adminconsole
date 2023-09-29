// ** Icons Import
import { Home, CheckSquare, User, FileText, Folder, Grid } from 'react-feather'

export default [
  {
    id: 'dashboards',
    title: 'Dashboard',
    image: require('@src/assets/images/logo/dashboard.png').default,
    navLink: '/dashboard/ecommerce',
    action: 'read'
  },
 /* {
    id: 'demo_request',
    title: 'Demo Request',
    icon: <CheckSquare size={20} />,
    navLink: '/apps/email'
  },*/
 /* {
    id: 'client',
    title: 'Client',
    icon: <User size={20} />,
    navLink: '/apps/clients/list'
  },*/
  /*{
    id: 'users',
    title: 'Users',
    icon: <Grid size={20} />,
    navLink: '/apps/email'
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: <Folder size={20} />,
    navLink: '/apps/email'
  },
  {
    id: 'billing',
    title: 'Billing',
    icon: <FileText size={20} />,
    navLink: '/apps/email'
  }*/
  
  {
    id: 'contractor',
    title: 'Contractor',
    image: require('@src/assets/images/logo/contractor.png').default,
    navLink: '/apps/contractors/list'
  },
  {
    id: 'routes',
    title: 'Routes',
    image: require('@src/assets/images/logo/route.png').default,
    navLink: '/apps/routes/list'
  },
  {
    id: 'employee',
    title: 'Employee',
    image: require('@src/assets/images/logo/person.png').default,
    navLink: '/apps/employees/list'
  },
  {
    id: 'tracking',
    title: 'Tracking',
    image: require('@src/assets/images/logo/tracking.png').default,
    navLink: '/apps/tracking/list'
  },
  {
    id: 'capacity',
    title: 'Capacity Planing',
    image: require('@src/assets/images/logo/capacity.png').default,
    navLink: '/apps/capacity'
  },
  {
    id: 'roster',
    title: 'Roster',
    image: require('@src/assets/images/logo/roster.png').default,
    navLink: '/apps/roster/list',
    action: 'read'
  }
]
