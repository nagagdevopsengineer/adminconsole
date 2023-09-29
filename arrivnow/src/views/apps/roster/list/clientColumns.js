// ** React Imports
import { Link } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useState, Fragment } from "react"
import ModalData from "./modal"
import ModalTimeData from "./modalTime"
import moment from 'moment'
// ** Custom Components
import Avatar from '@components/avatar'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
// ** Store & Actions
import { store } from '@store/store'
import { deleteRoster } from '../store/client.js'

// ** Icons Imports
import { Slack, User, Settings, Database, Edit2, MoreVertical, FileText, Trash2, Archive } from 'react-feather'

// ** Reactstrap Imports
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'

/* const statusObj = {
  pending: 'light-warning',
  active: 'light-success',
  inactive: 'light-secondary'
} */


export const columns = () => {
  const [open, setOpen] = useState(false)
  const [openTime, setOpenTime] = useState(false)
  const [selectedData, setSelectedData] = useState("")
  const [fieldType, setFieldType] = useState("")
  const [dropdownList, setDropdownlist] = useState([])
  const bus_data = ["DL45123 - RED", "DL451234 - White", "DL451235 - Blue"]
  const route_data = ["Samsung manesar to gurgaon", "Samsung gurgaon to faridabaad", "Samsung gurgaon to noida"]

  const handleCallback = (childData) => {
    setOpen(childData)
  }
  const handleTimeCallback = (childData) => {
    setOpenTime(childData)
  }
  const handleSelectedData = (childData, fieldType, list) => {
    setSelectedData(childData)
    setFieldType(fieldType)
    setDropdownlist(list)
    setOpen(true)
  }

  const handleSelectedTimeData = (childData, fieldType) => {
    setSelectedData(childData)
    setFieldType(fieldType)
    setOpenTime(true)
  }

  const handleDeleteAction = (row_id) => {
    return MySwal.fire({
      title: 'Are you sure?',
      text: "You want to delete this roster!",
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes, Delete Roster!',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-danger ms-1'
      },
      buttonsStyling: false
    }).then(function (result) {
      if (result.value) {
        store.dispatch(deleteRoster(row_id))
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
    name: 'Date',
    minWidth: '138px',
    sortable: true,
    sortField: 'from_date',
    selector: row => row.attributes.to_date,
    cell: row => <span className='text-capitalize'>{moment(row.attributes.from_date).format('DD/MM/YYYY')} - {moment(row.attributes.to_date).format('DD/MM/YYYY')}</span>
  },
  {
    name: "Time",
    minWidth: "138px",
    sortable: true,
    sortField: "time",
    selector: (row) => row.attributes.time,
    cell: (row) => (
      <div className="d-flex justify-content-left align-items-center">
        <div className="d-flex flex-column">
      <span className="text-capitalize" onClick={() => handleSelectedTimeData(row.start_time, "start_time")}>{moment(row.attributes.time, "hh:mm:ss").format("hh:mm A")}</span>
      </div>
      {openTime && (
          <ModalTimeData
            selectedData={selectedData}
            handleTimeCallback={handleTimeCallback}
            openTime={openTime}
            fieldType={fieldType}
          />
        )}
      </div>
    )
  },
  {
    name: 'Bus No',
    minWidth: '138px',
    sortable: true,
    sortField: 'bus.vehicle_number',
    selector: row => row.busno,
    cell: row => <span className='text-capitalize cur_point' onClick={() => handleSelectedData(row.busno, "busno", bus_data)}>{(row.attributes.bus.data) ? row.attributes.bus.data.attributes.vehicle_number : ''} {(row.attributes.bus.data) ? '-' : '' }{(row.attributes.bus.data) ? row.attributes.bus.data.attributes.colour : ''}</span>
  },
  {
    name: 'Route',
    minWidth: '138px',
    sortable: true,
    sortField: 'route.name',
    selector: row => row.route.name,
    cell: row => <span className='text-capitalize cur_point' onClick={() => handleSelectedData(row.route, "route", route_data)}>{(row.attributes.route.data) ? row.attributes.route.data.attributes.name : ''}</span>
    
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
        {open && (
            <ModalData
              selectedData={selectedData}
              handleCallback={handleCallback}
              open={open}
              fieldType={fieldType}
              dropdownList={dropdownList}
            />
          )}
      </div>
    )
  }
]
 )
}