
import Style from './BenefitsShowcase.module.scss'
import CaptionedTitle from '../../utils/captionedTitle/CaptionedTitle'
import Carousel from '../../utils/slider/Slider'
import allTime from '../../assets/images/allTime.svg'
import anonymity from '../../assets/images/anonymity.svg'
import support from '../../assets/images/support.svg'
const BenefitsShowcase = () => {
    return (
        <div id='benefitsShowcase'>
            <CaptionedTitle title={'Dlaczego Warto ?'} />
            <Carousel numberViews={1}>
                <div >
                    <div className={Style.element}>
                        <p className={Style.title}>Dostępność 24/7</p>
                        <img className={Style.icon} src={allTime} alt="Ikona przedstawiająca cyfry '24' i '7', symbolizujące dostępność przez całą dobę, 7 dni w tygodniu." />
                        <p className={Style.description}>pomoc zawsze wtedy, gdy jej potrzebujesz</p>
                    </div>
                </div>
                <div>
                    <div className={Style.element}>
                        <p className={Style.title}>Dyskrecja i anonimowość</p>
                        <img className={Style.icon} src={anonymity} alt="Ikona przedstawiająca postać, kłódkę i oko, symbolizujące bezpieczeństwo i ochronę danych osobowych" />
                        <p className={Style.description}>bez oceniania i presji</p>
                    </div>
                </div>   <div>
                    <div className={Style.element}>
                        <p className={Style.title}>Spersonalizowane wsparcie</p>
                        <img className={Style.icon} src={support} alt="Ikona przedstawiająca osoby w objęciach dłoni, symbolizująca troskę i opiekę." />
                        <p className={Style.description}>dopasowane do Twoich potrzeb i emocji</p>
                    </div>
                </div>
            </Carousel>
        </div>
    )
}
export default BenefitsShowcase