import { map, marker, panorama } from "../services/maps";

const Initialize = ( {data} ) =>{
	const location = { lat: data.lat, lng: data.lng };
	
	map.setCenter(location);
	marker.setPosition(location);
	panorama.setPosition(location);
}

export default Initialize