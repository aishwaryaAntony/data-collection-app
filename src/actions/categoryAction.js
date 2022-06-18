import api from '../api';
import { FETCH_VIEWPROGRAM, FETCH_CATEGORIES, ALERT_DETAIL } from "./actionTypes"


export function fetchProgramsById(id) {
    return function (dispatch) {
        api.get('program/' + id).then((response) => {
            //console.log("=======FETCH_VIEWPROGRAM========="+JSON.stringify(response))
            if (response.status === "success") {
                dispatch({
                    type: FETCH_VIEWPROGRAM,
                    data: response.payload
                });
            }
        });
    }
}

export function fetchCategories() {
    return function (dispatch) {
        api.get('category/').then((response) => {
            //console.log("=======FETCH_VIEWPROGRAM========="+JSON.stringify(response))
            if (response.status === "success") {
                dispatch({
                    type: FETCH_CATEGORIES,
                    data: response.payload
                });
            }
        });
    }
}


export function addCategory(self, item) {
    return dispatch => {
        api.post('category', item).then((response) => {
            //console.log("*******RES***********"+JSON.stringify(response))
            if (response.status === "success") {
                dispatch(fetchProgramsById(item.program_id))
                dispatch({ type: ALERT_DETAIL, data: true, message: "Category added successfully", severity: "success" })
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

export function updateCategory(self, item, id) {
    return dispatch => {
        api.put('category/' + id, item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchProgramsById(item.program_id))
                dispatch({ type: ALERT_DETAIL, data: true, message: "Category updated successfully", severity: "success" })
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