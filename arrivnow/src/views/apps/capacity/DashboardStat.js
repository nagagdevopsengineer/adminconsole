// ** Third Party Components
import classnames from 'classnames'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'

// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col } from 'reactstrap'

const DashboardStatsCard = ({ cols }) => {
    const data = [
        {
            title: '500',
            subtitle: 'Employees',
            color: 'light-primary',
            icon: <User size={24} />,
            img: require('@src/assets/images/logo/person.png').default
        },
        {
            title: '25',
            subtitle: 'Buses',
            color: 'light-success',
            icon: <Box size={24} />,
            img: require('@src/assets/images/logo/bus.png').default
        },
        {
            title: '60',
            subtitle: 'Routes',
            color: 'light-success',
            icon: <TrendingUp size={24} />,
            img: require('@src/assets/images/logo/route.png').default
        }
    ]

  const renderData = () => {
    return data.map((item, index) => {
      const colMargin = Object.keys(cols)
      const margin = index === 2 ? 'sm' : colMargin[0]
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin}-0`]: index !== data.length - 1
          })}
        >
          <div className='d-flex align-items-center'>
            <Avatar color={item.color} img={item.img} className='me-1 p-1' imgClassName='rounded-0' imgWidth='20'  imgHeight='20' />
            <div className='my-auto'>
              <h4 className='fw-bolder mb-0'>{item.title}</h4>
              <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
            </div>
          </div>
        </Col>
      )
    })
  }

  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>Statistics</CardTitle>
        <CardText className='card-text font-small-2 me-25 mb-0'>Updated 1 month ago</CardText>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default DashboardStatsCard
