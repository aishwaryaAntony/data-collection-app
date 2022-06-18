import {  FETCH_RBTS } from "../actions/actionTypes"


const initialstate = {
    rbts:[]
}

export default function rbtsReducer (state = initialstate, action) {
    switch (action.type) {
        case FETCH_RBTS:
            return {
                ...state,
                rbts: action.data
            }
         
        default:
            return state;
    }
}