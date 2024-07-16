import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth";
import notificationReducer from "./notification"
import filterReducer from "./filter"

const reducer = combineReducers({
    auth: authReducer,
    notification: notificationReducer, 
    filter: filterReducer
})

const store = configureStore({
    reducer,
})

export type RootState = ReturnType<typeof store.getState>;
export default store