import CloseBtn from "./CloseBtn.jsx";

const NewDailyPopup = (props) => {
    return(
        <div className={'info-screen2'}>
            <CloseBtn onClick={props.onClick}/>
            <div className={'info-screen-content'}>
                <h3>Daily on vaihtunut.</h3>
                <p>Sulje tämä päästäksesi pelaamaan uutta dailyä.</p>
            </div>
        </div>
    )
}

export default NewDailyPopup
