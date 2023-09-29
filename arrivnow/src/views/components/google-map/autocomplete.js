import React, { Component } from 'react'
import { Map, GoogleApiWrapper, Marker, Polyline } from 'google-maps-react'
const polyline = [
    { lat: 37.789411, lng: -122.422116 },
    { lat: 37.785757, lng: -122.421333 },
    { lat: 37.789352, lng: -122.415346 }
  ]

class Contents extends Component {
    state = {
        position: null,
        directions: null
    }

    componentDidMount() {
        console.log('1')
        this.renderAutoComplete()
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps.map) this.renderAutoComplete()
    }

    onSubmit(e) {
        e.preventDefault()
    }

    renderAutoComplete() {
        const { google, map } = this.props
        if (!google || !map) return
        const autocomplete = new google.maps.places.Autocomplete(this.autocomplete)
        autocomplete.bindTo('bounds', map)

        autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place.geometry) return
        if (place.geometry.viewport) map.fitBounds(place.geometry.viewport)
        else {
            map.setCenter(place.geometry.location)
            map.setZoom(17)
        }

        this.setState({ position: place.geometry.location })
        })
    }

    renderDirection() {
        console.log('f1')
        const { google, map } = this.props
        const { directions } = this.state
        if (!google || !map) return

        if (directions)  return
        const DirectionsService = new google.maps.DirectionsService()
        const directionsRenderer = new google.maps.DirectionsRenderer()
        directionsRenderer.setMap(map)

          DirectionsService.route({
            origin: new google.maps.LatLng(41.8507300, -87.6512600),
            destination: new google.maps.LatLng(41.8525800, -87.6514100),
            travelMode: google.maps.TravelMode.DRIVING
          }, (result, status) => {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsRenderer.setDirections(result)

                this.setState({ 
                    directions: {...result},
                    markers: true
                })
            } else {
              console.error(`error fetching directions ${result}`)
            }
          })
        console.log('f2')
        
    }

    render() {
        const { position } = this.state
        //const { directions } = this.state
        this.renderDirection()
        return (
        <div className=''>
            <div className=''>
            <form onSubmit={this.onSubmit}>
                <input
                placeholder="Enter a location"
                ref={ref => (this.autocomplete = ref)}
                type="text"
                />

                <input className='' type="submit" value="Go" />
            </form>

            <div>
                <div>Lat: {position && position.lat()}</div>
                <div>Lng: {position && position.lng()}</div>
            </div>
            </div>

            <div className=''>
            <Map
                {...this.props}
                center={position}
                centerAroundCurrentLocation={false}
                containerStyle={{
                height: '100vh',
                position: 'relative',
                width: '100%'
                }}>
                <Marker position={position} />
                <Polyline
                    fillColor="#0000FF"
                    fillOpacity={0.35}
                    path={polyline}
                    strokeColor="#0000FF"
                    strokeOpacity={0.8}
                    strokeWeight={2}
                />
            </Map>
            </div>
        </div>
        )
    }
}

const MapWrapper = props => (
    <Map className="map" google={props.google} visible={false}>
        <Contents {...props} />
    </Map>
)

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDdj69dBvZR1S3HtAipnm9564ff4mIvO_o',
    libraries: ['places']
  })(MapWrapper)