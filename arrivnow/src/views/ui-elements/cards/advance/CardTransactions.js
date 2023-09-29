// ** Custom Components
import Avatar from '@components/avatar'

// ** Icons Imports
import * as Icon from 'react-feather'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody } from 'reactstrap'

const CardTransactions = () => {
  const transactionsArr = [
    {
      title: 'Samsung gurgaon to faridabaad',
      color: 'light-danger',
      subtitle: '',
      amount: '30',
      Icon: Icon['Map'],
      down: true
    },
    {
      title: 'Samsung delhi to faridabaad',
      color: 'light-danger',
      subtitle: '',
      amount: '25',
      Icon: Icon['Map']
    },
    {
      title: 'Samsung manesar to gurgaon',
      color: 'light-danger',
      subtitle: '',
      amount: '20',
      Icon: Icon['Map']
    },
    {
      title: 'Samsung manesar to noida',
      color: 'light-danger',
      subtitle: '',
      amount: '18',
      Icon: Icon['Map'],
      down: true
    }
  ]

  const renderTransactions = () => {
    return transactionsArr.map(item => {
      return (
        <div key={item.title} className='transaction-item'>
          <div className='d-flex'>
            <Avatar className='rounded' color={item.color} icon={<item.Icon size={18} />} />
            <div>
              <h6 className='transaction-title'>{item.title}</h6>
              <small>{item.subtitle}</small>
            </div>
          </div>
          <div className={`fw-bolder ${item.down ? 'text-danger' : 'text-danger'}`}>{item.amount}</div>
        </div>
      )
    })
  }

  return (
    <Card className='card-transaction'>
      <CardHeader>
        <CardTitle tag='h4'>Most queued routes</CardTitle>
        <Icon.MoreVertical size={18} className='cursor-pointer' />
      </CardHeader>
      <CardBody>{renderTransactions()}</CardBody>
    </Card>
  )
}

export default CardTransactions
