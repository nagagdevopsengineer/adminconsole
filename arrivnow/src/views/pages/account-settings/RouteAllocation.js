// ** Reactstrap Imports
import { Row, Col, Card, CardHeader, CardBody, CardTitle, Input, Label, Button } from 'reactstrap'

// ** Icons Imports
import { Check, X, Link } from 'react-feather'

const connectedAccounts = [
  {
    checked: true,
    title: 'Samsung gurgaon to faridabaad',
    logo: require('@src/assets/images/svg/map-marker-2.png').default
  },
  {
    checked: false,
    title: 'Samsung manesar to gurgaon',
    logo: require('@src/assets/images/svg/map-marker-2.png').default
  }
]

const connectedBus = [
  {
    checked: true,
    title: 'DL14 RD 7485',
    subtitle: 'Samsung gurgaon to faridabaad',
    logo: require('@src/assets/images/logo/bus_icon.png').default
  },
  {
    checked: false,
    title: 'DL14 RC 3652',
    subtitle: 'Samsung manesar to gurgaon',
    logo: require('@src/assets/images/logo/bus_icon.png').default
  },
  {
    checked: true,
    title: 'DL18 XC 1234',
    subtitle: 'Samsung gurgaon to faridabaad',
    logo: require('@src/assets/images/logo/bus_icon.png').default
  },
  {
    checked: false,
    title: 'DL19 ED 6859',
    subtitle: 'Samsung gurgaon to faridabaad',
    logo: require('@src/assets/images/logo/bus_icon.png').default
  }
]

const RouteAllocationTabContent = () => {
  return (
    <Row>
      <Col md='6'>
        <Card>
          <CardHeader className='border-bottom'>
            <CardTitle tag='h4'>Route Auto Approval </CardTitle>
          </CardHeader>
          <CardBody className='pt-2'>
            <p>Set auto route approval</p>
            {connectedAccounts.map((item, index) => {
              return (
                <div className='d-flex mt-2' key={index}>
                  <div className='flex-shrink-0'>
                    <img className='me-1' src={item.logo} alt={item.title} height='38' width='38' />
                  </div>
                  <div className='d-flex align-item-center justify-content-between flex-grow-1'>
                    <div className='me-1'>
                      <p className='fw-bolder mb-0'>{item.title}</p>
                      <span>{item.subtitle}</span>
                    </div>
                    <div className='mt-50 mt-sm-0'>
                      <div className='form-switch'>
                        <Input type='switch' defaultChecked={item.checked} id={`account-${item.title}`} />
                        <Label className='form-check-label' for={`account-${item.title}`}>
                          <span className='switch-icon-left'>
                            <Check size={14} />
                          </span>
                          <span className='switch-icon-right'>
                            <X size={14} />
                          </span>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>
      </Col>

      <Col md='6'>
        <Card>
          <CardHeader className='border-bottom'>
            <CardTitle tag='h4'>Bus Auto Approval </CardTitle>
          </CardHeader>
          <CardBody className='pt-2'>
            <p>Set auto bus approval</p>
            {connectedBus.map((item, index) => {
              return (
                <div className='d-flex mt-2' key={index}>
                  <div className='flex-shrink-0'>
                    <img className='me-1' src={item.logo} alt={item.title} height='38' width='38' />
                  </div>
                  <div className='d-flex align-item-center justify-content-between flex-grow-1'>
                    <div className='me-1'>
                      <p className='fw-bolder mb-0'>{item.title}</p>
                      <span>{item.subtitle}</span>
                    </div>
                    <div className='mt-50 mt-sm-0'>
                      <div className='form-switch'>
                        <Input type='switch' defaultChecked={item.checked} id={`account-${item.title}`} />
                        <Label className='form-check-label' for={`account-${item.title}`}>
                          <span className='switch-icon-left'>
                            <Check size={14} />
                          </span>
                          <span className='switch-icon-right'>
                            <X size={14} />
                          </span>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}

export default RouteAllocationTabContent
