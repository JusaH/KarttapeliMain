import {daily} from "../App.jsx";

const GameOver = (props) => {
  return(
      <div className={'gameOver'}>
          <div className={'info-screen-content'}>
              <div className={'hautakivi'}>🪦</div>
              <h3>Game over!</h3>
              <p>Et voi saada enää pisteitä päivittäisestä pelistä.</p>
              <p>Oikea vastaus oli {daily.isArchived ? daily.answer : props.city}.</p>
              <button className={'valkoinenNappi'} onClick={props.onClick}>Palaa peliin</button>
              <button className={'valkoinenNappi'} onClick={props.openArchive}>Pelaa aikaisempia</button>
          </div>
      </div>
  )
}

export default GameOver
