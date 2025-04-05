import SupportYou from '../SupportYou/SupportYou'
import Style from './Home.module.scss'

const Home = () => {
    return (
        <>
            <div className={Style.home}>
                <div className={Style.wrapTitle}>
                    <h1 className={Style.title}>TWÓJ CYFROWY TERAPEUTA</h1>
                    <h2>WSPARCIE NA WYCIĄGNIĘCIE RĘKI</h2>
                </div>
                <div className={Style.btnChat}>
                    <a href="#">ROZPOCZNIJ ROZMOWĘ</a>
                </div>
                <div className={Style.animation}>
                </div>

            </div>
            <SupportYou />

        </>

    )
}

export default Home