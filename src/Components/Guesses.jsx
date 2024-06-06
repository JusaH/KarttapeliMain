const Guesses = ({ guesses }) => {
    if (guesses.length > 0) {
        return (
            <div className="history_box">
                <p>Arvaushistoria:</p>
                <ul>
                    {
                        guesses.map((guess, i) => (
                            guess.correct
                                ? <li className="right" key={i}>{guess.guess.split(',')[0]}</li>
                                : <li className="wrong" key={i}>{guess.guess.split(',')[0]}</li>
                        ))
                    }
                </ul>
            </div>
        )
    }
}

export default Guesses