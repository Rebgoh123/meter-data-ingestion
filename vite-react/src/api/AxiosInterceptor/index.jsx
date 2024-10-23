import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

import API from '../BaseApi'

async function fulfillWithTimeLimit(timeLimit, task, failureValue) {
    let timeout
    const timeoutPromise = new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
            resolve(failureValue)
        }, timeLimit)
    })

    const response = await Promise.race([task, timeoutPromise])

    if (timeout) {
        clearTimeout(timeout)
    }

    return response
}

const AxiosInterceptor = ({children}) => {
    const navigate = useNavigate()

    useEffect(() => {
        const resInterceptor = (response) => {
            return response
        }

        const errInterceptor = async (error) => {
            if (error.response.status === 400) {
                return Promise.reject(error.response)
            }

            return Promise.reject(error.response)
        }

        const interceptor = API.interceptors.response.use(resInterceptor, errInterceptor)

        return () => API.interceptors.response.eject(interceptor)
    }, [navigate])

    return children
}

export {AxiosInterceptor}