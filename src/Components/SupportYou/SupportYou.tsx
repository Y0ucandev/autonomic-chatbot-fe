import Style from './SupportYou.module.scss'

import computerCloud from '../../assets/animation/ComputerCloud.gif'
import specialistSupport from '../../assets/animation/specialistSupport.gif'
import chatReplies from '../../assets/animation/chatReplies.gif'
import rememberConversations from '../../assets/animation//RememberConversations.gif'
import CaptionedTitle from '../../utils/CaptionedTitle'
const SupportYou = () => {
    return (
        <div className={Style.supportYou}>
            <CaptionedTitle title={'Jak mogę Ci pomóc'} />
            <div className={Style.supportItems}>
                <div className={`${Style.supportItem} ${Style.supportItemFirst}`}>
                    <img src={computerCloud} alt="Animacja komputera z widocznym czatem" />
                    <p>Słucham Ciebie, kiedy tego potrzebujesz</p>
                </div>
                <div className={`${Style.supportItem} ${Style.supportItemSecond}`}>
                    <p >W razie potrzeby pomogę Tobie skontaktować się
                        z odpowiednim specjalistą</p>
                    <img src={specialistSupport} alt="Animacja przedstawiająca strzałkami różnych specjalistów " />
                </div>
                <div className={`${Style.supportItem} ${Style.supportItemThird}`}>
                    <p>Dopasowywanie odpowiedzi do Twojej osobowości</p>
                    <img src={chatReplies} alt="Animacja dopasowująca odpowiednią odpowiedz w czacie" />
                </div>
                <div className={`${Style.supportItem} ${Style.supportItemFourth}`}>
                    <p>Pamiętam o czym rozmawiamy By lepiej rozumieć twoje potrzeby</p>
                    <img src={rememberConversations} alt="Postać chatBota pamiętającego rozmowe" />
                </div>
            </div>
        </div >
    )
}
export default SupportYou