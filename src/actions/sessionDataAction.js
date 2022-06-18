import api from '../api';
import { FETCH_SESSION_DATA, ALERT_DETAIL } from "./actionTypes";
import { fetchProgramsByCientID } from './programAction'
import { fetchSubCategories } from './subCategoryAction'

export function fetchSessionData() {
    return function (dispatch) {
        api.get('session-data').then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_SESSION_DATA,
                    data: response.payload
                });
            }
        });
    }
}

export function addSessionData(self, sessionDataObj) {
    return dispatch => {
        api.post('session-data', sessionDataObj).then((response) => {
            if (response.status === "success") {
                dispatch({ type: ALERT_DETAIL, data: true, message: " Session Data added successfully", severity: "success" })
                dispatch(fetchProgramsByCientID(sessionDataObj.client_id))
                dispatch(fetchSubCategories())
                dispatch(fetchSessionData())
                self.setState({
                    sessionDataDialogOpen: false,
                    id: null,
                    date: null,
                    session_start_time: null,
                    session_end_time: null,
                    read_note: false,
                    prompt_strength: "",
                    prompt_strength_score: "",
                    client_id: null,
                    program_id: null,
                    category_id: null,
                    subCategory_id: null,
                    is_correct_answer: "",
                    trials: [],
                    errorObjs: [],
                    trialId: 1,
                })
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }

        })
    }
}

export function updateSessionData(self, item, id, trails) {

    return dispatch => {
        api.put('session-data/' + id, item).then((response) => {
            if (response.status === "success") {
                dispatch({ type: ALERT_DETAIL, data: true, message: " Session Data updated successfully", severity: "success" })
                dispatch(fetchSessionData());
                dispatch(fetchSubCategories())
                dispatch(fetchSessionData())
                self.setState({
                    sessionDataDialogOpen: false,
                    id: null,
                    date: null,
                    session_start_time: null,
                    session_end_time: null,
                    read_note: false,
                    prompt_strength: "",
                    prompt_strength_score: "",
                    client_id: null,
                    program_id: null,
                    category_id: null,
                    subCategory_id: null,
                    is_correct_answer: "",
                    // trials: [],
                    // errorObjs: [],
                    // trialId: 1,
                })
            }

            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }
        })
    }
}