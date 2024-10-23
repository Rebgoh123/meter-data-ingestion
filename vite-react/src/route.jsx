//custom pages
import Home from './pages/Home'
import About from './pages/About'
import Login from "./pages/Login"

export const unprotectedRouteList = [
    {path: '/Login', Component: <Login />},
]

export const protectedRouteList = [
    //custom pages
    {path: '/', Component: <Home />},
    {path: '/Home', Component: <Home />},
    {path: '/About', Component: <About />},
]