import React, {useState} from "react"
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete'
// import isEqual from "lodash.isequal"

// const containerStyle = {
//   width: '400px',
//   height: '400px'
// }
// const center = {
//   lat: 28.7041,
//   lng:  77.1025
// }
const CustomMap = ({handleCallBack}) => {

  const [value, setValue] = useState(null)
  const handleChange = (e) => {
    setValue(e)
    geocodeByAddress(e.label)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        //console.log('Successfully got latitude and longitude', { lat, lng })
        const map_data = {
          label: e.label,
          lat,
          lng
        }
        handleCallBack(map_data)
      })
      
      
  }
    return (
      <div className="w-75 d-inline-block mg_10">

        
<GooglePlacesAutocomplete
          apiKey='AIzaSyA7jKr8cUZnMXeuccPPztmG1Ucp-RfBxVY'
          selectProps={{
           value,
            onChange:handleChange
          }}
        /> 
      
      </div>
    )
  
}
export default CustomMap