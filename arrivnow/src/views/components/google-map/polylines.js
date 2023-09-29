import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api'

  class MyComponents extends Component {
    render() {
        const { markers = [] } = this.props
        const polyline_data = []
        if (markers.length > 0) {
            markers.map((m) => polyline_data.push({lat: m.latitude, lng: m.longitude}))
        }
        console.log(polyline_data)
      return (
        <LoadScript
          googleMapsApiKey="AIzaSyA7jKr8cUZnMXeuccPPztmG1Ucp-RfBxVY"
        >
          <GoogleMap
            mapContainerStyle={{
              width: this.props.width ?? '100%',
              height: this.props.height ?? '400px'
            }}
            center={{
                lat: polyline_data[polyline_data.length - 1].lat,
                lng: polyline_data[polyline_data.length - 1].lng
              }}
            zoom={this.props.zoom}
          >
              <Marker key="ct" 
                icon={{
                    url: require('@src/assets/images/logo/bus_icon.png').default,
                    scale: 7
                }}
                position={{
                    lat: polyline_data[polyline_data.length - 1].lat,
                    lng: polyline_data[polyline_data.length - 1].lng
                }}
            />
              <Polyline
                path={polyline_data}
                options={{
                    strokeColor: '#625c76',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#625c76',
                    fillOpacity: 0.35,
                    clickable: false,
                    draggable: false,
                    editable: false,
                    visible: true,
                    radius: 30000,
                    paths: polyline_data,
                    zIndex: 1
                }}
            />
          </GoogleMap>
        </LoadScript>
      )
    }
  }

export default MyComponents