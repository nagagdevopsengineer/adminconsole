import React, { Component } from 'react'
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer, Marker } from '@react-google-maps/api'

class LoadScriptOnlyIfNeeded extends LoadScript {
  componentDidMount() {
    const cleaningUp = true
    const isBrowser = typeof document !== "undefined" // require('@react-google-maps/api/src/utils/isbrowser')
    const isAlreadyLoaded =
      window.google &&
      window.google.maps &&
      document.querySelector("body.first-hit-completed") // AJAX page loading system is adding this class the first time the app is loaded
    if (!isAlreadyLoaded && isBrowser) {
      // @ts-ignore
      if (window.google && !cleaningUp) {
        console.error("google api is already presented")
        return
      }

      this.isCleaningUp().then(this.injectScript)
    }

    if (isAlreadyLoaded) {
      this.setState({ loaded: true })
    }
  }
}
  class MyComponents extends Component {
    constructor(props) {
        super(props)

        this.state = {
            response : null,
            origin: null,
            destination: null,
            waypoints: null
        }

        this.directionsCallback = this.directionsCallback.bind(this)
    }

    directionsCallback (response) {

        if (response !== null && this.state.response === null) {
          if (response.status === 'OK') {
            this.setState(
              () => ({
                response
              })
            )
            console.log(response)
            for (let i = 0; i < response.routes[0].legs.length; i++) {
              if (i === 0) {
                this.setState({origin: response.routes[0].legs[i].start_location})
              } else {
                const waypoint_data = this.state.waypoints
                waypoint_data.push(response.routes[0].legs[i].start_location)
                this.setState({waypoints: waypoint_data})
              } 
              
              if (i === ((response.routes[0].legs.length) - 1)) {
                this.setState({destination: response.routes[0].legs[i].end_location})
              } else {
                const waypoint_data = this.state.waypoints ?? []
                waypoint_data.push(response.routes[0].legs[i].end_location)
                this.setState({waypoints: waypoint_data})
              }
            }

            
          } else {
            console.log('response: ', response)
          }
        }
      }
    render() {
        const { markers = [] } = this.props
        console.log(this.props.directions[0].waypoints)
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
                lat: markers.latitude,
                lng: markers.longitude
              }}
            zoom={this.props.zoom}
          >
              {
                (
                    this.props.directions[0].destination.latitude !== '' &&
                    this.props.directions[0].origin.latitude !== ''
                ) && (
                    <DirectionsService
                    // required
                    options={{ 
                       // destination: this.props.directions[0].destination,
                        destination: { lat: this.props.directions[0].destination.latitude, lng: this.props.directions[0].destination.longitude},
                        origin: { lat: this.props.directions[0].origin.latitude, lng: this.props.directions[0].origin.longitude},
                        waypoints: this.props.directions[0].waypoints,
                        travelMode: this.props.directions[0].travelMode
                    }}
                    // required
                    callback={this.directionsCallback}
                    // optional
                    onLoad={directionsService => {
                        console.log('DirectionsService onLoad directionsService: ', directionsService)
                    }}
                    // optional
                    onUnmount={directionsService => {
                        console.log('DirectionsService onUnmount directionsService: ', directionsService)
                    }}
                    />
                )
                }

                {
                this.state.response !== null && (
                    <DirectionsRenderer
                    // required
                    options={{ 
                        directions: this.state.response,
                        suppressMarkers: true
                    }}
                    // optional
                    onLoad={directionsRenderer => {
                        console.log('DirectionsRenderer onLoad directionsRenderer: ', directionsRenderer)
                    }}
                    // optional
                    onUnmount={directionsRenderer => {
                        console.log('DirectionsRenderer onUnmount directionsRenderer: ', directionsRenderer)
                    }}
                    />
                )
              }

              {
                this.state.origin !== null && (
                  <Marker key='origin_marker'
                  icon={{
                      url: require('@src/assets/images/logo/start_point_bus.png').default,
                      scale: 10
                  }}
                  position={this.state.origin}
              />) 
              }
              {
                this.state.destination !== null && (
                  <Marker key='destination_marker'
                  icon={{
                      url: require('@src/assets/images/logo/end_point_bus.png').default,
                      scale: 10
                  }}
                  position={this.state.destination}
              />) 
              }
              {this.state.waypoints && this.state.waypoints.map((m, index) => (
                  <Marker key={index}
                  icon={{
                      url: require('@src/assets/images/logo/mid_point_bus.png').default,
                      scale: 10
                  }}
                  position={m}
                />) 
               )}
          </GoogleMap>
        </LoadScript >
      )
    }
  }

export default MyComponents