import {useEffect} from 'react'
import {useQuery} from 'react-query'

export const useDataFetching = (key, queryFn, opt = {}) => {
    /**
     * We need to init google client before calling any API
     * so that we can have valid auth token or redirect to any error page
     * @type {boolean|*}
     */
    const {
        isIdle,
        isLoading,
        isError,
        error,
        data,
        isPreviousData,
        isFetching,
        refetch,
        isRefetching,
    } = useQuery(key, queryFn, opt)

    useEffect(() => {
        // we only wanna refetch if we dont have any data
        if (!data && !isIdle) {
            refetch()
        }
    }, [data])

    if (isError) {
        console.error(error)
    }

    return {
        isIdle,
        loading: isLoading,
        isError,
        error,
        data,
        isPreviousData,
        isRefetching,
        isFetching,
    }
}

export default useDataFetching