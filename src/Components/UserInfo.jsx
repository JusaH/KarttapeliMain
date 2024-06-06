import CloseBtn from "./CloseBtn.jsx";
import {useEffect, useState} from "react";
import {getUserInfo, logout} from "../services/requests.js";

const UserInfo = props => {
    const [userInfo, setUserInfo] = useState([])

    useEffect(() => {
        getUserInfo().then(res => {
            setUserInfo(res.data)
        })
    },[])

    function logOut() {
        logout()
        .then(response => {
            if (response.status === 200) {
                props.setKayttaja(false);
                props.setGuesses([])
                props.setVihjelaskuri(0)
                props.setArvauslaskuri(0)
				props.setRatkottu(false)
            }
        })
        .catch(error => {})
    }

    return (
        <div className={'info-screen2'}>
        <CloseBtn onClick={props.onClick}/>
            <div className={'info-screen-content'}>
                <h3>Käyttäjätiedot</h3>
                <p>Käyttäjänimesi: {userInfo.username}</p>
                <p>Pisteet: {userInfo.points}</p>
                <button className={"logout"} onClick={logOut}>Kirjaudu ulos</button>
            </div>
        </div>
    )
}

export default UserInfo