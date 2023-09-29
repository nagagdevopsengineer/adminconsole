// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'
import axiosObj from '@src/axios'

// ** Reactstrap Imports
import { Row, Col, TabContent, TabPane } from 'reactstrap'

// ** Demo Components
import Tabs from './Tabs'
import Breadcrumbs from '@components/breadcrumbs'
// import BillingTabContent from './BillingTabContent'
import AccountTabContent from './AccountTabContent'
import ClientAccountTabs from './ClientAccountTabContent'
import ContractorAccountTabs from './ContractorAccountTabContent'
import SecurityTabContent from './SecurityTabContent'
// import ConnectionsTabContent from './ConnectionsTabContent'
// import NotificationsTabContent from './NotificationsTabContent'
import BusAllocationTabContent from './BusAllocation'
import RouteAllocationTabContent from './RouteAllocation'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

const AccountSettings = () => {
  // ** States
  const [activeTab, setActiveTab] = useState('1')
  const [data, setData] = useState(null)

  const toggleTab = tab => {
    setActiveTab(tab)
  }

  const userData = JSON.parse(localStorage.getItem('userData'))

  useEffect(() => {
    if (userData.role === 'client') {
      const clientId = localStorage.getItem('client_uuid')
      axiosObj.get(`/api/clients/${clientId}/?populate=*`).then(response => setData(response.data.data))
    } else if (userData.role === 'contractor') {
      const contractorId = localStorage.getItem('contractor_uuid')
      axiosObj.get(`/api/contractors/${contractorId}/?populate=*`).then(response => setData(response.data.data))
    } else {
      axios.get('/account-setting/data').then(response => setData(response.data))
    }
  }, [])

  if (userData.role === 'contractor') {
    return (
      <Fragment>
        <Breadcrumbs breadCrumbTitle='Profile Settings' breadCrumbParent='Pages' breadCrumbActive='Profile Settings' />
        {data !== null ? (
          <Row>
            <Col xs={12}>
            <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} role="contractor"/>
              <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                  <ContractorAccountTabs data={data} />
                </TabPane>
                <TabPane tabId='2'>
                  <SecurityTabContent/>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        ) : null}
      </Fragment>
    )
  } else if (userData.role === 'client') {
    return (
      <Fragment>
        <Breadcrumbs breadCrumbTitle='Profile Settings' breadCrumbParent='Pages' breadCrumbActive='Profile Settings' />
        {data !== null ? (
          <Row>
            <Col xs={12}>
            <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} role="client"/>
              <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                  <ClientAccountTabs data={data} />
                </TabPane>
                <TabPane tabId='2'>
                  <SecurityTabContent/>
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        ) : null}
      </Fragment>
    )
  } else {
    return (
      <Fragment>
        <Breadcrumbs breadCrumbTitle='Account Settings' breadCrumbParent='Pages' breadCrumbActive='Account Settings' />
        {data !== null ? (
          <Row>
            <Col xs={12}>
              <Tabs className='mb-2' activeTab={activeTab} toggleTab={toggleTab} />
  
              <TabContent activeTab={activeTab}>
                <TabPane tabId='1'>
                  <AccountTabContent data={data.general} />
                </TabPane>
                <TabPane tabId='2'>
                  <SecurityTabContent />
                </TabPane>
                <TabPane tabId='3'>
                  <RouteAllocationTabContent />
                </TabPane>
                <TabPane tabId='4'>
                  <BusAllocationTabContent />
                </TabPane>
              </TabContent>
            </Col>
          </Row>
        ) : null}
      </Fragment>
    )
  }
  
}

export default AccountSettings
