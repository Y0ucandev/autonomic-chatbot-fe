import Style from './BtnSecret.module.scss'
import iconON from '../../assets/images/hide.svg'
import iconOff from '../../assets/images/reveal.svg'

const BtnSecret = ({ passwordReveal, togglePasswordReveal }: { passwordReveal: 'password' | 'text', togglePasswordReveal: () => void }) => {
    return (
        <button type="button" onClick={togglePasswordReveal}>
            {passwordReveal === 'password' ?
                <img className={Style.passwordShow} src={iconOff} alt="Ikona symbolizująca ukrycie hasła." /> :
                <img className={Style.passwordShow} src={iconON} alt="Ikona symbolizująca odkrycie hasła" />}
        </button>
    );
};
export default BtnSecret