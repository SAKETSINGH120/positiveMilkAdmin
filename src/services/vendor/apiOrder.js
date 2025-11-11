import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getAllOrder = async (type) => {
    try {
        const response = await axiosInstance.get(`/api/vendor/order/list?type=${type}`);
        // console.log(response)
        return response.data;
    } catch (error) {
        // console.log(error)
        message.error('Error fetching order');
    }
}

export const getOrderDetails = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/api/vendor/order/details/${orderId}`);
        // console.log(response)
        return response.data;
    } catch (error) {
        // console.log(error)
        message.error('Error fetching order');
    }
}

export const getInvoice = async (orderId) => {
    try {
        const response = await axiosInstance.get(`/api/vendor/invoice/${orderId}`);
        // console.log(response)
        return response.data;
    } catch (error) {
        // console.log(error)
        message.error('Error fetching order');
    }
}

export const changeOrderStatus = async (id, data) => {
    try {
        const response = await axiosInstance.post(`/api/vendor/order/status/${id}`, data);
        // console.log(response.data)
        return response.data;
    } catch (error) {
        // console.log(error)
        message.error('Error fetching order');
    }
}