<template lang="html">

</template>

<script>
import { MapElement } from 'vue-googlemaps'
import markerUser from '~/assets/img/marker-user.svg'

// Those Vue props will update automatically
// (Two-way binding with .sync modifier)
const boundProps = [
	'animation',
	'clickable',
	'cursor',
	'draggable',
]

// Events from Google Maps emitted as Vue events
const redirectedEvents = [
	'click',
	'rightclick',
	'dblclick',
	'drag',
]

export default {
  mixins: [
    MapElement
  ],
  props: ['userPosition'],
  // When Google Maps is ready
  googleMapsReady () {

		const options = Object.assign({
      position: this.userPosition,
      icon: {
        url: markerUser,
        scaledSize: new window.google.maps.Size(20, 32)
      }
    }, this.$props)

		options.map = this.$_map

    // Create Google Maps objects
    this.$_marker = new window.google.maps.Marker(options)
    // Bind the Vue props
    this.bindProps(this.$_marker, boundProps)
    // Emit the events from Google Maps
		this.redirectEvents(this.$_marker, redirectedEvents)
	},

	beforeDestroy () {
    // Teardown
		if (this.$_marker) {
			this.$_marker.setMap(null)
		}
	}
}
</script>

<style lang="css">
</style>
