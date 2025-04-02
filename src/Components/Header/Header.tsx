import Style from './Header.module.scss'

const Header = () => {
    return (
        <nav className={Style.wrapNav}>
            <a className={Style.navBtn} href="#">JAK DZIAŁAM</a>
            <a className={Style.navBtn} href="#">KORZYŚCI</a>
            <a className={Style.navBtn} href="#">BEZPIECZEŃSTWO</a>
            <a className={`${Style.navBtn} ${Style.navLogIn}`} href="#">ZALOGUJ SIĘ</a>
        </nav>
    )
}

export default Header