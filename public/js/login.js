import axios from "axios";
import {showAlert} from "./alerts.js";
import {getBaseUrl} from "../../utils/functions.js";

export const login = async (email, password) => {
    try {
        const res = await axios({
            method: 'POST',
            url: getBaseUrl() + '/api/v1/users/login',
            data: {
                email,
                password
            }
        })
        if (res.data.status === 'success') {
            showAlert('success', "Login successful")
            window.setTimeout(() => {
                location.assign("/")
            },1500)
        }
    } catch (error) {
        console.error(error)
        showAlert("error", error.response.data.message)
    }
}