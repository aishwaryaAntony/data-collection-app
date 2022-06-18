import api from '../api';
import { LOGIN_SUCCESS, LOGOUT, FETCH_USERS, FETCH_CLIENT_STAFF, FETCH_SCHEDULES_BY_CLIENT, FETCH_All_ASSIGNED_STAFF, FETCH_SCHEDULES_BY_RBT, ALERT_DETAIL } from "../../src/actions/actionTypes"

export function fetchUsers() {
    return function (dispatch) {
        api.get('user').then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_USERS,
                    data: response.payload
                });
            }
        });
    }
}

export function postLogin(self) {
    let item = {}
    item.user_name = self.state.user_name;
    item.password = self.state.password;
    return dispatch => {
        api.post('user/login', item).then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: LOGIN_SUCCESS,
                    data: response.payload
                })
                localStorage.setItem('token', JSON.stringify(response.token));
                localStorage.setItem('user', JSON.stringify(response.payload));
                switch (response.payload.user_type) {
                    case "ADM":
                        self.props.history.push("/clients");
                        break;
                    case "CMR":
                        self.props.history.push("/caseManager/clients");
                        break;
                    case "RBT":
                        self.props.history.push("rbts/clients");
                        break;
                    case "CLT":
                        self.props.history.push("/clientDashBoard");
                        break;
                    default:
                        self.props.history.push("/");
                        break;
                }
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: "Invalid UserName or Password", severity: "error" })
            }


        })
    }
}

export function fetchStaffsByCientID(client_id, self) {
    return function (dispatch) {
        api.get(`assigned-staff/client-details/${client_id}`).then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_CLIENT_STAFF,
                    data: response.payload
                });
            }
            else {
                alert("failed")
            }
        });
    }
}

export function fetchSchedulesByCientID(client_id, self) {
    return function (dispatch) {
        api.get(`schedule/client-details/${client_id}`).then((response) => {

            if (response.status === "success") {
                dispatch({
                    type: FETCH_SCHEDULES_BY_CLIENT,
                    data: response.payload
                });
            }
            else {
                alert("failed")
            }
        });
    }
}

export function fetchSchedulesByRbtID(rbt_id, self) {
    return function (dispatch) {
        api.get(`schedule/client-info/${rbt_id}`).then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_SCHEDULES_BY_RBT,
                    data: response.payload
                });
            }
            else {
                alert("failed")
            }
        });
    }
}


export function fetchAllAssignedStaffs() {
    return function (dispatch) {
        api.get('assigned-staff').then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_All_ASSIGNED_STAFF,
                    data: response.payload
                });
            }
        });
    }
}

export function logout(self) {
    return (dispatch) => {
        dispatch({
            type: LOGOUT
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location = "/";
    }
}