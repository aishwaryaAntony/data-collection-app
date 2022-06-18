import api from '../api';
import { FETCH_CLIENTS, ALERT_DETAIL } from "./actionTypes"
import { fetchProgramsByCientID } from './programAction'
import { fetchStaffsByCientID, fetchSchedulesByCientID } from './userAction'

export function fetchClients() {
    return function (dispatch) {
        api.get('user').then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_CLIENTS,
                    data: response.payload
                });
            }
        });
    }
}

export function addClients(self, item) {
    return dispatch => {
        api.post('user/register', item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchClients())
                dispatch({ type: ALERT_DETAIL, data: true, message: "user added successfully", severity: "success" })
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

export function updateClient(self, item, id) {
    return dispatch => {
        api.put('user/user-profile/' + id, item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchClients())
                dispatch({ type: ALERT_DETAIL, data: true, message: "client updated successfully", severity: "success" })
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

export function assignProgram(self, item) {
    return dispatch => {
        api.post('assigned-programs', item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchProgramsByCientID(item.client_id, self))

                dispatch({ type: ALERT_DETAIL, data: true, message: " Program assigned successfully", severity: "success" })
                self.setState({
                    dialogOpen: false,
                    program_id: null,
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

export function assignStaffForClient(self, item) {
    return dispatch => {
        api.post('assigned-staff', item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchStaffsByCientID(item.client_id, self))
                dispatch({ type: ALERT_DETAIL, data: true, message: " Staff assigned successfully", severity: "success" })
                self.setState({
                    dialogOpenForStaff: false,
                    date: null,
                    //client_id: null,
                    staff_id: null,
                    staff_role_type: null,
                    assigned_by_id: null,
                    status: "ACTIVE",
                    //mode: ""
                })
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }

        })
    }
}
export function assignScheduleForClient(self, item) {
    return dispatch => {
        api.post('schedule', item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchSchedulesByCientID(item.client_id, self))
                dispatch({ type: ALERT_DETAIL, data: true, message: "Scheduled Successfully", severity: "success" })
                self.setState({
                    dialogOpenForSchedule: false,
                    date: null,
                    //client_id: null,
                    rbt_id: null,
                    assigned_by_id: null,
                    session_start_time: null,
                    session_end_time: null,
                    status: "ACTIVE",
                    date_error: false,
                    rbt_id_error: false,
                    session_start_time_error: false,
                    session_end_time_error: false
                    //mode: ""
                })
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }

        })
    }
}

export function reScheduleForClient(self, item) {
    return dispatch => {
        api.put('schedule/' + self.state.schedule_id, item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchSchedulesByCientID(item.client_id, self))
                dispatch({ type: ALERT_DETAIL, data: true, message: "ReScheduled Successfully", severity: "success" })
                self.setState({
                    dialogOpenForSchedule: false,
                    date: null,
                    //client_id: null,
                    rbt_id: null,
                    assigned_by_id: null,
                    session_start_time: null,
                    session_end_time: null,
                    status: "ACTIVE",
                    date_error: false,
                    rbt_id_error: false,
                    session_start_time_error: false,
                    session_end_time_error: false
                    //mode: ""
                })
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }
        })
    }
}