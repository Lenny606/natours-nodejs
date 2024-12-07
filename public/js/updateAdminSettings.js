import axios from "axios";
import {showAlert} from "./alerts.js";
import {catchAsync} from "../../utils/catchAsync.js";

export const updateAdminSettings = catchAsync(async (data, type) => {
    try {
        const endpoint = type === "password"
            ? "updateMyPassword"
            : "updateMe"
        const res = await axios({
            method: 'PATCH',
            url: 'http://localhost:8001/api/v1/users/' + endpoint,
            data
        })
        if (res.data.status === 'success') {
            showAlert('success', type.toUpperCase() + " saved successful")
        }
    } catch (error) {
        console.error(error)
        showAlert("error", error.response.data.message)
    }
})