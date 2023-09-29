// ** React Import
import { useState, Fragment, useEffect } from "react"
import moment from "moment"
// import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// ** Custom Components
import Sidebar from "@components/sidebar"
import PickerDefault from "../../../forms/form-elements/datepicker/PickerDefault"
import "flatpickr/dist/flatpickr.min.css"
import Flatpickr from "react-flatpickr"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { selectThemeColors } from '@utils'
// ** Third Party Components
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from "react-hook-form"

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, FormFeedback } from "reactstrap"
import Select from 'react-select'

//import Map from "mapmyindia-react"
import CustomMap from "@src/views/components/map"
// ** Store & Actions

import { addRoster, getAllHelper, getAllBus, getAllDriver } from "../store"
import { useDispatch, useSelector } from "react-redux"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

/* const driverOptions = [
  { value: 'Vijay', label: 'Vijay',  isFixed: true },
  { value: 'Sanjay', label: 'Sanjay',  isFixed: true }
]
const busOptions = [
  { value: 'DL45123 - RED', label: 'DL45123 - RED', color: '#00B8D9', isFixed: true },
  { value: 'DL451234 - White', label: 'DL451234 - White', color: '#00B8D9', isFixed: true },
  { value: 'DL451235 - Blue', label: 'DL451235 - Blue', color: '#00B8D9', isFixed: true },
  { value: 'DL451236 - RED', label: 'DL451236 - RED', color: '#00B8D9', isFixed: true }
]  
const helperOptions = [
  { value: 'Alex', label: 'Alex',  isFixed: true },
  { value: 'Helper2', label: 'Helper2',  isFixed: true },
  { value: 'Helper3', label: 'Helper3',  isFixed: true }
] */
const defaultValues = {
  drivername: "",
  helpername: "",
  start_end_date: "",
  starting_time: "",
  busno: ""
}
const MySwal = withReactContent(Swal)

const SidebarNewUsers = ({ open, toggleSidebar, editMode, data }) => {
  const [startpicker, setStartPicker] = useState("")
  const [starttime, setStartTime] = useState("")
  const [busno, setBusno] = useState('')
  const [helpername, setHelpername] = useState('')
  const [drivername, setDrivername] = useState('')

  // ** Store Vars
  const dispatch = useDispatch()
  const RosterSchema = yup.object().shape({
    drivername: yup.string().required("Driver Name is a required field."),
    helpername: yup.string().required("Helper Name is a required field."),
    busno: yup.string().required("Bus No is a required field."),
    start_end_date: yup.string().required("Startdate to Enddate is a required field."),
    starting_time: yup.string().required("Start Time is a required field.")
  })
  const store = useSelector(state => state.rosters)

  console.log(store)
  // ** Vars
  const {
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
      setValue("busno", data.busno)
      setValue("drivername", data.drivername)
      setValue("helpername", data.helpername)
      setValue("starting_point", ["2020-02-01", "2020-02-15"])
    }
    dispatch(getAllDriver())
    dispatch(getAllBus())
    dispatch(getAllHelper())
  }, [])

  const handleSuccess = () => {
    return MySwal.fire({
      title: "Done!",
      text: "New Roster created successfully.",
      icon: "success",
      customClass: {
        confirmButton: "btn btn-primary"
      },
      buttonsStyling: false
    })
  }
  const handleBusnoChange = (newValue) => {
    setValue('busno', newValue.value)
    setBusno(newValue.value)
  }
  const handleDriverChange = (newValue) => {
    setValue('drivername', newValue.value)
    setDrivername(newValue.value)
  }
  const handleHelperChange = (newValue) => {
    setValue('helpername', newValue.value)
    setHelpername(newValue.value)
  }
  const onSubmit = (data) => {
    if (editMode) {
      const s_time = moment(starttime[0]).format("hh:mm A")
      const e_time = moment(endtime[0]).format("hh:mm A")
      const roster_data = {
        drivername: data.drivername,
        starting_point: `${moment(startpicker[0]).format(
          "DD/MM/YYYY"
        )} - ${moment(startpicker[1]).format("DD/MM/YYYY")}`,
        start_time: s_time, 
        end_time: e_time, 
        helpername: data.helpername,
        busno: data.busno,
        status: "active",
        role: "Route"
      }

      if (roster_data.starting_point && roster_data.drivername) {
        toggleSidebar()
        dispatch(addRoster(roster_data))
        handleSuccess()
      }
    }

    const start_date = moment(startpicker[0])
    const end_date = moment(startpicker[1])
    if (start_date && helpername && drivername && busno) {
      const s_time = moment(starttime[0]).format("HH:mm:00.000")
     // toggleSidebar()
      const roster_data = {
        driver: drivername,
        helper: helpername,
        from_date: start_date.format("YYYY-MM-DD"),
        to_date: end_date.format("YYYY-MM-DD"),
        timing: s_time,
        bus: busno
      }
      toggleSidebar()
      dispatch(addRoster(roster_data))
    }
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
          <Label className="form-label" for="drivername">
            Driver Name <span className="text-danger">*</span>
          </Label>
          <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue
              options={store.drivers}
              onChange={handleDriverChange}
              isClearable={false}
              name='drivername'
            />
          {errors.drivername && (
            <FormFeedback className='d-block'>{errors.drivername.message}</FormFeedback>
          )}
        </div>
        <div className="mb-1">
          <Label className="form-label" for="helpername">
            Helper Name <span className="text-danger">*</span>
          </Label>
          <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue
              options={store.helpers}
              onChange={handleHelperChange}
              isClearable={false}
              name='helpername'
            />
         {errors.helpername && (
            <FormFeedback className='d-block'>{errors.helpername.message}</FormFeedback>
          )}
        </div>
        <div className="mb-1">
          <Label className="form-label" for="busno">
            Bus No <span className="text-danger">*</span>
          </Label>
          <Select
              theme={selectThemeColors}
              className='react-select'
              classNamePrefix='select'
              defaultValue
              options={store.buses}
              onChange={handleBusnoChange}
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
            id="range-picker"
            className="form-control"
            onChange={(date) => {
              setValue('start_end_date', date[0])
              setStartPicker(date)
            }}
            options={{
              mode: "range",
              //defaultDate: ['2020-02-01', '2020-02-15'],
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
