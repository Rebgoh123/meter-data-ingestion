import {Outlet, Navigate} from 'react-router-dom'

import {AxiosInterceptor} from '../../api/AxiosInterceptor'

export const PrivateRoutes = ({authenticated, breadCrumbs = true, global}) => {
    return authenticated ? (
        <AxiosInterceptor>
            <Outlet context={{global}} />
        </AxiosInterceptor>
    ) : (
        <Navigate to={'/login'} />
    )
}