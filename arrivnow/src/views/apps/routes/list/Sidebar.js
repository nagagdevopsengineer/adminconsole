// ** React Import
import { useState, useEffect} from "react"

// import HighlightOffIcon from '@mui/icons-material/HighlightOff';
// ** Custom Components
import Sidebar from "@components/sidebar"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons"

// ** Third Party Components
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from "react-hook-form"

// ** Reactstrap Imports
import { Button, Label, FormText, Form, Input, FormFeedback } from "reactstrap"

//import Map from "mapmyindia-react"
import CustomMap from "@src/views/components/map"
// ** Store & Actions

import { addRoute } from "../store"
import { useDispatch } from "react-redux"

import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const defaultValues = {
  route_name: "",
  starting_point: "",
  ending_point: "",
  waypoint_data: [],
  stops: [],
  destination_point: ""
}
const MySwal = withReactContent(Swal)

const SidebarNewUsers = ({ open, toggleSidebar, editMode, data  }) => {
 
  const [routeError, setRouteError] = useState(false)
  const [add, setAdd] = useState([])

  
  // ** Store Vars
  const dispatch = useDispatch()

  const RouteSchema = yup.object().shape({
    route_name: yup.string()
      .required("Route Name is a required field.")
      .matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed for this field."),
    starting_point: yup.string().required("Starting Point is a required field."),
    ending_point: yup.string().required("Ending Point is a required field.")
  })

  // ** Vars
  const {
    control,
    setValue,
    //setError,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm({ 
    defaultValues,
    resolver: yupResolver(RouteSchema)
  })

  useEffect(() => {
    if (editMode) {
      setValue('route_name', data.route_name)
      setValue('starting_point', data.starting_point)
      setValue('ending_point', data.ending_point)
      setValue('waypoint_data', data.waypoint_data)
    }
  }, [])

  const onSubmit = (data) => {
    const client_uuid = localStorage.getItem('client_uuid')
    data.stops.sort(function(a, b) {
      return  a.id > b.id ? 1 : -1 
    })
    const clone_stops = { ...data.stops}
    delete data.stops[1]
    data.stops.push(clone_stops[1])
    
    const route_data = {
      name: data.route_name,
      stops: data.stops,
      client: client_uuid
    }
    console.log(route_data, "rr")
    if (
      data.starting_point &&
      data.route_name &&
      data.ending_point
    ) {
      toggleSidebar()
      dispatch(addRoute(route_data))
      setRouteError(false)
    } else {
    
      setRouteError(true)
      setTimeout(() => {
        setRouteError(false)
      }, 3000)
    }
  }

  const handleSidebarClosed = () => {
    for (const key in defaultValues) {
      setValue(key, "")
      clearErrors(key)
    }
    setAdd([])
    defaultValues['stops'] = []
    setValue('stops', defaultValues['stops'])
  }

  const handleDelete = (item, index) => {
    const temp = [...add]
    temp.map((t, index) => {
      if (t.id === item.id) {
        temp[index].class = 'mb-1 d-none'
      }
    })
    defaultValues['stops'] = defaultValues['stops'].filter((data) => data.id !== index)
    setValue('stops', defaultValues['stops'])
    setAdd(temp)
  }
  // const handleEditCallback = () => {
  //   setValue('starting_point', data.starting_point)
  //   setValue('ending_point', data.ending_point)
  // }
  const handleClick = () => {
    const temp = [...add]

    temp.push({ name: "destination_point", id: temp.length, class: 'mb-1' })
    setAdd(temp)
  }
  const handleCallBack = (name, value, s_index) => {
    defaultValues[name] = value.label

    defaultValues['stops'] = defaultValues['stops'].filter((data) => data.id !== s_index)
    defaultValues['stops'].push({id: s_index, data:value})
    
    setValue(name, value.label)
    setValue('stops', defaultValues['stops'])    
  }
  

  return (
    <Sidebar
      size="lg"
      open={open}
      title="New Route"
      headerClassName="mb-1"
      contentClassName="pt-0"
      toggleSidebar={toggleSidebar}
      onClosed={handleSidebarClosed}
    >
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-1">
          <Label className="form-label" for="route_name">
            Route Name <span className="text-danger">*</span>
          </Label>
          <Controller
            name="route_name"
            control={control}
            render={({ field }) => (
              <Input id="route_name" placeholder="John Doe" {...field} />
            )}
          />

          {errors.route_name && (
            <FormFeedback className='d-block'>{errors.route_name.message}</FormFeedback>
          )}
        </div>

        <div className="mb-1">
          <Label className="form-label w-100" for="starting_point">
            Start Point <span className="text-danger">*</span>
          </Label>
          <CustomMap
            name="starting_point"
            control={control}
            // name = {data.starting_point}
            handleCallBack={ (childData) => handleCallBack("starting_point", childData, 0) }
          />
          {errors.starting_point && (
            <FormFeedback className='d-block'>{errors.starting_point.message}</FormFeedback>
          )}
        </div>

        {add.length > 0 &&
          add.map((item, index) => (
            <div className={item.class}>
              <CustomMap
                name={item.name}
                id={index}
                handleCallBack={(childData) => handleCallBack("waypoint_data", childData, index + 2)}
               
              />
              <FontAwesomeIcon
                icon={faTrashAlt}
                onClick={() => handleDelete(item, index + 2)}
              />
              
            </div>
          ))}
        <Button onClick={handleClick}>Add Waypoints</Button>

        <div className="mb-1 mt-1">
          <Label className="form-label w-100" for="ending_point">
            End Point <span className="text-danger">*</span>
          </Label>
          <CustomMap
            handleCallBack={(childData) => handleCallBack("ending_point", childData, 1) }
            
          />
          {errors.ending_point && (
            <FormFeedback className='d-block'>{errors.ending_point.message}</FormFeedback>
          )}
        </div>

        {routeError && (
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
