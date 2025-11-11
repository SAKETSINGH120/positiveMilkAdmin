import { message } from "antd";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const registerVendor = async (formData) => {
    const response = await axios.post(`${BASE_URL}/api/vendor/register`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        }
    })
    return response.data;
}

export const getVendorProfile = async () => {
    try {
        const res = await axiosInstance.get("/api/vendor/getProfile");
        // console.log(res)
        return res.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}

export const updateProfileInfo = async (data) => {
    try {
        const res = await axiosInstance.patch("/api/vendor/update/profile", data);
        return res.data;
    } catch (error) {
        // console.log(error.message)
        message.error("Something went wrong")
    }
}

export const updateAccountInfo = async (formData) => {
    // console.log(formData)
    try {
        const res = await axiosInstance.patch("/api/vendor/update/account", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    } catch (error) {
        // console.log(error.message)
        message.error("Something went wrong")
    }
}

export const updateDocumentInfo = async (formData) => {
    // console.log(formData)
    try {
        const res = await axiosInstance.patch("/api/vendor/update/document", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        });
        return res.data;
    } catch (error) {
        // console.log(error.message)
        message.error("Something went wrong")
    }
}

export const verifyVendor = async (userId) => {
    const res = await axiosInstance.post(`/api/vendor/find-vendor`, { userId });
    return res.data
}

export const changeVendorPassword = async (oldPassword, newPassword) => {
    const res = await axiosInstance.post(`/api/vendor/changePassword`, { oldPassword, newPassword });
    return res.data
}

export const resetVendorPassword = async (userId, password) => {
    const res = await axiosInstance.post(`/api/vendor/forgetPassword`, { userId, password });
    return res.data
}



