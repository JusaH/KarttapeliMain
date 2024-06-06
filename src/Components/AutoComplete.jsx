import cities from "../../cities"

const AutoComplete = ({ guess, setGuess }) => {

    const filtered = cities.filter(element => {
        if(element.city.toLowerCase().startsWith(guess.toLowerCase()))
            return true
        return false 
    })

    return (
    <div>
        <ul>
            {filtered.map((element, i) => 
                <li onClick={() => setGuess(element.city)} key={i}>{element.city}</li>)
            }               
        </ul>    
    </div>
    )
}

export default AutoComplete