import { FETCH_SUB_CATEGORIES, FETCH_SUBCATEGORY } from "../actions/actionTypes"


const initialstate = {

    subcategories: null,
    category: null
}

export default function categoryReducer(state = initialstate, action) {
    switch (action.type) {
        case FETCH_SUBCATEGORY:
            return {
                ...state,
                category: action.data
            }
        case FETCH_SUB_CATEGORIES:
            return {
                ...state,
                subcategories: action.data
            }

        default:
            return state;
    }
}