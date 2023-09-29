// ** React Imports
import { Fragment, useState, useEffect } from 'react'

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
import ExportExcel from "@src/views/components/export-excel/route_excel.js"
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
  Modal, ModalHeader, ModalBody, ModalFooter, Alert
} from 'reactstrap'

// ** Styles
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'

// ** Table Header
const CustomHeader = ({ store, toggleSidebar, handlePerPage, rowsPerPage, handleFilter, searchTerm }) => {
  // ** Converts table to CSV
  const dispatch = useDispatch()
  const [searchStartingPoint, setSearchStartingPoint] = useState('')
  const [searchEndingPoint, setSearchEndingPoint] = useState('')
  const [searchRouteName, setSearchRouteName] = useState('')
  const [searchStatus, setSearchStatus] = useState('')

  const [routeNameFilter, setRouteNameFilter] = useState(0)
  const [startingPointFilter, setStartingPointFilter] = useState(0)
  const [endingPointFilter, setEndingPointFilter] = useState(0)
  const [statusFilter, setStatusFilter] = useState(0)

  const [centeredModal, setCenteredModal] = useState(false)

  const [showAdvancFilter, setAdvanceFilter] = useState(false)
  const showAF = () => { 
    setAdvanceFilter(true)
    setCenteredModal(!centeredModal)
  }
  const hideAF = () => setAdvanceFilter(false)

   // ** Function to Route Name filter
   const handleRouteNameFilter = e => {
    const value = e.target.value
    setSearchRouteName(value)
  }

  // ** Function to handle Starting Point filter
  const handleStartingPointFilter = e => {
    const value = e.target.value
    setSearchStartingPoint(value)
  }
  // ** Function to handle ending point filter
  const handleEndingPointFilter = e => {
    const value = e.target.value
    setSearchEndingPoint(value)
  }
  // ** Function to handle status filter
  const handleStatusFilter = e => {
    const value = e.target.value
    console.log(value)
    setSearchStatus(value)
  }

   // ** Function to handle buscapacity and status filter
   const searchFilterData = (event) => {
    event.preventDefault()
   
    dispatch(
      getData({
        route_name: searchRouteName,
        starting_point: searchStartingPoint,
        ending_point: searchEndingPoint,
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
              <Input type='checkbox' id='routename'  checked={routeNameFilter} onChange={() => setRouteNameFilter(!routeNameFilter)}/>
              <Label for='basic-cb-unchecked' className='form-check-label'>
                Route Name
              </Label>
            </div><br/>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='startingpoint' checked={startingPointFilter} onChange={() => setStartingPointFilter(!startingPointFilter)} />
              <Label for='basic-cb-unchecked' className='form-check-label'>
                Starting Point
              </Label>
            </div><br/>
            <div className='form-check form-check-inline'>
              <Input type='checkbox' id='endingpoint' checked={endingPointFilter} onChange={() => setEndingPointFilter(!endingPointFilter)} />
              <Label for='basic-cb-unchecked' className='form-check-label'>
                Ending Point
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
            {routeNameFilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='name'>
                Route Name:
              </Label>
              <Input id='route_name' placeholder='' value={searchRouteName} onChange={handleRouteNameFilter} />
            </Col> : null}
            {startingPointFilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='pre_route'>
                Starting Point:
              </Label>
              <Input
                type='text'
                id='starting_point'
                placeholder=''
                value={searchStartingPoint}
                onChange={handleStartingPointFilter}
              />
            </Col> : null}
            {endingPointFilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='next_route'>
                Ending Point:
              </Label>
              <Input id='ending_point' placeholder='' value={searchEndingPoint} onChange={handleEndingPointFilter}/>
            </Col> : null} 
            {statusFilter ? <Col lg='3' md='6' className='mb-1'>
              <Label className='form-label' for='bus'>
                Status:
              </Label>
              <Input id='status' placeholder='' value={searchStatus} onChange={handleStatusFilter}/>
            </Col> : null}
            <Row>
             <Col lg='2' md='6' className='mb-1'>
                <Button color='primary' className='px-3' onClick = {searchFilterData}>
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
            <ExportExcel csvData={store.data} fileName='route' />

            <Button className='add-new-user' color='primary' onClick={toggleSidebar}>
              Add Route
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  )
}

const RoutesList = () => {
  // ** Store Vars
  const dispatch = useDispatch()
  const store = useSelector(state => state.routes)

  console.log(store)
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
    const value = parseInt(e.currentTarget.value)
    setRowsPerPage(value)
    setCurrentPage(1)
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

export default RoutesList
