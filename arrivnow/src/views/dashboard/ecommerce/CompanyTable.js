// ** Custom Components
import Avatar from '@components/avatar'

// ** Reactstrap Imports
import { Table, Card } from 'reactstrap'

// ** Icons Imports
import { Monitor, Coffee, Watch, TrendingUp, TrendingDown } from 'react-feather'

const CompanyTable = () => {
  // ** vars

  const data = [
    {
      img: require('@src/assets/images/icons/toolbox.svg').default,
      name: 'Deeraj',
      email: 'meguc@ruj.io',
      icon: <Monitor size={18} />,
      contact: '9854768922',
      views: '23.4k',
      time: '24 hours',
      revenue: '891.2',
      buses: '10'
    },
    {
      img: require('@src/assets/images/icons/parachute.svg').default,
      name: 'Amit',
      email: 'vecav@hodzi.co.uk',
      icon: <Coffee size={18} />,
      contact: '7894561250',
      views: '78k',
      time: '2 days',
      revenue: '668.51',
      buses: '8'
    },
    {
      img: require('@src/assets/images/icons/brush.svg').default,
      name: 'Sanjeev',
      email: 'davcilse@is.gov',
      icon: <Watch size={18} />,
      contact: '8485962048',
      views: '162',
      time: '5 days',
      revenue: '522.29',
      buses: '5'
    },
    {
      img: require('@src/assets/images/icons/star.svg').default,
      name: 'Sohan',
      email: 'us@cuhil.gov',
      icon: <Monitor size={18} />,
      contact: '7894589623',
      views: '214',
      time: '24 hour',
      revenue: '291.01',
      buses: '3'
    }
  ]
  /* const colorsArr = {
    Technology: 'light-primary',
    Grocery: 'light-success',
    Fashion: 'light-warning'
  } */

  const renderData = () => {
    return data.map(col => {
      const IconTag = col.salesUp ? (
        <TrendingUp size={15} className='text-success' />
      ) : (
        <TrendingDown size={15} className='text-danger' />
      )

      return (
        <tr key={col.name}>
          <td>
            <div className='d-flex align-items-center'>
              <div>
                <div className='fw-bolder'>{col.name}</div>
              </div>
            </div>
          </td>
          <td>
            <div className='d-flex align-items-center'>
              <span>{col.email}</span>
            </div>
          </td>
          <td className='text-nowrap'>
            <div className='d-flex flex-column'>
              <span className='font-small-2 text-muted'>in {col.contact}</span>
            </div>
          </td>
          <td>{col.buses}</td>
        </tr>
      )
    })
  }

  return (
    <Card className='card-company-table'>
      <Table responsive>
        <thead>
          <tr>
            <th>Contractor</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Number of Buses</th>
          </tr>
        </thead>
        <tbody>{renderData()}</tbody>
      </Table>
    </Card>
  )
}

export default CompanyTable
