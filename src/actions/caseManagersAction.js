import api from '../api';
import { FETCH_CASEMANAGERS, ALERT_DETAIL } from "./actionTypes"

export function fetchCasemanager() {
    return function (dispatch) {
        api.get('user').then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_CASEMANAGERS,
                    data: response.payload
                });
            }
        });
    }
}

export function addCaseManager(self, item) {
    return dispatch => {
        api.post('user/register', item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchCasemanager())
                dispatch({ type: ALERT_DETAIL, data: true, message: "CaseManager added successfully", severity: "success" })
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

export function updateCaseManager(self, item, id) {
    return dispatch => {
        api.put('user/user-profile/' + id, item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchCasemanager())
                dispatch({ type: ALERT_DETAIL, data: true, message: "CaseManager updated successfully", severity: "success" })
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