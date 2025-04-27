import Style from './Header.module.scss'
const Header = () => {
    const goElement = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    }
    return (
        <nav className={Style.wrapNav}>
            <button className={Style.navBtn} onClick={() => { goElement('supportYou') }}>JAK DZIAŁAM</button>
            <button className={Style.navBtn} onClick={() => { goElement('benefitsShowcase') }}>KORZYŚCI</button>
            <button className={Style.navBtn} onClick={() => { goElement('dataSecurityPanel') }}>BEZPIECZEŃSTWO</button>
            <a className={`${Style.navBtn} ${Style.navLogIn}`} href="#">ZALOGUJ SIĘ</a>
        </nav>
    )
}
export default Header