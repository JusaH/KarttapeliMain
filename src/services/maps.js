
import { Loader } from "@googlemaps/js-api-loader"

var initialized = false;
export var map;
export var marker;
export var panorama;

export function initMaps() {
	
	if (initialized)
		return;
	initialized = true;
	
	let loader = new Loader({
		apiKey: import.meta.env.VITE_API_KEY,
		version: "weekly"
	});
	
	loader.load().then(async () => {
        map = new google.maps.Map(document.getElementById("map"), {
            zoom: 14,
            disableDefaultUI: true,
            showRoadLabels: false,
            draggable: false,
        });

        panorama = new google.maps.StreetViewPanorama(
            document.getElementById("pano"),
            {
                disableDefaultUI: true,
                clickToGo: false,
                showRoadLabels: false,
                pov: {
                    heading: 0,
                    pitch: 0,
                    zoom: 0
                }
            },
        );
        marker = new google.maps.Marker({
            map,
            title: "T��ll�",
        });
        var customStyled = [
            {
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.neighborhood",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            }
        ]
		//(array shown above)
        map.set('styles',customStyled);
        map.setStreetView(panorama);

        //poistaa käytöstä nuolinäppäimet ja wasd
        window.addEventListener(
            'keydown',
            (event) => {
                if (
                    (
                        event.key === 'ArrowUp' ||
                        event.key === 'ArrowDown' ||
                        event.key === 'ArrowLeft' ||
                        event.key === 'ArrowRight' ||
                        event.key === 'a' ||
                        event.key === 's' ||
                        event.key === 'd' ||
                        event.key === 'w' ||
                        event.key === 'A' ||
                        event.key === 'S' ||
                        event.key === 'D' ||
                        event.key === 'W'
                    ) &&
                    !event.metaKey &&
                    !event.altKey &&
                    !event.ctrlKey
                ) {
                    event.stopPropagation()
                }
            },
            { capture: true },
        );
    });
}
