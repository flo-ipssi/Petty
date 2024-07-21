import { createSlice } from "@reduxjs/toolkit";

interface MatchNotification{
    user: any;
    pet: any;    
}

const initialState : MatchNotification = {
    user: {
        name: 'ok user'
    },
    pet: {
        name: 'César'
    }
}
const slice = createSlice({
    name: 'MatchNotification',
    initialState,
    reducers: {
        // upldateMatchNotification()
    }
})