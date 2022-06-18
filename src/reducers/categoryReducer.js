import {  FETCH_VIEWPROGRAM ,FETCH_CATEGORIES,FETCH_CATEGORIES_BY_ID} from "../actions/actionTypes"


const initialstate = {
    program:{},
    categories:null,
    category:null
}

export default function categoryReducer (state = initialstate, action) {
    switch (action.type) {
        case FETCH_VIEWPROGRAM:
            return {
                ...state,
                program: action.data
            }
            case FETCH_CATEGORIES:
            return {
                ...state,
                categories: action.data
            }
            case FETCH_CATEGORIES_BY_ID:
            return {
                ...state,
                category: action.data
            }
         
         
        default:
            return state;
    }
}