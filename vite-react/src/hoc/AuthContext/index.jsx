import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {getUsername, getUserSessionToken, setUsername, setUserSessionToken} from "../../localstorage/index.jsx";

export const AuthContext = React.createContext({})

export function AuthProvider({children}) {
    const [user, setUser] = useState(undefined)
    const [token, setToken] = useState(undefined)
    const [isLoading, setIsLoading] = useState(true)
    let navigate = useNavigate()

    useEffect(() => {
        // clean up controller
        let isLogin = true
        let userToken = getUserSessionToken()
        let user = getUsername()

        if(!userToken){
            navigate('/Login')
        }else{
            setUser(user)
            setToken(userToken)
        }

        setIsLoading(false)
        // cancel subscription to useEffect
        return () => (isLogin = false)
    }, [])

    useEffect(() => {
        if(user?.sessionToken){
            setUserSessionToken(user.sessionToken)
            setToken(user.sessionToken)
            setUsername(user.user)
        }
    }, [user])

    if(isLoading){
        return null
    }

    return <AuthContext.Provider value={{user, setUser, setToken}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)