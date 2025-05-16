import useAuth from '../../hooks/useAuth';
import Style from './userPanel.module.scss'

const UserPanel = () => {
    const { logout } = useAuth();
    return (
        <div className={Style.wrapPanel}>
            <nav className={Style.navPanel}>
                <p className={Style.name}>Jan Nowak</p>
                <ul>
                    <li><button className={Style.navBtn}>Ocena nastroju</button></li>
                    <li><button className={Style.navBtn}>Rozpocznij chat</button></li>
                    <li><button className={Style.navBtn}>Historia chatów</button></li>
                    <li><button onClick={logout} type='button' className={Style.navBtn}>Wyloguj</button></li>
                </ul>
            </nav>
            <div className={Style.panel}>
            </div>
        </div>
    )
}
export default UserPanel