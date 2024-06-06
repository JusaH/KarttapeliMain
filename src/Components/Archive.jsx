import { useEffect, useState } from "react"
import { getUser, getArchiveDates, getArchivedDaily, getCoordinates } from "../services/requests"
import CloseBtn from "./CloseBtn"

const Archive = ({ updateDailyState, setShowArchive, onClick, setDate, setRatkottu }) => {

    const [dates, setDates] = useState([])

    useEffect( () =>{
        getArchiveDates().then(dates => {
            getCoordinates().then(() => {
                const eka = ['Tämänpäiväinen']
                const taulukko = eka.concat(dates)
                setDates(taulukko)
            })

    })},[])

    const handleDateClick = async (date) => {
		let coords, archived, counter, answer;
		let dateStr = '';
		
        if(date === 'Tämänpäiväinen') {
			await getUser().then((res) => {
				setDate(res.data.date);
				dateStr = res.data.date;
				counter = res.data.guessed;
				coords = res.data.coords;
				archived = false;
			}).catch(() => {});
        }
        else {
            const oldDaily = await getArchivedDaily(date)
			
			counter = 0;
			coords = oldDaily.coords;
			archived = true;
			answer = oldDaily.answer;
			
            setDate(date)
			setRatkottu(false)
        }
		
		updateDailyState(coords, archived, counter, false, dateStr, answer);
		
        setShowArchive(false)
    }

    return (
        <div className={'archive-tausta'}>
            <CloseBtn onClick={onClick}></CloseBtn>
            <h1>Edellisten päivien pelit</h1>  
            <div className={'archive'}>
                <ul>
                    {dates.map((date, i) => 
                        <li className={'archive-date'} key={i}>
                            <button onClick={() => handleDateClick(date)}>{date.split('G')[0]}</button>
                        </li>)
                    }               
                </ul>
            </div> 
        </div>
    )
}

export default Archive