import CloseBtn from "./CloseBtn.jsx";
import { useEffect, useState } from "react";
import { getTopTen, getUserInfo } from "../services/requests";

const HighScores = props => {
    const [highScores, setHighScores] = useState([])
    const [userInfo, setUserInfo] = useState([])

    useEffect(() => {
        getUserInfo().then(res => {
            setUserInfo(res.data)
            getTopTen().then(res => setHighScores(res.data))
        })
    }, [])

    function getStyle(user) {
        return user.username === userInfo.username ? "highlight" : "normal"
    }
    
    return(
        <div className={'info-screen2'}>
            <CloseBtn onClick={props.onClick}/>
            <div className={'info-screen-content'}>
                <table>
                    <caption>Tulostaulu</caption>
                    <thead>
                    <tr>
                        <th>Sijoitus</th>
                        <th>Nimi</th>
                        <th>Pisteet</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        highScores.map((user, index) => (
                            <tr key={user.username + index} className={getStyle(user)}>
                                <td>{index + 1}.</td>
                                <td>{user.username}</td>
                                <td>{user.points}</td>
                            </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HighScores
