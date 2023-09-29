// ** React Imports
import { useContext } from 'react'

// ** Reactstrap Imports
import { Row, Col } from 'reactstrap'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Demo Components
import Earnings from '@src/views/ui-elements/cards/analytics/Earnings'
import DashboardStatsCard from './DashboardStat'
import GoalOverview from '@src/views/ui-elements/cards/analytics/GoalOverview'
import OrdersBarChart from '@src/views/ui-elements/cards/statistics/OrdersBarChart'
import ProfitLineChart from '@src/views/ui-elements/cards/statistics/ProfitLineChart'

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'

const CapacityDashboard = () => {
  // ** Context
  const { colors } = useContext(ThemeColors)

  return (
    <div id='dashboard-ecommerce'>
      <Row className='match-height'>
        <Col xl='12' md='12' xs='12'>
          <DashboardStatsCard cols={{ xl: '4', sm: '6' }} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='6' md='12'>
          <Row className='match-height'>
            <Col lg='6' md='3' xs='6'>
              <OrdersBarChart warning={colors.warning.main} />
            </Col>
            <Col lg='6' md='3' xs='6'>
              <ProfitLineChart info={colors.info.main} />
            </Col>
            <Col lg='12' md='6' xs='12'>
              <Earnings success={colors.success.main} />
            </Col>
          </Row>
        </Col>
        <Col lg='6' md='6' xs='12'>
          <GoalOverview success={colors.success.main} />
        </Col>
      </Row>
    </div>
  )
}

export default CapacityDashboard
