import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './components/header/Header'
import Home from './components/home/Home'
import UserRegistration from './components/loginPage/userRegistration/UserRegistration'
import UserLogin from './components/loginPage/userLogin/UserLogin'
import ProtectedRoute from './services/ProtectedRoute'
import UserPanel from './components/userPanel/userPanel'

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='Logowanie' element={<UserLogin />} />
        <Route path='Rejestracja' element={<UserRegistration />} />
        <Route element={<ProtectedRoute />}>
          <Route path='Uzytkownik' element={<UserPanel />} >
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}
export default App