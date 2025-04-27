import Style from './SupportYou.module.scss'

import computerCloud from '../../assets/animation/ComputerCloud.gif'
import specialistSupport from '../../assets/animation/specialistSupport.gif'
import chatReplies from '../../assets/animation/chatReplies.gif'
import rememberConversations from '../../assets/animation//RememberConversations.gif'
import CaptionedTitle from '../../utils/captionedTitle/CaptionedTitle'
const SupportYou = () => {
    return (
        <div id='supportYou' className={Style.supportYou}>
            <CaptionedTitle title={'Jak mogę Ci pomóc'} />
            <div className={Style.supportItems}>
                <div className={`${Style.supportItem} ${Style.supportItemFirst}`}>
                    <img src={computerCloud} alt="Animacja komputera z widocznym czatem, nad którym unosi się chmurka z opisem, symbolizująca interakcję online." />
                    <p>Słucham Ciebie, kiedy tego potrzebujesz</p>
                </div>
                <div className={`${Style.supportItem} ${Style.supportItemSecond}`}>
                    <p >W razie potrzeby pomogę Tobie skontaktować się
                        z odpowiednim specjalistą</p>
                    <img src={specialistSupport} alt="Animacja przedstawiająca tablet z diagramami, z którego odchodzą strzałki do miniaturek specjalistów, symbolizująca dobór terapeuty." />
                </div>
                <div className={`${Style.supportItem} ${Style.supportItemThird}`}>
                    <p>Dopasowywanie odpowiedzi do Twojej osobowości</p>
                    <img src={chatReplies} alt="Animacja zmieniająca okienka czasu i dopasowująca rozmowę, symbolizująca dynamiczną interakcję w czasie rzeczywistym." />
                </div>
                <div className={`${Style.supportItem} ${Style.supportItemFourth}`}>
                    <p>Pamiętam o czym rozmawiamy By lepiej rozumieć twoje potrzeby</p>
                    <img src={rememberConversations} alt="Animacja przedstawiająca postać robota myślącego o rozmowie z tobą, symbolizująca sztuczną inteligencję i interakcję z użytkownikiem." />
                </div>
            </div>
        </div >
    )
}
export default SupportYou