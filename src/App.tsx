
import { Outlet, Route, Routes } from 'react-router-dom'
import './App.css'
import Header from './Components/Header/Header'
import Home from './Components/Home/Home'

const Layout = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
      </Route>
    </Routes >

  )
}

export default App
