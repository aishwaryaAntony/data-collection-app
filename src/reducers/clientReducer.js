import {  FETCH_CLIENTS } from "../actions/actionTypes"


const initialstate = {
    clients:[]
}

export default function clientReducer (state = initialstate, action) {
    switch (action.type) {
        case FETCH_CLIENTS:
            return {
                ...state,
                clients: action.data
            }
         
        default:
            return state;
    }
}