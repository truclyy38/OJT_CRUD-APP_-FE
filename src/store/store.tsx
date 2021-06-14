import { configureStore } from '@reduxjs/toolkit'
import authSlice from './auth-slice'

/**
 * configureStore

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
const store = configureStore({
    reducer: { auth: authSlice.reducer},
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {auth: AuthState}
export type AppDispatch = typeof store.dispatch

export default store