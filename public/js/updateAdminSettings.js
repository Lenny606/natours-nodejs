import axios from "axios";
import {showAlert} from "./alerts.js";

export const updateData = async (name, email) => {
    try {
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:8001/api/v1/users/updateMe',
            data: {
                name,
                email
            }
        })
        if (res.data.status === 'success') {
            showAlert('success', "Setting saved successful")
        }
    } catch (error) {
        console.error(error)
        showAlert("error", error.response.data.message)
    }
}