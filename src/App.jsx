import { useEffect, useState} from 'react'
import CurrentGame from "./Components/CurrentGame.jsx";
import Guess from './Components/Guess';
import Initialize from './Components/Initialize';
import Logo from "./Components/Logo.jsx";
import Kirjaudu from "./Components/Kirjaudu.jsx";
import HintList from './Components/HintList.jsx';
import { getUser } from "./services/requests";
import { initMaps } from "./services/maps";
import "./App.css";

export var avain = { value: undefined };

export var daily = {
	guessed: 0,
	date: '',
	isArchived: false,
	answer: ''
};

initMaps();

const App = () =>{
    const [coords, setCoords] = useState('ei vielä haettu')
    const [ladattu, setLadattu] = useState(false)
    const [kayttaja, setKayttaja] = useState(false)
    const [guesses, setGuesses] = useState([])
    const [ratkottu, setRatkottu] = useState(false)
    const [vihjelaskuri, setVihjelaskuri] = useState(0) // vihjeiden vaihtoa varten
    const [arvauslaskuri, setArvauslaskuri] = useState(0) // arvausten kirjanpito nappien lisäykseen
    const [date, setDate] = useState('')
    const [dailyDate, setDailyDate] = useState('')
	
	function updateDailyState(coords, archived, counter, updatePage, date, answer) {
		daily.guessed = counter;
		daily.date = date;
		daily.isArchived = archived;
		daily.answer = answer;
		
		let arvaus = counter;
		
		if (archived) {
			setGuesses([]);
		} else {
			let store = window.localStorage.getItem(avain.value);
			if (!store) {
				let arr = [];
				for (let i = 0; i < counter; i++)
					arr.push({ guess: '', correct: false });
				setGuesses(arr);
			} else {
				let str = store.split(';');
				
				if (str[0] != date) {
					store = date + ";false;0";
					window.localStorage.setItem(avain.value, store);
					str = store.split(';');
				}
				
				const num = parseInt(str[2]);
				
				let arr = [];
				for (let i = 0; i < num; i++)
					arr.push({ guess: str[i+3], correct: false });
				
				if (str[1] == "true") {
					arr[num - 1].correct = true;
					arvaus = 4;
					setRatkottu(true);
				} else if (num >= 5) {
					setRatkottu(true);
				}
				
				setGuesses(arr);
			}
		}
		
		setCoords(coords);
		setVihjelaskuri(counter);
		setArvauslaskuri(arvaus);
		if (updatePage) {
			setKayttaja(true);
			setLadattu(true);
		}
	}
	
	function storeAnswers(guessList) {
		if (daily.isArchived)
			return;
		
		if (!guessList)
			guessList = guesses;
		
		const len = guessList.length;
		const solved = (len > 0) && guessList[len - 1].correct;
		
		let store = daily.date + ";" + solved + ";" + guessList.length;
		for (let i = 0; i < guessList.length; i++)
			store += ";" + guessList[i].guess;
		window.localStorage.setItem(avain.value, store);
	}

    useEffect(() => {
      getUser().then((res) => {
		  avain.value = 'user:' + res.data.name;
          setDate(res.data.date)
		  setDailyDate(res.data.date);
		  updateDailyState(
			res.data.coords,
			false,
			res.data.guessed,
			true,
			res.data.date
          );
      }).catch(() => {});
    }, [])

    if (kayttaja) {
        if (ladattu) {
            return (
                <div>
                    <Logo />
                    <Initialize data={coords[vihjelaskuri > 4 ? 4 : vihjelaskuri]}/>
                    <Guess updateDailyState={updateDailyState}
                           storeAnswers={storeAnswers}
                           setVihjelaskuri={setVihjelaskuri}
                           arvauslaskuri={arvauslaskuri}
                           setArvauslaskuri={setArvauslaskuri}
                           setGuesses={setGuesses}
                           guesses={guesses}
                           setKayttaja={setKayttaja}
                           date={date}
						   setDailyDate={setDailyDate}
                           setDate={setDate}
                           ratkottu={ratkottu}
                           setRatkottu={setRatkottu}/>
                    <HintList arvauslaskuri={arvauslaskuri}
							  vihjelaskuri={vihjelaskuri}
                              setVihjelaskuri={setVihjelaskuri}
                              guesses={guesses}
							  ratkottu={ratkottu}/>
                    <CurrentGame date={date} dailyDate={dailyDate} />
                </div>)
        } else {
            return(<div>ladataan...</div>)
        }
    } else {
        return(<Kirjaudu updateDailyState={updateDailyState}
                         setKayttaja={setKayttaja} />)
    }
}

export default App