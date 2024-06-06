import React from "react";
import HintButton from "./HintButton.jsx";

const HintList = props => {

    function addHintButtons() {
        const buttons = [];
        for (let i = 0; i < 5; i++) {
            buttons.push(
						<li key={i}>
							<HintButton index={i}
										 arvauslaskuri={props.arvauslaskuri}
                                         vihjelaskuri={props.vihjelaskuri}
                                         guesses={props.guesses}
										 disabled={i > props.arvauslaskuri}
										 correct={props.ratkottu &&
												(!props.guesses[i] || props.guesses[i].correct)}
										 onClick={() => props.setVihjelaskuri(i)}
										 text={i + 1} />
								{i < props.guesses.length ?
									<div className={props.guesses[i].correct ?
                                            'arvausNimiRight' :
											'arvausNimiWrong'}>
										<div className={'arvausP'}>{props.guesses[i].guess.split(',')[0]}</div>
									</div> :
									null}
						</li>)
        }
        return buttons;
    }

    return (
        <ul className={"hints"}>
            {
                addHintButtons()
            }
        </ul>
    )
}

export default HintList