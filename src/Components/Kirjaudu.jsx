import { useState } from "react";
import {getUser, baseUrl, getCoordinates} from "../services/requests";
import './Kirjaudu.css'
import UusiKayttaja from "./UusiKayttaja.jsx";
import { avain } from "../App.jsx"
import axios from "axios";

const Kirjaudu = (props) => {
	const [logStatus, setLogStatus] = useState({ msg: '', style: {} });
	const [uusiKayttaja, setUusiKayttaja] = useState(false)
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const onClickUusiKayttaja = () => {
		setUusiKayttaja(true)
	}
	
	function kirjaudu(user, pass) {
		const url = baseUrl + '/login';
		setLogStatus({
			msg: 'Kirjaudutaan...',
			style: {}
		});
		axios.post(url, {username: user, password: pass}, { withCredentials: true })
			.then((response) => {
				if (response.status === 200) {
					getUser().then((res) => {
						avain.value = "user:" + username;
						props.updateDailyState(
							res.data.coords,
							false,
							res.data.guessed,
							true,
							res.data.date
						);
					}).catch(() => {});
				}
			})
			.catch ((error) => {
				if (error.response.status >= 400)
					alert(error.response.data);
				setLogStatus({
					msg: 'Kirjautuminen epäonnistui',
					style: { color: 'red' }
				});
			});
	}
	
	function logIn(e) {
		e.preventDefault();
		kirjaudu(username, password);
	}
	
    return(
        <div className={'login-pg'}>
            <div className={'login'}>
				<h2>📍Karttapeli</h2>
				{uusiKayttaja ? <UusiKayttaja setUusiKayttaja={setUusiKayttaja}
                                              kirjaudu={kirjaudu} /> :
					<>
				<form onSubmit={logIn}>
					<input
						id={'usrname'}
						name={'usrname'}
						placeholder={'käyttäjätunnus'} autoFocus
						onChange={({ target }) => setUsername(target.value)}
						required
					/>
					<input
						id={'passwrd'}
						name={'passwrd'}
						placeholder={'salasana'}
						type={'password'}
						onChange={({ target }) => setPassword(target.value)}
						required
					/>
					<p></p>
					<button
						title={'Sisään'}
						type="submit">Kirjaudu</button>
				</form>
				<p>tai</p>
				<button
					onClick={onClickUusiKayttaja}
					title={'Luo tunnus'}>
					Luo tunnus
				</button>
				<p style={logStatus.style}>{logStatus.msg}</p>
					</>}
            </div>
        </div>
    )
}

export default Kirjaudu
