import axios from 'axios'
export const baseUrl = ''


//palauttaa dailyn koordinaatit
export const getCoordinates = ( ) => {
    const promise = axios.get(`${baseUrl}/daily`)

    return promise
}   

//lähettää arvauksen
export const postGuess = ({trimmedGuess, date}) => {
    const promise = axios.post(
		baseUrl,
		{guess: trimmedGuess, date:date},
		{withCredentials: true}
	)
    return promise
}

export const getArchiveDates = () => {
    const promise = axios.get(baseUrl + "/archive").then(res => res.data)
    return promise
}

export const getArchivedDaily = ( date ) => {
    const oldDaily = axios.get(`${baseUrl}/archive/${date}`).then(res => res.data)
    return oldDaily
}

export const getUser = ( ) => {
	return axios.get(baseUrl + "/users/me", { withCredentials: true })
}

export const getTopTen = () => {
	const promise = axios.get(baseUrl + "/getTopTen")
	return promise
}

export const getUserInfo = () => {
    const promise = axios.get(
        baseUrl + '/getUserInfo',
        {withCredentials: true}
    )
    return promise
}

export const logout = user => {
    return axios.post(baseUrl + "/logout", user, {withCredentials: true})
}

export const getCityList = () => {
	const promise = axios.get(
		baseUrl + '/cities.json'
	);
	return promise;
}