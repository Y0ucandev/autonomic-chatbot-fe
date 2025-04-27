
import { useNavigate } from 'react-router-dom';
import Style from './ErrorPopup.module.scss'
import iconError from '../../assets/images/error.svg'
const ErrorPopup = ({ error }: { error: string }) => {
    const navigate = useNavigate();
    return (
        <div className={Style.wrapPopup}>
            <h3 className={Style.title}>Podczas rejestracji wystąpił problem.</h3>
            <p className={Style.error}>Błąd: {error}</p>
            <img src={iconError} alt="Postac popsutego chatBota, przedstawiającego awarie podczas działania aplikacji" />
            <button className={Style.finish}
                onClick={() => {
                    navigate('/');
                }}
            >
                Wróć na strony główną
            </button>
        </div>
    )
}
export default ErrorPopup