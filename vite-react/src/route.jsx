//custom pages
import {HomePage} from './pages/Home'
import {MeterReadingPage} from './pages/MeterReading'
import {Login} from "./pages/Login"

export const unprotectedRouteList = [
    {path: '/Login', Component: <Login />},
]

export const protectedRouteList = [
    //custom pages
    {path: '/', Component: <HomePage />},
    {path: '/Home', Component: <HomePage />},
    {path: '/Meter-Reading', Component: <MeterReadingPage />},
]