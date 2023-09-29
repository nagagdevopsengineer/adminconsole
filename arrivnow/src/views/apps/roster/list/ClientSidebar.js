// ** React Import
import { useState, useEffect } from "react"
import moment from 'moment'
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';

// ** Custom Components
import Sidebar from "@components/sidebar"
import Flatpickr from 'react-flatpickr'
import 'flatpickr/dist/flatpickr.min.css'

// ** Utils
import { selectThemeColors } from '@utils'

// ** Third Party Components
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from "react-hook-form"

// ** Reactstrap Imports
import { Button, Label, Form, Input, FormFeedback } from "reactstrap"

// ** Store & Actions
import { addRoster, getAllRoute, getAllBus, getAllContractors} from "../store/client.js"
import { useDispatch, useSelector } from "react-redux"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import AsyncSelect from 'react-select/async'

import Select from 'react-select'
//import store from "../store/index.js"

const defaultValues = {
    route: "",
    start_end_date: "",
    busno: "",
    contractor: "",
    starting_time: ""
}
const MySwal = withReactContent(Swal)

const SidebarNewUsers = ({ open, toggleSidebar, editMode, data  }) => {
  const [startpicker, setStartPicker] = useState('')
  const [setRoute, setRouteData] = useState('')
  const [setBus, setBusData] = useState('')
  const [starttime, setStartTime] = useState("")
  const [rosterError, setRosterError] = useState(false)
  // ** Store Vars
  const dispatch = useDispatch()

  const RosterSchema = yup.object().shape({
    contractor: yup.string().required("Contractor is a required field."),
    route: yup.string().required("Route is a required field."),
    busno: yup.string().required("Bus is a required field."),
    start_end_date: yup.string().required("Startdate to Enddate is a required field."),
    starting_time: yup.string().required("Start Time is a required field.")
  })

  const store = useSelector(state => state.client_rosters)

  console.log(store)
  // ** Vars
  const {
    //control,
    setValue,
    //setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ 
    defaultValues,
    resolver: yupResolver(RosterSchema)
  })

  useEffect(() => {
    if (editMode) {
      setValue('busno', data.busno)
      setValue('route', data.route)
      setValue('start_end_date', ['2020-02-01', '2020-02-15'])
    }
    dispatch(getAllRoute())
    dispatch(getAllContractors())
  }, [])

  const onSubmit = (data) => {
      console.log(data)
    if (editMode) {
      const s_time = moment(starttime[0]).format("hh:mm A")
      const roster_data = {
        route: data.route,
        start_end_date:`${moment(startpicker[0]).format("DD/MM/YYYY") } - ${  moment(startpicker[1]).format("DD/MM/YYYY")}`,
        busno:data.busno,
        start_time: s_time,
        status: "active"
      }
     
      if (
        roster_data.start_end_date &&
        roster_data.route
      ) {
        toggleSidebar()
        dispatch(addRoster(roster_data))
      } 

    }
    const start_date = moment(startpicker[0])
    const end_date = moment(startpicker[1])
    const start_time = moment(starttime[0])
    if (start_date && setRoute && setBus && start_time) {
      setRosterError(false)
      const s_time = moment(starttime[0]).format("HH:mm:00.000")
     
      const roster_data = {
        route: setRoute,
        from_date: start_date.format("YYYY-MM-DD"),
        to_date: end_date.format("YYYY-MM-DD"),
        time: s_time,
        bus: setBus
      }
      toggleSidebar()
      dispatch(addRoster(roster_data))
    } else {
      setRosterError(true)
    } 
  }

  const handleRouteChange = newValue => {
    setValue('route', newValue.value)
    setRouteData(newValue.value)
  }

  const handleBusChange = newValue => {
    setValue('busno', newValue.value)
    setBusData(newValue.value)
  }

  const handleContractorChange = newValue => {
    setValue('contractor', newValue.value)
    dispatch(getAllBus(newValue.value))
  }
  
  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, "")
      clearErrors(key)
    }
  }
 
  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Roster"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="contrator">
          Contractor <span className="text-danger">*</span>
          </Label>
          <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue
              options={store.contractors}
              onChange={handleContractorChange}
              isClearable={false}
              name='contractor'
            />
            {errors.contractor && (
            <FormFeedback className='d-block'>{errors.contractor.message}</FormFeedback>
          )}
        </div>
        <div className="mb-1">
          <Label className="form-label" for="route">
          Route <span className="text-danger">*</span>
          </Label>
          <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue
              options={store.routes}
              onChange={handleRouteChange}
              isClearable={false}
              name='route'
            />
            {errors.route && (
            <FormFeedback className='d-block'>{errors.route.message}</FormFeedback>
          )}
        </div>
        <div className="mb-1">
          <Label className="form-label" for="busno">
          Bus <span className="text-danger">*</span>
          </Label>
          <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue
              options={store.buses}
              onChange={handleBusChange}
              isClearable={false}
              name='busno'
            />
            {errors.busno && (
            <FormFeedback className='d-block'>{errors.busno.message}</FormFeedback>
          )}
        </div>
      
        <div className="mb-1">
            <Label className="form-label w-100" for="starting_point">
                Startdate to Enddate <span className="text-danger">*</span>
            </Label>
            <Flatpickr
                value={startpicker}
                name='start_end_date'
                id='range-picker'
                className='form-control'
                onChange={(date) => {
                  setValue('start_end_date', date[0])
                  setStartPicker(date)
                }}
                options={{
                  mode: 'range',
                  minDate: "today"
                }}
            />
            {errors.start_end_date && (
            <FormFeedback className='d-block'>{errors.start_end_date.message}</FormFeedback>
          )}
        </div>
        <div className="mb-1">
          <Label className="form-label" for="start_time">
            Start Time<span className="text-danger">*</span>
          </Label>
          <Flatpickr
            className='form-control'
            value={starttime}
            name='starting_time'
            id='timepicker'
            options={{
              enableTime: true,
              noCalendar: true,
              dateFormat: 'h:i',
              time_24hr: false
            }}
            onChange={date => {
              setValue('starting_time', date[0])
              setStartTime(date)
            }}
          />
          {errors.starting_time && (
            <FormFeedback className='d-block'>{errors.starting_time.message}</FormFeedback>
          )}
        </div>

        {rosterError && (
          <p className="alert alert-danger mt-0 mb-1">
            {" "}
            Please enter mandatory fields
          </p>
        )}
        <Button type="submit" className="me-1" color="primary">
          Submit
        </Button>
        <Button type="reset" color="secondary" outline onClick={toggleSidebar}>
          Cancel
        </Button>
      </Form>
    </Sidebar>
  )
}

export default SidebarNewUsers
