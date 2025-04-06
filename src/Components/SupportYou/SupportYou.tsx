import Style from './SupportYou.module.scss'
import linkChat from '../../assets/images/StartChat.svg'
import computerCloud from '../../assets/animation/ComputerCloud.gif'
const SupportYou = () => {
    return (
        <div className={Style.supportYou}>
            <div className={Style.wrapTitle}>
                <a href="#" className={Style.linkChat}>
                    <img src={linkChat} alt="Ikona chat kierująca do rozpoczęcia czatu" />
                </a>
                <h2>JAK MOGĘ CI POMÓC</h2>
            </div>
            <div className={Style.supportItems}>
                <div className={`${Style.supportItem} ${Style.supportItemFirst}`}>
                    <img src={computerCloud} alt="" />
                    <p>Słucham Ciebie, kiedy tego potrzebujesz</p>
                </div>
                <div className={Style.supportItem}>
                    <div>
                        <p >W razie potrzeby pomogę Tobie skontaktować się
                            z odpowiednim specjalistą</p>
                    </div>
                </div>
                <div className={Style.supportItem}>
                    <p>Dopasowywanie odpowiedzi do Twojej osobowości</p>
                </div>
                <div className={Style.supportItem}>
                    <p>Pamiętam o czym rozmawiamy By lepiej rozumieć twoje potrzeby</p>
                </div>
            </div>
        </div >
    )
}
export default SupportYou