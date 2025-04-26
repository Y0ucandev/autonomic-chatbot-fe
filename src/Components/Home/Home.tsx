import Style from './Home.module.scss'
import womanGIF from '../../assets/animation/AnimationWomen.gif'
import chatLinkImage from '../../assets/images/ChatIconStart.svg'
import SupportYou from '../supportYou/SupportYou'
import BenefitsShowcase from '../benefitsShowcase/BenefitsShowcase'
import DataSecurityPanel from '../dataSecurityPanel/DataSecurityPanel'
import ChatPreviewDemo from '../chatPreviewDemo/ChatPreviewDemo'
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
                    <img src={chatLinkImage} alt="Ikona przedstawiająca żółtą chmurkę czatu, symbolizująca rozmowę lub komunikację." />
                </div>
                <div className={Style.animation} >
                    <img src={womanGIF} alt="Animacja kobiety używającej aplikacji na telefonie, a następnie machającej do ciebie, symbolizująca interakcję i przywitanie." />
                </div>
            </div>
            <SupportYou />
            <BenefitsShowcase />
            <DataSecurityPanel />
            <ChatPreviewDemo />
        </>
    )
}
export default Home