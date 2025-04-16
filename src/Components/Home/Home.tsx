import Style from './Home.module.scss'
import womanGIF from '../../assets/animation/AnimationWomen.gif'
import chatLinkImage from '../../assets/images/ChatIconStart.svg'
import SupportYou from '../supportYou/SupportYou'
import BenefitsShowcase from '../benefitsShowcase/BenefitsShowcase'
const Home = () => {
    return (
        <>
            <div className={Style.home}>
                <div className={Style.wrapTitle}>
                    <h1 className={Style.title}>TWÓJ CYFROWY TERAPEUTA</h1>
                    <h2>WSPARCIE NA WYCIĄGNIĘCIE RĘKI</h2>
                </div>
                <div className={Style.chatLink}>
                    <a href="#">ROZPOCZNIJ ROZMOWĘ</a>
                    <img src={chatLinkImage} alt="Ikona chmurek czatu kierująca do rozmowy" />
                </div>
                <div className={Style.animation} >
                    <img src={womanGIF} alt="Uśmiechnięta kobieta korzystająca z aplikacji na smartphonie" />
                </div>
            </div>
            <SupportYou />
            <BenefitsShowcase />
        </>
    )
}
export default Home