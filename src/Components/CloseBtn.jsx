import './CloseBtn.css'
const CloseBtn = (props) => {
    return (
        <div className={'close-btn'}>
            <button title={'Sulje'} onClick={props.onClick}>X</button>
        </div>
    )
}

export default CloseBtn
