
import Style from './BenefitsShowcase.module.scss'
import CaptionedTitle from '../../utils/captionedTitle/CaptionedTitle'
import Carousel from '../../utils/slider/Slider'
import allTime from '../../assets/images/allTime.svg'
import anonymity from '../../assets/images/anonymity.svg'
import support from '../../assets/images/support.svg'
const BenefitsShowcase = () => {
    return (
        <>
            <CaptionedTitle title={'Dlaczego Warto ?'} />
            <Carousel numberViews={1}>
                <div>
                    <div className={Style.element}>
                        <p className={Style.title}>Dostępność 24/7</p>
                        <img className={Style.icon} src={allTime} alt="zapis 27 przez 7 otoczony strzałką" />
                        <p className={Style.description}>pomoc zawsze wtedy, gdy jej potrzebujesz</p>
                    </div>
                </div>
                <div>
                    <div className={Style.element}>
                        <p className={Style.title}>Dyskrecja i anonimowość</p>
                        <img className={Style.icon} src={anonymity} alt="zapis 27 przez 7 otoczony strzałką" />
                        <p className={Style.description}>bez oceniania i presji</p>
                    </div>
                </div>   <div>
                    <div className={Style.element}>
                        <p className={Style.title}>Spersonalizowane wsparcie</p>
                        <img className={Style.icon} src={support} alt="zapis 27 przez 7 otoczony strzałką" />
                        <p className={Style.description}>dopasowane do Twoich potrzeb i emocji</p>
                    </div>
                </div>
            </Carousel>
        </>
    )
}
export default BenefitsShowcase