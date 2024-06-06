import './Kirjaudu.css'
import {useState} from "react";
import axios from "axios";
import {baseUrl} from "../services/requests.js";

const UusiKayttaja = (props) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')
	
    const handleNewUser = (event) => {
        event.preventDefault()
        if (password !== passwordRepeat) {
            alert('Salasanat eivät täsmää')
        } else {
            axios.post(`${baseUrl}/register`, {username: username, password: passwordRepeat})
                .then(() => {
					props.setUusiKayttaja(false);
					props.kirjaudu(username, passwordRepeat);
				})
                .catch((error) => {
                    if (error.response.status >= 400) {
                        alert(error.response.data)
                    }
                })
        }
    }

    return(
        <div>
            <form onSubmit={handleNewUser}>
                <input
                    id={'newusrname'}
                    name={'newusrname'}
                    placeholder={'käyttäjätunnus'} autoFocus
                    onChange={({ target }) => setUsername(target.value)}
                    required
                />
                <input
                    id={'newpasswrd'}
                    name={'newpasswrd'}
                    placeholder={'salasana'}
                    type={'password'}
                    onChange={({ target }) => setPassword(target.value)}
                    required
                />
                <input
                    id={'newpasswrd-repeat'}
                    name={'newpasswrd-repeat'}
                    placeholder={'salasana uudelleen'}
                    type={'password'}
                    onChange={({ target }) => setPasswordRepeat(target.value)}
                    required
                />
                <p></p>
                <button
                    title={'Sisään'}
                    type="submit">Luo uusi käyttäjä</button>
            </form>
            <button title={'Takaisin'} onClick={() => props.setUusiKayttaja(false)}>Takaisin kirjautumiseen</button>
        </div>
    )
}

export default UusiKayttaja
