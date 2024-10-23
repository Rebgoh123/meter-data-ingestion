import {useMutation} from 'react-query'

import BaseApi from '../../../api/BaseApi'
import {useState} from 'react'
import {useSnackBar} from "../../../hoc/SnackbarHandler/index.jsx";

export async function login(formDetails) {

    const {data} = await BaseApi.post('login', {
        username: formDetails.username,
        password: formDetails.password,
    })

    return data
}

export function useLogin() {
    const [isSuccess, setIsSuccess] = useState(false)
    const [result, setResult] = useState(false)
    const {setSnackBar} = useSnackBar()

    const {mutate, isLoading} = useMutation(
        'login',
        (formDetails) => login(formDetails),
        {
            onSuccess: (result) => {
                console.log(result)
                setResult(result.result)
                setIsSuccess(true)
                setSnackBar({
                    open: true,
                    message:'Login Successfully',
                    type: 'success'
                })
            },
            onError: (error) => {
                setSnackBar({
                    open: true,
                    message:'Failed to login, please try again',
                    type: 'success'
                })
            }
        }
    )

    return {mutate, isLoading, isSuccess, setIsSuccess, result}
}