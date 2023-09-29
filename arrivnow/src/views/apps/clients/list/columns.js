// ** React Imports
import { Link } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './Sidebar'
// ** Custom Components
import Avatar from '@components/avatar'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
// ** Store & Actions
import { store } from '@store/store'
import { getClient, deleteClient } from '../store'

// ** Icons Imports
import { Slack, User, Settings, Database, Edit2, MoreVertical, FileText, Trash2, Archive } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

// ** Renders Client Columns
const renderClient = row => {
  const stateNum = Math.floor(Math.random() * 6),
    states = ['light-success', 'light-danger', 'light-warning', 'light-info', 'light-primary', 'light-secondary'],
    color = states[stateNum]
  
  const user_image = (row.attributes.logo.data) ? row.attributes.logo.data[0].attributes.url : ''
  if (user_image) {
    return <Avatar className='me-1' img={process.env.REACT_APP_IMAGEBASEURL + user_image} width='32' height='32' />
  } else {
    return <Avatar color={color || 'primary'} className='me-1' content={row.attributes.name || 'John Doe'} initials />
  }
}

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

const statusObj = {
  pending: 'light-warning',
  approved: 'light-success',
  rejected: 'light-secondary'
}

export const columns = () => {
  const [edit, setEdit] = useState(false)
  const [selectedRow, setSelectedRow] = useState({})

  const handleCallback = (childData) => {
    setEdit(childData)
  }
  const toggleSidebar = () => setEdit(!edit)

  const handleDeleteAction = (row_id) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You want to delete this client!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Client!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        store.dispatch(deleteClient(row_id))
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
  return ([
  {
    name: 'Name',
    sortable: true,
    minWidth: '300px',
    sortField: 'name',
    selector: row => row.attributes.name,
    cell: row => (
      <div className='d-flex justify-content-left align-items-center'>
        {renderClient(row)}
        <div className='d-flex flex-column'>
          <Link
            to={`/apps/clients/view/${row.id}`}
            className='user_name text-truncate text-body'
            onClick={() => store.dispatch(getClient(row.id))}
          >
            <span className='fw-bolder'>{row.attributes.name}</span>
          </Link>
        </div>
      </div>
    )
  },
  
  {
    name: 'Email ID',
    minWidth: '138px',
    sortable: true,
    sortField: 'email',
    selector: row => row.email,
    cell: row => <span>{row.attributes.email}</span>
  },
  {
    name: 'Phone Number',
    minWidth: '230px',
    sortable: true,
    sortField: 'mobile',
    selector: row => row.contact,
    cell: row => <span className='text-capitalize'>{row.attributes.mobile ?? ''}</span>
  },
  {
    name: 'Company Name',
    minWidth: '230px',
    sortable: true,
    sortField: 'companyname',
    selector: row => row.companyname,
    cell: row => <span className='text-capitalize'>{row.attributes.companyname ?? ''}</span>
  },
  {
    name: 'Status',
    minWidth: '138px',
    sortable: true,
    sortField: 'status',
    selector: row => row.status,
    cell: row => (
      <Badge className='text-capitalize' color={statusObj[row.attributes.status]} pill>
        {row.attributes.status}
      </Badge>
    )
  },
  /*{
    name: 'Buses',
    minWidth: '138px',
    cell: row => (
      <div className='d-flex justify-content-left align-items-center'>
        <div className='d-flex flex-column'>
          <Link
            to={`/apps/buses/list/${row.id}`}
            className='user_name text-truncate text-body btn btn-warning'
          >
            <span className='fw-bolder'>View Buses</span>
          </Link>
        </div>
      </div>
    )
  },*/
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
              to={`/apps/clients/view/${row.id}`}
              onClick={() => store.dispatch(getClient(row.id))}
            >
              <FileText size={14} className='me-50' />
              <span className='align-middle'>Details</span>
            </DropdownItem>
            <DropdownItem
              tag={Link}
              className='w-100'
              to={`/apps/contractors/list/${row.id}`}
            >
              <FileText size={14} className='me-50' />
              <span className='align-middle'>View Contractors</span>
            </DropdownItem>
          <DropdownItem tag='a' href='/' className='w-100'
             onClick={(e) => {
              e.preventDefault()
              setEdit(true)
              setSelectedRow(row)
              console.log('ignore', selectedRow)
            }}>
              <Archive size={14} className='me-50' />
              <span className='align-middle'>Edit</span>
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
        { edit && <Sidebar open={true} toggleSidebar={toggleSidebar} editMode={edit} data={selectedRow} handleCallback={handleCallback} /> }
      
      </div>
    )
  }
]
)
}
