import "./CurrentGame.css"

const CurrentGame = props => {

    function parseDate(date) {
        let parsedDate = date.split(" ", 4);
        return parsedDate.join(" ")
    }

    return (
        <div className={"currentGame"}>
            {
                props.date === props.dailyDate
                    ? <p>Tämänpäiväinen</p>
                    : <p>Arkistoitu ({parseDate(props.date)})</p>
            }
        </div>
    )
}

export default CurrentGame