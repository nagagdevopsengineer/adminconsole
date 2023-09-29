// ** React Imports
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
// ** Custom Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

// ** Store & Actions
import { store } from '@store/store'
import { getRoute, deleteRoute } from '../store'

// ** Icons Imports
import { Slack, User, Settings, Database, Edit2, MoreVertical, FileText, Trash2, Archive } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'


// ** Renders Role Columns
/*const renderRole = row => {
  const roleObj = {
    subscriber: {
      class: 'text-primary',
      icon: User
    },
    maintainer: {
      class: 'text-success',
      icon: Database
    },
    editor: {
      class: 'text-info',
      icon: Edit2
    },
    author: {
      class: 'text-warning',
      icon: Settings
    },
    admin: {
      class: 'text-danger',
      icon: Slack
    }
  }

  const Icon = roleObj[row.role] ? roleObj[row.role].icon : Edit2

  return (
    <span className='text-truncate text-capitalize align-middle'>
      <Icon size={18} className={`${roleObj[row.role] ? roleObj[row.role].class : ''} me-50`} />
      {row.role}
    </span>
  )
}*/

/* const statusObj = {
  pending: 'light-warning',
  active: 'light-success',
  inactive: 'light-secondary'
} */

export const columns = () => {
  const [edit, setEdit] = useState(false)
  //const [selectedRow, setSelectedRow] = useState({})

  const handleCallback = (childData) => {
    setEdit(childData)
  }
  const toggleSidebar = () => setEdit(!edit)

  const handleDeleteAction = (row_id) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You want to delete this route!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Route!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        store.dispatch(deleteRoute(row_id))
      } else if (result.dismiss === MySwal.DismissReason.cancel) {
        MySwal.fire({
          title: 'Cancelled',
          text: 'Cancelled Delete :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-success'
          }
        })
      }
    })
  }

return (
 [
  {
    name: 'Route Name',
    sortable: true,
    minWidth: '300px',
    sortField: 'name',
    selector: row => row.attributes.name,
    cell: row => (
      <div className='d-flex justify-content-left align-items-center'>
        
        <div className='d-flex flex-column'>
          <Link
            to={`/apps/routes/view/${row.id}`}
            className='user_name text-truncate text-body'
            onClick={() => store.dispatch(getRoute(row.id))}
          >
            <span className='fw-bolder'>{row.attributes.name}</span>
          </Link>
        </div>
      </div>
    )
  },
  
  {
    name: 'Starting Point',
    minWidth: '138px',
    sortable: false,
    sortField: 'starting_point',
    selector: row => row.starting_point,
    cell: row => <span className='text-capitalize'>{row.stops[0].name}</span>
  },
  {
    name: 'Ending Point',
    minWidth: '230px',
    sortable: false,
    sortField: 'ending_point',
    selector: row => row.ending_point,
    cell: row => <span className='text-capitalize'>{row.stops[row.stops.length - 1].name}</span>
  },
  {
    name: 'Actions',
    minWidth: '100px',
    cell: row => (
      <div className='column-action'>
        <UncontrolledDropdown>
          <DropdownToggle tag='div' className='btn btn-sm'>
            <MoreVertical size={14} className='cursor-pointer' />
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              tag={Link}
              className='w-100'
              to={`/apps/routes/view/${row.id}`}
              onClick={() => store.dispatch(getRoute(row.id))}
            >
              <FileText size={14} className='me-50' />
              <span className='align-middle'>Details</span>
            </DropdownItem>
            <DropdownItem
              tag='a'
              href='/'
              className='w-100'
              onClick={e => {
                e.preventDefault()
                handleDeleteAction(row.id)
              }}
            >
              <Trash2 size={14} className='me-50' />
              <span className='align-middle'>Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
        {edit && < Sidebar open={true} toggleSidebar={toggleSidebar} editMode={edit} data={selectedRow} handleCallback={handleCallback} />}
      </div>
    )
  }
]
)
}
