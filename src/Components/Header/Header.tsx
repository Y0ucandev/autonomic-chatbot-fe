import { useNavigate } from 'react-router-dom';
import Style from './Header.module.scss'
const Header = () => {
    const navigate = useNavigate();
    const goElement = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }
    return (
        <nav className={Style.wrapNav}>
            <button className={Style.navBtn} onClick={() => { navigate('/'); goElement('supportYou') }}>JAK DZIAŁAM</button>
            <button className={Style.navBtn} onClick={() => { navigate('/'); goElement('benefitsShowcase') }}>KORZYŚCI</button>
            <button className={Style.navBtn} onClick={() => { navigate('/'); goElement('dataSecurityPanel') }}>BEZPIECZEŃSTWO</button>
            <button className={`${Style.navBtn} ${Style.navLogIn}`} onClick={() => { navigate('/Rejestracja') }}>ZALOGUJ SIĘ</button>
        </nav>
    )
}
export default Header