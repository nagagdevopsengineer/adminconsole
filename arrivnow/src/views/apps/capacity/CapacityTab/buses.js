// ** React Imports
import { Card, CardHeader, CardTitle, CardBody, Table } from 'reactstrap'

const recentQueueArr = [
  {
    Bus: 'DL14 RD 7485',
    capacity: 50,
    allocated: 36,
    vacent: 14,
    queue: 12
  },
  {
    Bus: 'DL14 RX 4589',
    capacity: 50,
    allocated: 14,
    vacent: 36,
    queue: 10
  },
  {
    Bus: 'DL18 XC 1234',
    capacity: 40,
    allocated: 28,
    vacent: 12,
    queue: 8
  },
  {
    Bus: 'DL19 DS 7412',
    capacity: 40,
    allocated: 28,
    vacent: 12,
    queue: 9
  }
]

const BusLog = () => {
  const ChatWrapper = 'div'
  return (
    <div className='active-chat'>
      <div className="chat-navbar">
        <header className='chat-header'>
          <div className='d-flex align-items-center'>
            <h6 className='mb-0'>Bus Details</h6>
          </div>
        </header>
      </div>  
      <ChatWrapper className='user-chats' options={{ wheelPropagation: false }}>
        <Table className='text-center' responsive bordered>
          <thead>
            <tr>
              <th className='text-start'>Bus</th>
              <th>Capacity</th>
              <th>Allocated</th>
              <th>Vacant</th>
              <th>Queue</th>
            </tr>
          </thead>
          <tbody>
            {recentQueueArr.map((item, index) => {
              return (
                <tr key={index}>
                  <td className='text-start'>
                    <span className='fw-bolder'>{item.Bus}</span>
                  </td>
                  <td>{item.capacity}</td>
                  <td>{item.allocated}</td>
                  <td>{item.vacent}</td>
                  <td>{item.queue}</td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        </ChatWrapper>
    </div>
  )
}

export default BusLog
