import React, { Component } from 'react'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

  class MyComponents extends Component {
    render() {
        const { markers = [] } = this.props
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
                lat: markers[0].position.lat,
                lng: markers[0].position.lng
              }}
            zoom={this.props.zoom}
          >
            {markers.map((m, index) => (
                <Marker key={index} onClick={ m.onClick }
                icon={{
                    url: require('@src/assets/images/logo/bus_icon.png').default,
                    scale: 7
                }}
                position={{
                    lat: m.position.lat,
                    lng: m.position.lng
                }}
                title={ m.title}
            />) 
        )}
          </GoogleMap>
        </LoadScript>
      )
    }
  }

export default MyComponents