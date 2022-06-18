import {FETCH_PROGRAMS,FETCH_VIEWPROGRAM, FETCH_PROGRAMS_BY_CLIENT} from "../actions/actionTypes"


const initialstate = {
    programs:null,
    program: null,
    client_programs:null
}

export default function programReducer(state = initialstate, action) {
    switch (action.type) {
        case FETCH_PROGRAMS:
            return {
                ...state,
                programs: action.data
            }
            case FETCH_VIEWPROGRAM:
                return {
                    ...state,
                    program: action.data
                }
                case FETCH_PROGRAMS_BY_CLIENT:
                    return {
                        ...state,
                        client_programs: action.data
                    }
        default:
            return state;
    }
}

