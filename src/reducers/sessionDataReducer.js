import { FETCH_SESSION_DATA } from "../actions/actionTypes"


const initialstate = {
    sessionData: []
}

export default function sessionDataReducer(state = initialstate, action) {
    switch (action.type) {
        case FETCH_SESSION_DATA:
            return {
                ...state,
                sessionData: action.data
            }

        default:
            return state;
    }
}