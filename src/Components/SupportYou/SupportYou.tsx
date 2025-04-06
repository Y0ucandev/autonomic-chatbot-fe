import Style from './SupportYou.module.scss'
import linkChat from '../../assets/images/StartChat.svg'
const SupportYou = () => {
    return (
        <div className={Style.supportYou}>
            <div className={Style.wrapTitle}>
                <a href="#" className={Style.linkChat}>
                    <img src={linkChat} alt="Ikona chat kierująca do rozpoczęcia czatu" />
                </a>
                <h2>JAK MOGĘ CI POMÓC</h2>
            </div>
        </div>
    )
}
export default SupportYou