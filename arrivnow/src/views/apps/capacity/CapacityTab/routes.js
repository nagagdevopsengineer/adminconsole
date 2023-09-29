// ** React Imports
import { useState } from 'react'

// ** Third Party Components
import classnames from 'classnames'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { X, Search } from 'react-feather'

// ** Reactstrap Imports
import { CardText, InputGroup, InputGroupText, Input} from 'reactstrap'

const RoutesPanel = props => {
  // ** Props & Store
  const { sidebar, handleSidebar} = props

  // ** State
  const [query, setQuery] = useState('')
  const [filteredContacts, setFilteredContacts] = useState([])

  // ** Handles User Chat Click
  const handleUserClick = () => {
    if (sidebar === true) {
      handleSidebar()
    }
  }

  const contacts = [
    {
        id: '1',
        Name: 'Samsung gurgaon to faridabaad'
    },
    {
        id: '2',
        Name: 'Samsung manesar to gurgaon'
    }
  ]

  // ** Renders Routes
  const renderRoutes = () => {
    if (contacts && contacts.length) {
      if (query.length && !filteredContacts.length) {
        return (
          <li className='no-results show'>
            <h6 className='mb-0'>No Routes Found</h6>
          </li>
        )
      } else {
        const arrToMap = query.length && filteredContacts.length ? filteredContacts : contacts
        return arrToMap.map(item => {
          return (
            <li key={item.id} onClick={() => handleUserClick(item.id)}>
              <div className='chat-info flex-grow-1'>
                <h5 className='mb-0'>{item.Name}</h5>
              </div>
            </li>
          )
        })
      }
    } else {
      return null
    }
  }

  // ** Handles Filter
  const handleFilter = e => {
    setQuery(e.target.value)
    const searchFilterFunction = contact => contact.name.toLowerCase().includes(e.target.value.toLowerCase())
    const filteredContactssArr = contacts.filter(searchFilterFunction)
    setFilteredContacts([...filteredContactssArr])
  }

  return (
    <div className='chat-application'>
    <div className='sidebar-left'>
      <div className='sidebar'>
        <div
          className={classnames('sidebar-content', {
            show: sidebar === false
          })}
        >
          <div className='chat-fixed-search'>
            <div className='d-flex align-items-center w-100'>
              <InputGroup className='input-group-merge ms-1 w-100'>
                <InputGroupText className='round'>
                  <Search className='text-muted' size={14} />
                </InputGroupText>
                <Input
                  value={query}
                  className='round'
                  placeholder='Search route'
                  onChange={handleFilter}
                />
              </InputGroup>
            </div>
          </div>
          <PerfectScrollbar className='chat-user-list-wrapper list-group' options={{ wheelPropagation: false }}>
            <h4 className='chat-list-title'>Routes</h4>
            <ul className='chat-users-list chat-list media-list'>{renderRoutes()}</ul>
          </PerfectScrollbar>
        </div>
      </div>
    </div>
    </div>
  ) 
}

export default RoutesPanel