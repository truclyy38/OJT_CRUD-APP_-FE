import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios';

/**
 * authSlice

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

/**
* interface AuthState
*/
interface AuthState {
    token: string | null
    isLoggedIn?: boolean
    isRemember: boolean
}

const init = localStorage.getItem('token')

axios.defaults.headers.common['Authorization'] = init

/**
* init state
*/
const initialState: AuthState = {
    token: init,
    isLoggedIn: !!init,
    isRemember: true,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // login
        login(state, action: PayloadAction<AuthState>) {          
            if(action.payload.isRemember){
                localStorage.setItem('token', action.payload.token!)
            } 
            state.token = action.payload.token
            state.isLoggedIn = true
            state.isRemember = action.payload.isRemember
            axios.defaults.headers.common['Authorization'] = action.payload.token
        },
        // logout
        logout(state) {
            localStorage.removeItem('token')
            state.token = ''
            state.isLoggedIn = false
            axios.defaults.headers.common['Authorization'] = null
        },
    },
})

export const authActions = authSlice.actions

export default authSlice
