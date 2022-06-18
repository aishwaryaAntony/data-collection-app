import api from '../api';
import { FETCH_PROGRAMS, FETCH_PROGRAMS_BY_CLIENT, ALERT_DETAIL } from "./actionTypes"


export function fetchPrograms() {
    return function (dispatch) {
        api.get('program').then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_PROGRAMS,
                    data: response.payload
                });
            }
        });
    }
}

export function fetchProgramsByCientID(client_id, self) {
    return function (dispatch) {
        api.get(`assigned-programs/client-details/${client_id}`).then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_PROGRAMS_BY_CLIENT,
                    data: response.payload
                });
            }
        });
    }
}
export function addPrograms(self, item) {
    return dispatch => {
        api.post('program', item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchPrograms())
                dispatch({ type: ALERT_DETAIL, data: true, message: "Program added successfully", severity: "success" })
                self.setState({
                    dialogOpen: false,
                    id: null,
                    name: "",
                    name_error: false,
                    code: "",
                    code_error: false,
                    note: ""
                    // mode: ""
                })
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }

        })
    }
}

export function updateProgram(self, item, id) {
    return dispatch => {
        api.put('program/' + id, item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchPrograms());
                dispatch({ type: ALERT_DETAIL, data: true, message: "Program updated successfully", severity: "success" })
                self.setState({
                    dialogOpen: false,
                    id: null,
                    name: "",
                    name_error: false,
                    code: "",
                    code_error: false,
                    note: ""
                    //mode: ""
                })
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }

        })
    }
}