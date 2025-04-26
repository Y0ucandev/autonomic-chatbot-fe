import Style from './ChatPreviewDemo.module.scss'
import chatScreen from '../../assets/images/chatScreen.svg'
import linkChat from '../../assets/images/StartChat.svg'
import arrowChat from '../../assets/Animation/arrow.gif'
const ChatPreviewDemo = () => {
    return (
        <div className={Style.wrapDemo}>
            <div className={Style.wrapLink}>
                <img className={Style.linkChat} src={linkChat} alt="Ikona przedstawiająca chmurkę czatu z napisem 'Hat', symbolizująca rozmowę lub komunikację." />
                <img className={Style.arrowChat} src={arrowChat} alt="Ikona strzałki, symbolizująca kliknięcie w link." />
            </div>
            <img className={Style.chatScreen} src={chatScreen} alt="Tło strony przedstawiające laptopa na stole z włączoną aplikacją autonomicznego chatbota." />
        </div>
    )
}
export default ChatPreviewDemo