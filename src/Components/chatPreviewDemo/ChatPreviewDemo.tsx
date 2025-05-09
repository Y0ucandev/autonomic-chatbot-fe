import Style from './ChatPreviewDemo.module.scss'
import chatScreen from '../../assets/images/chatScreen.svg'
import linkChat from '../../assets/images/StartChat.svg'
import arrowChat from '../../assets/Animation/arrow.gif'

const ChatPreviewDemo = () => {
    return (
        <div className={Style.wrapDemo}>
            <div className={Style.wrapLink}>
                <img className={Style.linkChat} src={linkChat} alt="Link kierujacy do rozmowy" />
                <img className={Style.arrowChat} src={arrowChat} alt="Gif zachęcający do wejścia" />
            </div>
            <img className={Style.chatScreen} src={chatScreen} alt="Pomieszczenie z laptopem na którym włączony jest czat" />
        </div>
    )
}
export default ChatPreviewDemo