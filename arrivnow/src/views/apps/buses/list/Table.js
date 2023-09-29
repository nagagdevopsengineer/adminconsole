// ** React Imports
import { Fragment, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
// ** Invoice List Sidebar
import Sidebar from './Sidebar'

// ** Table Columns
import { columns } from './columns'

// ** Store & Actions
import { getData } from '../store'
import { useDispatch, useSelector } from 'react-redux'

// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy } from 'react-feather'
import UILoader from '@components/ui-loader'
import BusExportExcel from "@src/views/components/export-excel/bus_excel.js"

// ** Utils
/*import { selectThemeColors } from '@utils'*/

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  Input,
  Label,
  Button,
  CardBody,
  CardTitle,
  CardHeader,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  UncontrolledDropdown,
  Modal, ModalHeader, ModalBody, ModalFooter, Alert
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ store, toggleSidebar, handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  const dispatch = useDispatch()
  const [searchVehicleNumber, setSearchVehicleNumber] = useState('')
  const [searchBusCapacity, setSearchBusCapacity] = useState('')
  const [searchAllocatedRoute, setSearchAllocatedRoute] = useState('')
  const [searchStatus, setSearchStatus] = useState('')


  const [vehicleNumberFilter, setVehicleNumberFilter] = useState(0)
  const [busCapacityFilter, setBusCapacityFilter] = useState(0)
  const [allocatedRouteFilter, setAllocatedRouteFilter] = useState(0)
  const [statusFilter, setStatusFilter] = useState(0)

  const [centeredModal, setCenteredModal] = useState(false)
  const [showAdvancFilter, setAdvanceFilter] = useState(false)
  const showAF = () => { 
    setAdvanceFilter(true)
    setCenteredModal(!centeredModal)
  }
  const hideAF = () => setAdvanceFilter(false)

  // ** Function to handle vehicle number filter
  const handleVehicleNumberFilter = e => {
    const value = e.target.value
    setSearchVehicleNumber(value)
  }

  // ** Function to handle bus capacity filter
  const handleBusCapacityFilter = e => {
    const value = e.target.value
    setSearchBusCapacity(value)
  }
  // ** Function to handle allocated route filter
  const handleAllocatedRouteFilter = e => {
    const value = e.target.value
    setSearchAllocatedRoute(value)
  }
  // ** Function to handle status filter
  const handleStatusFilter = e => {
    const value = e.target.value
    setSearchStatus(value)
  }

   // ** Function to handle buscapacity and status filter
   const searchFilterDAta = (event) => {
    event.preventDefault()
    dispatch(
      getData({
        q:'',
        vehicle_number: searchVehicleNumber,
        bus_capacity: searchBusCapacity,
        allocate_route: searchAllocatedRoute,
        status: searchStatus,
        page: 1,
        perPage: 10,
        sort: "desc",
        sortColumn: "id"
      })
    )
  }
  return (
    <div className='invoice-list-table-header w-100 me-1 ms-50 mt-2 mb-75'>
      <Row>
        <Col>  
        <div className='vertically-centered-modal'>
        {!showAdvancFilter ? <Button color='primary' outline onClick={() => setCenteredModal(!centeredModal)}>
          Show Advance filter
        </Button> : null}
        <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Choose Advance filter</ModalHeader>
          <ModalBody>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='vehiclenumber'  checked={vehicleNumberFilter} onChange={() => setVehicleNumberFilter(!vehicleNumberFilter)}/>
              <Label for='basic-cb-unchecked' className='form-check-label'>
                Vehicle Number
              </Label>
            </div><br/>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='buscapacity' checked={busCapacityFilter} onChange={() => setBusCapacityFilter(!busCapacityFilter)} />
              <Label for='basic-cb-unchecked' className='form-check-label'>
                Bus Capacity
              </Label>
            </div><br/>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='allocatedroute' checked={allocatedRouteFilter} onChange={() => setAllocatedRouteFilter(!allocatedRouteFilter)} />
              <Label for='basic-cb-unchecked' className='form-check-label'>
              Allocated Route
              </Label>
            </div><br/>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='status'  checked={statusFilter} onChange={() => setStatusFilter(!statusFilter)} />
              <Label for='basic-cb-unchecked' className='form-check-label'>
                Status
              </Label>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={showAF}>
              Filter
            </Button>
          </ModalFooter>
        </Modal>
      { showAdvancFilter ? <Row className='mt-1 mb-50'>
            {vehicleNumberFilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='name'>
                Vehicle Number:
              </Label>
              <Input id='vehicle_number' placeholder='' value={searchVehicleNumber} onChange={handleVehicleNumberFilter} />
            </Col> : null}
            {busCapacityFilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='pre_route'>
                Bus Capacity:
              </Label>
              <Input
                type='text'
                id='bus_capacity'
                placeholder=''
                value={searchBusCapacity}
                onChange={handleBusCapacityFilter}
              />
            </Col> : null}
            {allocatedRouteFilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='next_route'>
                Allocated Route:
              </Label>
              <Input id='allocated_route' placeholder='' value={searchAllocatedRoute} on onChange={handleAllocatedRouteFilter}/>
            </Col> : null} 
            {statusFilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='bus'>
                status:
              </Label>
              <Input id='status' placeholder='' value={searchStatus} onChange={handleStatusFilter} />
            </Col> : null}
            <Row>
             <Col lg='2' md='6' className='mb-1'>
                <Button color='primary' className='px-3' onClick={searchFilterDAta}>
                  Search
                </Button>
            </Col>
            <Col lg='2' md='6' className='mb-1'>
                <Button className='px-3' color='secondary' outline onClick={hideAF}>
                  Cancel
                </Button>
            </Col>
            </Row>
          </Row> : null}
        </div><br />
        </Col>
      </Row>
      <Row>
        <Col xl='6' className='d-flex align-items-center p-0'>
          <div className='d-flex align-items-center w-100'>
            <label htmlFor='rows-per-page'>Show</label>
            <Input
              className='mx-50'
              type='select'
              id='rows-per-page'
              value={rowsPerPage}
              onChange={handlePerPage}
              style={{ width: '5rem' }}
            >
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='50'>50</option>
            </Input>
            <label htmlFor='rows-per-page'>Record</label>
          </div>
        </Col>
        <Col
          xl='6'
          className='d-flex align-items-sm-center justify-content-xl-end justify-content-start flex-xl-nowrap flex-wrap flex-sm-row flex-column pe-xl-1 p-0 mt-xl-0 mt-1'
        >
          <div className='d-none align-items-center mb-sm-0 mb-1 me-1'>
            <label className='mb-0' htmlFor='search-invoice'>
              Search:
            </label>
            <Input
              id='search-invoice'
              className='ms-50 w-100'
              type='text'
              value={searchTerm}
              onChange={e => handleFilter(e.target.value)}
            />
          </div>

          <div className='d-flex align-items-center table-header-actions'>
            
            <BusExportExcel csvData={store.data} fileName='bus' />
            
            <Button className='add-new-user' color='primary' onClick={toggleSidebar}>
              Add Bus
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const BusesList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.buses)

  console.log(store.data)
  // ** States
  const [sort, setSort] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('id')
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const { id } = useParams()
  if (id) {
    localStorage.setItem('contractor_uuid', id)
  }
  // ** Get data on mount
  useEffect(() => {
    dispatch(
       getData({
         sort,
         sortColumn,
         q: searchTerm,
         page: currentPage,
         perPage: rowsPerPage
       })
    )
  }, [dispatch, store.data.length, sort, sortColumn, currentPage, rowsPerPage])


  // ** Function in get data on page change
  const handlePagination = page => {
    setCurrentPage(page.selected + 1)
  }

  // ** Function in get data on rows per page
  const handlePerPage = e => {
    setCurrentPage(1)
    const value = parseInt(e.currentTarget.value)
    setRowsPerPage(value)
  }

  // ** Function in get data on search query change
  const handleFilter = val => {
    setSearchTerm(val)
  }

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(store.total / rowsPerPage))

    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        pageCount={count || 1}
        activeClassName='active'
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={page => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        containerClassName={'pagination react-paginate justify-content-end my-2 pe-1'}
      />
    )
  }

  // ** Table data to render
  const dataToRender = () => {
    const filters = {
      q: searchTerm
    }

    const isFiltered = Object.keys(filters).some(function (k) {
      return filters[k].length > 0
    })

    if (store.data.length > 0) {
      return store.data
    } else if (store.data.length === 0 && isFiltered) {
      return []
    } else {
      return store.allData.slice(0, rowsPerPage)
    }
  }

  const handleSort = (column, sortDirection) => {
    setSort(sortDirection)
    setSortColumn(column.sortField)
  }

  const login_data = JSON.parse(localStorage.getItem('userData'))
  let is_acess = true
  if (login_data.role !== 'admin' && login_data.status !== 'approved') {
    is_acess = false
  } 

  return !is_acess ? <h3>You have no permission to access this section.</h3> : (
    <UILoader blocking={store.block_data}>
    <Fragment>
     
      <Card className='overflow-hidden'>
        <div className='react-dataTable'>
          <DataTable
            noHeader
            subHeader
            sortServer
            pagination
            responsive
            paginationServer
            columns={columns()}
            onSort={handleSort}
            sortIcon={<ChevronDown />}
            className='react-dataTable'
            paginationComponent={CustomPagination}
            data={dataToRender()}
            subHeaderComponent={
              <CustomHeader
                store={store}
                searchTerm={searchTerm}
                rowsPerPage={rowsPerPage}
                handleFilter={handleFilter}
                handlePerPage={handlePerPage}
                toggleSidebar={toggleSidebar}
              />
            }
          />
        </div>
      </Card>

      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </Fragment>
    </UILoader>
  )
}

export default BusesList
