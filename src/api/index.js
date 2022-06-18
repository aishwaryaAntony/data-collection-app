import { END_POINT } from "../helpers/Constants";

function parseResponse(response) {
    return response.json().then((json) => {
        if (!response.ok) {
            return Promise.reject(json);
        }
        return json;
    });
}

const api = {
    //get url access
    async get(url) {
        const token = JSON.parse(window.localStorage.getItem('token'));
        const bearer = 'Bearer ' + token;
        return fetch(`${END_POINT}${url}`, {
            method: 'GET',
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": bearer
            }),
        })
            .then(parseResponse);


    },

    //post url access
    async post(url, data) {
        const body = JSON.stringify(data);
        const token = JSON.parse(window.localStorage.getItem('token'));
        const bearer = 'Bearer ' + token;
        return fetch(`${END_POINT}${url}`, {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": bearer
            }),
            body,
        })
            .then(parseResponse)
    },

    //put url access
    async put(url, data) {
        const body = JSON.stringify(data);
        const token = JSON.parse(window.localStorage.getItem('token'));
        const bearer = 'Bearer ' + token;
        return fetch(`${END_POINT}${url}`, {
            method: 'PUT',
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": bearer
            }),
            body,
        })
            .then(parseResponse)
    },

    //delete url access
    async delete(url) {
        const token = JSON.parse(window.localStorage.getItem('token'));
        const bearer = 'Bearer ' + token;
        return fetch(`${END_POINT}${url}`, {
            method: 'DELETE',
            headers: new Headers({
                "Content-Type": "application/json",
                "Authorization": bearer
            }),
        })
            .then(parseResponse);
    },



}
export default api;