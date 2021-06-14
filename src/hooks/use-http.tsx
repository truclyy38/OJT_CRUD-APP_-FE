import { useCallback, useReducer } from 'react'
import { ActionType } from '../constansts/action-type'
import { RequestStatus } from '../constansts/request-status'
 
/**
 * useHttp

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

interface action {
    type: ActionType | null
    responseData?: string
    errorMessage?: string
}
 
interface State {
    data: any
    error: any
    status: RequestStatus | null
}
 
const httpReducer: React.Reducer<State, action> = (state, action) => {
    switch (action.type) {
        case ActionType.SEND:
            return {
                data: null,
                error: null,
                status: RequestStatus.PENDING,
            }
        case ActionType.SUCCESS:
            return {
                data: action.responseData,
                error: null,
                status: RequestStatus.COMPLETED,
            }
        case ActionType.ERROR:
            return {
                data: null,
                error: action.errorMessage,
                status: RequestStatus.COMPLETED,
            }
        default:
            return state
    }
}
 

function useHttp(requestFunction: any, startWithPending = false) {
    const [httpState, dispatch] = useReducer(httpReducer, {
        status: startWithPending ? RequestStatus.PENDING : null,
        data: null,
        error: null,
    })
 
    const sendRequest = useCallback(
        async function (requestData?) {
            dispatch({ type: ActionType.SEND })
            try {
                const responseData = await requestFunction(requestData)
                setTimeout(() => {
                    dispatch({ type: ActionType.SUCCESS, responseData })
                }, 500);
            } catch (error) {                
                setTimeout(() => {
                    dispatch({
                        type: ActionType.ERROR,
                        errorMessage: error.response.data || 'Something went wrong!',
                    })
                }, 500)
            }
        },
        [requestFunction]
    )
 
    return {
        sendRequest,
        ...httpState,
    }
}
 
export default useHttp