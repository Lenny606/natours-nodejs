//login has http cookie, not possible to manipulate in the browser => needs new route
import axios from "axios";
import {showAlert} from "./alerts.js";
import {getBaseUrl} from "../../utils/functions.js";

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: getBaseUrl() + '/api/v1/users/logout'
        })
        if (res.data.status === 'success') {
            showAlert('success', res.data.message);
            window.setTimeout(() => {
                location.reload() //loads from server , not cached
            },1500)
        }
    } catch (error) {
        console.error(error)
        showAlert("error", error.response.data.message)
    }
}