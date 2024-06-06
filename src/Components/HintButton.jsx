const HintButton = props => {

    function getStyle() {
        let styles = "";
        if (props.index === props.vihjelaskuri) {
            styles += "selectedHint "
        }
        if (props.disabled) {
            styles += "disabled"
        } else if (!props.correct && props.index < props.arvauslaskuri) {
            styles += "wrongHint"
        } else if (props.guesses.length > 4 && !props.correct) {
            styles += "wrongHint"
        } else if (props.correct) {
            styles += "rightHint"
        } else {
            styles += "normal"
        }
        return styles;
    }

    function getStyleGuess() {
        if (!props.correct) {
            return "Wrong"
        } else {
            return "Right"
        }
    }

    return (
        <p className={"item"}>
            <button className={getStyle()}
                    title={"Vihje " + props.text}
                    onClick={props.onClick}
                    disabled={props.disabled}>
                {props.text}
            </button>
        </p>
    )
}

export default HintButton