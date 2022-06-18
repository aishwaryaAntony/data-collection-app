import api from '../api';
import { FETCH_CATEGORIES_BY_ID, ALERT_DETAIL, FETCH_SUB_CATEGORIES } from "./actionTypes"


export function fetchCategoryById(id) {
    return function (dispatch) {
        api.get('category/' + id).then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_CATEGORIES_BY_ID,
                    data: response.payload
                });
            }
        });
    }
}

export function fetchSubCategories() {
    return function (dispatch) {
        api.get('sub-category/').then((response) => {
            if (response.status === "success") {
                dispatch({
                    type: FETCH_SUB_CATEGORIES,
                    data: response.payload
                });
            }
        });
    }
}


export function addSubCategory(self, item) {
    return dispatch => {
        api.post('sub-category', item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchCategoryById(item.category_id))
                dispatch({ type: ALERT_DETAIL, data: true, message: "Subcategory added successfully", severity: "success" })
                self.setState({
                    dialogOpen: false,
                    id: null,
                    name: "",
                    name_error: false,
                    code: "",
                    code_error: false,
                    note: "",
                    note_error: false,
                    // mode: ""
                })
            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }

        })
    }

}

export function updateSubCategory(self, item, id) {
    return dispatch => {
        api.put('sub-category/' + id, item).then((response) => {
            if (response.status === "success") {
                dispatch(fetchCategoryById(item.category_id))
                dispatch({ type: ALERT_DETAIL, data: true, message: "Subcategory updated successfully", severity: "success" })
                self.setState({
                    dialogOpen: false,
                    id: null,
                    name: "",
                    name_error: false,
                    code: "",
                    code_error: false,
                    note: "",
                    note_error: false,
                    //  mode: ""
                })

            }
            else {
                dispatch({ type: ALERT_DETAIL, data: true, message: response.message, severity: "error" })
            }

        })
    }

}