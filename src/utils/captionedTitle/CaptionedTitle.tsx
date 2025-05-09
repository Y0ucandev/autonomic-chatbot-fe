import Style from './CaptionedTitle.module.scss'
import linkChat from '../../assets/images/StartChat.svg'

const CaptionedTitle = ({ title }: { title: string }) => {
    return (
        <div className={Style.wrapTitle}>
            <a href="#" className={Style.linkChat}>
                <img src={linkChat} alt="Ikona chat kierująca do rozpoczęcia czatu" />
            </a>
            <h2>{title}</h2>
        </div>
    )
}
export default CaptionedTitle