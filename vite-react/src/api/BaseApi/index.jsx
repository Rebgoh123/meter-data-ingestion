import axios from 'axios'
import {getUserSessionToken} from '../../localstorage/index.jsx'

const BaseApi = axios.create({
    baseURL: `http://127.0.0.1:3000/`,
})

BaseApi.interceptors.request.use((config) => {
    const token = getUserSessionToken()

    if (token && !config.headers.authorization) {
        config.headers.authorization = `x-session-key ${token}`
    }
    return config
})

export default BaseApi