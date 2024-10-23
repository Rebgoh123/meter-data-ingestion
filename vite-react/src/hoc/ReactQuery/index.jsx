import {QueryCache, QueryClient} from 'react-query'
import React from 'react'
import {Snackbar} from "@mui/material";

function queryErrorHandler(error) {
    // error is type unknown because in js, anything can be an error (e.g. throw(5))
    const title = error instanceof Error ? error.message : 'Error connecting to server'

    return (
        <Snackbar
            open={true}
            type={'error'}
            message={title}
            handleOpenClose={() => console.log('error')}
        />
    )
}

export function generateQueryClient() {
    return new QueryClient({
        defaultOptions: {
            // from https://tkdodo.eu/blog/react-query-error-handling#the-global-callbacks
            queryCache: new QueryCache({
                onError: queryErrorHandler,
            }),
            queries: {
                onError: queryErrorHandler,
                refetchOnMount: false,
                refetchOnWindowFocus: false,
                refetchOnReconnect: false,
                cacheTime: 0,
            },
            mutations: {
                onError: queryErrorHandler,
            },
        },
    })
}

export const queryClient = generateQueryClient()