import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance"

export const getTermAndServices = async () => {
    try {
        const response = await axiosInstance.get("/api/vendor/term-and-condition");
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}

export const getFee = async () => {
    try {
        const response = await axiosInstance.get("/api/vendor/fee");
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}