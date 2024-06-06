import { useEffect, useState, useRef } from "react";
import { postGuess } from "../services/requests";
import { getCityList } from "../services/requests";
import Info from "./Info.jsx";
import NewDailyPopup from "./NewDailyPopup.jsx";
import HighScores from "./HighScores.jsx";
import UserInfo from "./UserInfo.jsx";
import Archive from "./Archive.jsx";
import CorrectWindow from "./CorrectWindow.jsx";
import GameOver from "./GameOver.jsx";
import { daily } from "../App.jsx";

let cityList = null;
getCityList().then((res) => cityList = res.data)

const Guess = ({ updateDailyState, storeAnswers, setVihjelaskuri,
		arvauslaskuri, setArvauslaskuri, setGuesses, guesses, setKayttaja,
		date, setDailyDate, setDate, ratkottu, setRatkottu }) => {
    const [newGuess, setNewGuess] = useState('')
    const [showArchive, setShowArchive] = useState(false)
    const [showMap, setShowMap] = useState(false)
    const [showInfo, setShowInfo] = useState(false)
    const [showNewDaily, setShowNewDaily] = useState(false)
    const [showHighScores, setShowHighScores] = useState(false)
    const [showUserInfo, setShowUserInfo] = useState(false)
    const [showCorrectWindow, setShowCorrectWindow] = useState([false, '', 0])
    const [showGameOver, setShowGameOver] = useState(false)
	const [items, setItems] = useState([])
    const [city, setCity] = useState('')
    const inputRef = useRef(null);
  
	let suggest = [];

    useEffect(()=>{
        if(localStorage.getItem('visited')){
            setShowInfo(false)
        }
        else setShowInfo(true)
    },[])
    
    let map = document.getElementById('map')
    let pano = document.getElementById('pano')

    const onClickMap = () => {
        if (showMap === false) {
            map.style.display = 'block'
            pano.style.display = 'none'
            setShowMap(true)
        } else {
            map.style.display = 'none'
            pano.style.display = 'block'
            setShowMap(false)
        }
    }
    
    const onClickInfo = () => {
        if (showInfo === false) {
            if (showHighScores) setShowHighScores(false)
            if (showMap) setShowMap(false)
            if (showUserInfo) setShowUserInfo(false)
            if (showArchive) setShowArchive(false)
            setShowInfo(true)
        }
        else setShowInfo(false)
    }
	
	const exitNewDailyPopup = () => {
		setShowNewDaily(false);
	}

    const onClickHighScore = () => {
        if (showHighScores === false) {
            if (showInfo) setShowInfo(false)
            if (showMap) setShowMap(false)
            if (showUserInfo) setShowUserInfo(false)
            if (showArchive) setShowArchive(false)
            setShowHighScores(true)
        }
        else setShowHighScores(false)
    }

    const onClickUserInfo = () => {
        if (!showUserInfo) {
            if (showInfo) setShowInfo(false)
            if (showMap) setShowMap(false)
            if (showHighScores) setShowHighScores(false)
            if (showArchive) setShowArchive(false)
            setShowUserInfo(true)
        } else {
            setShowUserInfo(false)
        }
    }

    const onClickArchive = () => {
        if (!showArchive) {
            if (showCorrectWindow) setShowCorrectWindow([false,'',0])
            if (showGameOver) setShowGameOver(false)
            if (showInfo) setShowInfo(false)
            if (showMap) setShowMap(false)
            if (showHighScores) setShowHighScores(false)
            if (showUserInfo) setShowUserInfo(false)
            setShowArchive(true)
        } else {
            setShowArchive(false)
        }
    }

    const handleGuessChange = (e) => {
      setNewGuess(e.target.value)
      e.target.setCustomValidity("")
      e.target.reportValidity()
	  
	  if (cityList === null)
		cityList = getCityList().then();
	  else
	  {
		  suggest = cityList
			  .filter((c) => c[0].toLowerCase().startsWith(e.target.value.toLowerCase()))
			  .slice(0, 10)
			  .map((c, i) => ({id: i, name: c[0], subcountry: c[1]}));
		  setItems(suggest.map((city) =>
			<option key={city.id} value={city.name + ', ' + city.subcountry}></option>
		  ));
	  }
    }

    function isGuessValid(guess) {
        if (guess === "") {
            inputRef.current.setCustomValidity("Kaupunki ei voi olla tyhjä, anna vähintään yksi merkki")
        } else if (guesses.some(previousGuess => previousGuess.guess.toLowerCase().trim() === guess)) {
            inputRef.current.setCustomValidity("Kaupunki on jo arvattu, arvaa eri kaupunki")
        }
        return inputRef.current.reportValidity()
    }
	
	function searchCityList(name) {
		let b = 0;
		let e = cityList.length - 1;
		while (b < e) {
			let m = (b + e) >> 1;
			let cmp = name.localeCompare(
				cityList[m][0] + ', ' + cityList[m][1],
				'fi'
			);
			if (cmp > 0) {
				b = m + 1;
			} else if (cmp < 0) {
				e = m;
			} else {
				return true;
			}
		}
		return name.localeCompare(
			cityList[b][0] + ', ' + cityList[b][1],
			'fi'
		) == 0;
	}
  
    const submitGuess = (e) =>{
		e.preventDefault()
		let trimmedGuess = newGuess.toLowerCase().trim().split(',')[0]
		
		if (isGuessValid(trimmedGuess)) {
			if (daily.isArchived) {
				let guess = {
					guess: newGuess,
					correct: trimmedGuess === daily.answer.toLowerCase().trim().split(',')[0]
				}
				
				setGuesses(guesses.concat(guess))
				setNewGuess("")
				
				if (guess.correct) {
					setShowCorrectWindow([true, guess.guess, 0])
					setArvauslaskuri(4)
					setRatkottu(true)
                    setArvauslaskuri(4)
				} else if (arvauslaskuri < 4) {
					const lask = arvauslaskuri + 1
					setVihjelaskuri(lask)
					setArvauslaskuri(lask)
				} else {
					setShowGameOver(true)
					setRatkottu(true)
				}
			} else {
				postGuess({trimmedGuess, date}).then(result => {
					if (result.data.correct === 'new daily') {
						setDailyDate(result.data.date);
						updateDailyState(
							result.data.coords,
							false,
							0,
							false,
							result.data.date
						);
						setShowNewDaily(true);
						return;
					}
					
					let guess = {
						guess: newGuess,
						correct: result.data.correct
					}
					
					const guessList = guesses.concat(guess)
					storeAnswers(guessList);
					
					setGuesses(guessList)
					setNewGuess("")
					let arvaukset = result.data.laskuri
					if (guess.correct) {
						setShowCorrectWindow([true, guess.guess, (result.data.pisteet)])
						setArvauslaskuri(4) // päivitetään vihjenapit
						setRatkottu(true)
					}
					else {
						// jos >= 5 niin arvaukset käytetty
						if (arvaukset < 5) {
							setVihjelaskuri(arvaukset)
							setArvauslaskuri(arvaukset)
						} else {
							setRatkottu(true)
							setShowGameOver(true)
                            setCity(result.data.city)
						}
					}
				})
			}
		}
	}
  
    return (
        <>
            { showInfo ? <Info onClick={onClickInfo} /> : null }
            { showNewDaily ? <NewDailyPopup onClick={exitNewDailyPopup} /> : null }
            { showHighScores ? <HighScores onClick={onClickHighScore} /> : null }
            { showArchive ? <Archive updateDailyState={updateDailyState}
                                     setShowArchive={setShowArchive}
                                     onClick={onClickArchive}
                                     setDate={setDate}
									 setRatkottu={setRatkottu}/> : null }
            { showUserInfo ? <UserInfo onClick={onClickUserInfo}
                                       setKayttaja={setKayttaja}
                                       setGuesses={setGuesses}
                                       setVihjelaskuri={setVihjelaskuri}
                                       setArvauslaskuri={setArvauslaskuri}
                                       setRatkottu={setRatkottu}/> : null }
            { showCorrectWindow[0] ? <CorrectWindow onClick={() => setShowCorrectWindow([false, '', 0])}
                                                 guessed={showCorrectWindow} 
                                                 openArchive={onClickArchive}/> : null}
            { showGameOver ? <GameOver onClick={() => setShowGameOver(false)} city={city}
                                                openArchive={onClickArchive} /> : null}

            <div className={'ala-laatikko'}>
                <form onSubmit={submitGuess}>
                    <div className={'item-big'}>
                        <datalist id={'vaihtoehdot'}>
                            {items}
                        </datalist>
                        <input
							disabled={ratkottu}
                            id={'guessbox'}
                            name={'guessbox'}
                            value={newGuess}
                            list={'vaihtoehdot'}
                            ref={inputRef}
                            onChange={handleGuessChange}
                            autoComplete={'off'}
                            placeholder={ratkottu ? 'Klikkaa 🗃️ löytääksesi lisää pelejä' : 'Missä ollaan?'} autoFocus
                        />
                    </div>
                    <div className={'item'}>
                        <button title={'Lähetä arvaus'} type="submit">➤</button>
                    </div>
                </form>
                <div className={'item'}>
                    <button title={'Kartta'} onClick={onClickMap}>
                        {
                            showMap ? '🌎'
                                : '🗺️'
                        }
                    </button>
                </div>
                <div className={'item'}>
                    <button title={'Arkisto'} onClick={onClickArchive}>
                        🗃️
                    </button>
                </div>
                <div className={'item'}>
                    <button title={'Ohjeet'} onClick={onClickInfo}>❓</button>
                </div>
                <div className={'item'}>
                    <button title={'Tulostaulu'} onClick={onClickHighScore}>🏆</button>
                </div>
                <div className={'item'}>
                    <button title={'Käyttäjän tiedot'} onClick={onClickUserInfo}>👤</button>
                </div>
            </div>
        </>
    )
  }

export default Guess