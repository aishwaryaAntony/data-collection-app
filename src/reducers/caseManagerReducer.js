import {  FETCH_CASEMANAGERS } from "../actions/actionTypes"


const initialstate = {
    caseManagers:[]
}

export default function  caseManagerReducer (state = initialstate, action) {
    switch (action.type) {
        case FETCH_CASEMANAGERS:
            return {
                ...state,
                caseManagers: action.data
            }
         
        default:
            return state;
    }
}