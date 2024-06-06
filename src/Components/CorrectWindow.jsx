const CorrectWindow = (props) => {
  return(
      <div className={'oikeaVastaus'}>
          <div className={'info-screen-content'}>
              <div className={'hautakivi'}>🎊</div>
              <h3>✨ Vastauksesi &apos;{props.guessed[1].split(',')[0]}&apos; oli oikein! ✨</h3>
              <p>Sait pisteitä: {props.guessed[2]}</p>
              <button className={'valkoinenNappi'} onClick={props.onClick}>Palaa peliin</button>
              {' '}
              <button className={'valkoinenNappi'} onClick={props.openArchive}>Pelaa aikaisempia</button>
          </div>
      </div>
  )
}

export default CorrectWindow