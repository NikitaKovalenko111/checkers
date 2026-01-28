import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { FigureType } from '../../../types'

export interface SessionState {
    sessionId: string
    team: 'black' | 'white'
    figures: Array<FigureType>
}

const initialState: SessionState = {
    sessionId: '',
    team: 'white',
    figures: []
}

type SetSessionPayloadType = {
    sessionId: string
    team: 'black' | 'white'
    figures: Array<FigureType>
}

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        setSession: (state, action: PayloadAction<SetSessionPayloadType>) => {
            state.sessionId = action.payload.sessionId
            state.figures = action.payload.figures
            state.team = action.payload.team
        }
    },
})

export const { setSession } = sessionSlice.actions

export default sessionSlice.reducer