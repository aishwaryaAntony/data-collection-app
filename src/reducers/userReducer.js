import { LOGIN_SUCCESS, FETCH_USERS, FETCH_CLIENT_STAFF, FETCH_SCHEDULES_BY_CLIENT, FETCH_All_ASSIGNED_STAFF, ALERT_DETAIL,FETCH_SCHEDULES_BY_RBT } from "../actions/actionTypes"

const initialstate = {
    user: {},
    users: null,
    client_staff: null,
    client_schedules: null,
    assigned_all_staffs: null,
    openAlert: false,
    alertSeverity: null,
    alertMessage: null,
    rbt_schedules:null
}

export default function userReducer(state = initialstate, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                user: action.data
            }
        case FETCH_USERS:
            return {
                ...state,
                users: action.data
            }
        case FETCH_CLIENT_STAFF:
            return {
                ...state,
                client_staff: action.data
            }
        case FETCH_SCHEDULES_BY_CLIENT:
            return {
                ...state,
                client_schedules: action.data
            }
            case FETCH_SCHEDULES_BY_RBT:
                return {
                    ...state,
                    rbt_schedules: action.data
                }
        case FETCH_All_ASSIGNED_STAFF:
            return {
                ...state,
                assigned_all_staffs: action.data
            }

        case ALERT_DETAIL:
            return {
                ...state,
                openAlert: action.data,
                alertSeverity: action.severity,
                alertMessage: action.message,
            }


        default:
            return state;
    }
}