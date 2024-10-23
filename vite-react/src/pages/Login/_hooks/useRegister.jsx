import {useMutation} from 'react-query'

import BaseApi from '../../../api/BaseApi'
import {useState} from 'react'
import {useSnackBar} from "../../../hoc/SnackbarHandler/index.jsx";

export async function register(formDetails) {

    const {data} = await BaseApi.post('signup', {
        username: formDetails.username,
        password: formDetails.password,
    })

    return data
}

export function useRegister() {
    const [isSuccess, setIsSuccess] = useState(false)
    const [result, setResult] = useState(false)
    const {setSnackBar} = useSnackBar()

    const {mutate, isLoading} = useMutation(
        'register',
        (formDetails) => register(formDetails),
        {
            onSuccess: (result) => {
                setResult(result.result)
                setIsSuccess(true)
                setSnackBar({
                    open: true,
                    message:'Register Successfully',
                    type: 'success'
                })
            },
        }
    )

    return {mutate, isLoading, isSuccess, setIsSuccess, result}
}