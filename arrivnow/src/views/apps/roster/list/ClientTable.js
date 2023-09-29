// ** React Imports
import { Fragment, useState, useEffect } from 'react'

// ** Invoice List Sidebar
import Sidebar from './ClientSidebar'
import moment from 'moment'
// ** Table Columns
import { columns } from './clientColumns'

// ** Store & Actions
import { getData } from '../store/client.js'
import { useDispatch, useSelector } from 'react-redux'
import PickerDefault from "../../../forms/form-elements/datepicker/PickerDefault"
import 'flatpickr/dist/flatpickr.min.css'
import Flatpickr from 'react-flatpickr'
// ** Third Party Components
import Select from 'react-select'
import ReactPaginate from 'react-paginate'
import DataTable from 'react-data-table-component'
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy } from 'react-feather'
import ExportExcel from "@src/views/components/export-excel/client_roster_excel.js"
import UILoader from '@components/ui-loader'
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
  Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ store, toggleSidebar, handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  // ** Converts table to CSV
  const [searchDate, setSearchDate] = useState('')
  const [searchTime, setSearchTime] = useState('')
  const [searchStatus, setSearchStatus] = useState('')
  const [searchBusNo, setSearchBusNo] = useState('')
  const [searchRoute, setSearchRoute] = useState('')

  const [datefilter, setdatefilter] = useState(0)
  const [timefilter, settimefilter] = useState(0)
  const [busnofilter, setbusnofilter] = useState(0)
  const [routefilter, setroutefilter] = useState(0)
  const [statusfilter, setstatusfilter] = useState(0)

  const [centeredModal, setCenteredModal] = useState(false)

 const [showAdvancFilter, setAdvanceFilter] = useState(false)
 const showAF = () => { 
  setAdvanceFilter(true)
  setCenteredModal(!centeredModal)
}
 const hideAF = () => setAdvanceFilter(false)

const handleStatusFilter = (e) => {
  const value = e.target.value 
  setSearchStatus(value)
}

const handlebusnoFilter = (e) => {
  const value = e.target.value 
  setSearchBusNo(value)
}

const handleDateFilter = (e) => {

  setSearchDate(moment(e[0]).format("DD/MM/YYYY"))
}
const handleRouteFilter = (e) => {
  const value = e.target.value 
  setSearchRoute(value)
}
const handleTimeFilter = (e) => {

  setSearchTime(moment(e[0]).format("hh:mm A"))
}
const searchFilterData = (event) => {

  event.preventDefault()
  dispatch(
    getData({
      s_date: searchDate,
      start_time: searchTime,
      busno: searchBusNo,
      route: searchRoute,
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
      <Row className='mb-2'>
        <Col>  
        <div className='vertically-centered-modal'>
        {!showAdvancFilter ? <Button color='primary' outline onClick={() => setCenteredModal(!centeredModal)}>
          Show Advance filter
        </Button> : null}
        <Modal isOpen={centeredModal} toggle={() => setCenteredModal(!centeredModal)} className='modal-dialog-centered'>
          <ModalHeader toggle={() => setCenteredModal(!centeredModal)}>Choose Advance filter</ModalHeader>
          <ModalBody>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='date'  checked={datefilter} onChange={() => setdatefilter(!datefilter)}/>
              <Label for='basic-cb-unchecked' className='form-check-label'>
               Date 
              </Label>
            </div><br/>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='date'  checked={timefilter} onChange={() => settimefilter(!timefilter)}/>
              <Label for='basic-cb-unchecked' className='form-check-label'>
               Time 
              </Label>
            </div><br/>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='busno' checked={busnofilter} onChange={() => setbusnofilter(!busnofilter)} />
              <Label for='basic-cb-unchecked' className='form-check-label'>
                BusNo
              </Label>
            </div><br/>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='drivername' checked={routefilter} onChange={() => setroutefilter(!routefilter)} />
              <Label for='basic-cb-unchecked' className='form-check-label'>
                Route
              </Label>
            </div><br/>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='status'  checked={statusfilter} onChange={() => setstatusfilter(!statusfilter)} />
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
            {datefilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='name'>
            Date
              </Label>
              <Flatpickr className='form-control'
               value={searchDate} onChange={handleDateFilter} id='default-picker' />
              {/* <Flatpickr
        value={searchDate}
        id='range-picker'
        className='form-control'
        onChange={date => setSearchDate(date)}
        options={{
          mode: 'range',
          defaultDate: ['2020-02-01', '2020-02-15']
        }}
      /> */}
              {/* <Input id='user_name' placeholder='' value={searchName} onChange={handleNameFilter}/> */}
            </Col> : null}
            {timefilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='name'>
            Time
              </Label>
              <Flatpickr className='form-control'
               value={searchTime} onChange={handleTimeFilter} id='timepicker'
               options={{
                 enableTime: true,
                 noCalendar: true,
                 dateFormat: 'h:i',
                 time_24hr: false
               }} />
             
              
            </Col> : null}
            {busnofilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='pre_route'>
                BusNo
              </Label>
              <Input
                type='text'
                id='busno'
                placeholder=''
                value={searchBusNo}
                onChange={handlebusnoFilter}
              />
            </Col> : null}
            {routefilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='next_route'>
                Route
              </Label>
              <Input id='phone_number' placeholder='' value={searchRoute} onChange={handleRouteFilter}/>
            </Col> : null} 
            {statusfilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='bus'>
                status:
              </Label>
              <Input id='country' placeholder='' value={searchStatus} onChange={handleStatusFilter}/>
            </Col> : null}
            <Row>
             <Col lg='2' md='6' className='mb-1'>
                <Button color='primary' className='px-3' onClick={searchFilterData}>
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
        </div>  
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
          <ExportExcel csvData={store.data} fileName='roster_client' />

            <Button className='add-new-user' color='primary' onClick={toggleSidebar}>
              Add Roster
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const RostersList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.client_rosters)
 
  // ** States
  const [sort, setSort] = useState('desc')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortColumn, setSortColumn] = useState('id')
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // ** Function to toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // ** Get data on mount
  useEffect(() => {
    dispatch(
      getData({
        sort,
        sortColumn,
        q: searchTerm,
        perPage: rowsPerPage,
        page: currentPage
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

export default RostersList
