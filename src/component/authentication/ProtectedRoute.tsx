import { Redirect, Route } from 'react-router'
import { useAppSelector } from '../../hooks/hook';

/**
 * ProtectedRoute
 *
 * Version 1.0
 *
 * Date: 06-10-2021
 *
 * Copyright
 *
 * Modification Logs:
 * DATE                 AUTHOR          DESCRIPTION
 * -----------------------------------------------------------------------
 * 06-10-2021	         LyNTT9           Create
 */
const ProtectedRoute = ({...routeProps }) => {
    
    const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
    
    if (isLoggedIn) {
        return <Route {...routeProps} />
    } else {
        return <Redirect to='/' />
    }
}

export default ProtectedRoute