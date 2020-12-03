import { combineReducers } from "redux";
import { uiReducer } from "./uiReducer";
import { CalendarReducer } from "./calendarReducer";
import { authReducer } from "./authReducer";


export const rootReducer = combineReducers({
    ui: uiReducer,
    calendar: CalendarReducer,
    auth: authReducer,
})