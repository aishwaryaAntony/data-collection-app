import api from '../api';
import { FETCH_RBTS, ALERT_DETAIL } from "./actionTypes"

export function fetchRbts() {
    return function (dispatch) {
        api.get('user').then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_RBTS,
                    data: response.payload
                });
            }
        });
    }
}

export function addRbts(self, item) {
    return dispatch => {
        api.post('user/register', item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchRbts())
                dispatch({ type: ALERT_DETAIL, data: true, message: "RBT User added successfully", severity: "success" })
                self.setState({
                    dialogOpen: false,
                    id: null,
                    first_name: "",
                    first_name_error: false,
                    last_name: "",
                    last_name_error: false,
                    user_name: "",
                    user_name_error: false,
                    password: "",
                    password_error: false,
                    confirm_password: "",
                    confirm_password_error: false,
                    //mode: ""
                })
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }

        })
    }
}

export function updateRbts(self, item, id) {
    return dispatch => {
        api.put('user/user-profile/' + id, item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchRbts())
                dispatch({ type: ALERT_DETAIL, data: true, message: "RBT User updated successfully", severity: "success" })
                self.setState({
                    dialogOpen: false,
                    id: null,
                    first_name: "",
                    first_name_error: false,
                    last_name: "",
                    last_name_error: false,
                    user_name: "",
                    user_name_error: false,
                    password: "",
                    password_error: false,
                    confirm_password: "",
                    confirm_password_error: false,
                    // mode: ""
                })
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }
        })
    }
}