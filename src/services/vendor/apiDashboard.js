import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance"

export const getCounts = async () => {
    try {
        const response = await axiosInstance.get("/api/vendor/dashboard/counts");
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}

export const getSaleChart = async (range) => { // range 7 or 30
    try {
        const response = await axiosInstance.get(`/api/vendor/dashboard/sales?range=${range}`);
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}

export const getOrdersChart = async (range) => { // range 7 or 30
    try {
        const response = await axiosInstance.get(`/api/vendor/dashboard/orders?range=${range}`);
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}

export const getEarningsChart = async (range) => { // range 7 or 30
    try {
        const response = await axiosInstance.get(`/api/vendor/dashboard/earnings?range=${range}`);
        return response.data;
    } catch (error) {
        message.error("Something went wrong")
    }
}
