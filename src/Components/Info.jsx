import CloseBtn from "./CloseBtn.jsx";

const Info = (props) => {

    function closeAndSetVisited() {
        props.onClick();
        localStorage.setItem("visited", "true");
    }
    
    return(
        <div className={'info-screen2'}>
            <CloseBtn onClick={closeAndSetVisited}/>
            <div className={'info-screen-content'}>
                <h3>Tervetuloa pelaamaan karttapeliä!</h3>
                <h4>Pelin ohjeet</h4>
                <p>Pelin idea on arvata kuvan ja kartan perusteella kaupungin nimi.</p>
                <p>Arvatessasi väärin saat samasta kaupungista helpomman kuvan. Mitä aiemmin
                    arvaat oikein sitä enemmän saat pisteitä.</p>
                <p>Kuva ja karttasijainti voi olla mistä päin maailmaa tahansa.</p>
                <h4>Toiminnot</h4>
                <p>Voit pyörittää kuvaa raahaamalla.</p>
                <p>Numeroituja vihjeneliöitä painamalla voit navigoida vihjekuvien välillä.</p>
                <p>Saat kartan esiin painamalla 🗺️-painiketta. Paluu kuvaan onnistuu 🌎-painikkeesta.</p>
                <p>Arkiston saat avattua painamalla 🗃️-painiketta. Sieltä voit valita ja pelata aikaisempia pelejä.
                Arkistoiduista peleistä et kuitenkaan voi saada pisteitä.</p>
                <p>Ohjeet saat uudestaan esille ❓-painikkeesta ja tulostaulun löydät 🏆-painikkeen takaa.</p>
                <p>Käyttäjätiedot saat esiin painamalla 👤-painiketta. Samasta valikosta voit myös kirjautua ulos.</p>
                {
                    !localStorage.getItem("visited")
                        ? <button className={"logout"} onClick={closeAndSetVisited}>Aloita peli</button>
                        : null
                }
            </div>
        </div>
    )
}

export default Info
