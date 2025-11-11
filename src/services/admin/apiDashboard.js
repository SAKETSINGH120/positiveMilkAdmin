import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getDashboard = async () => {
    try {
        const response = await axiosInstance.get(`/api/admin/dashboard`);
        return response.data.data;
    } catch (error) {
        message.error('Error fetching dashboard data');
    }
}

export const getSalesChart = async (range) => {
    try {
        const response = await axiosInstance.get(`/api/admin/dashboard/sales-chart?range=${range}`);
        return response.data;
    } catch (error) {
        message.error('Error fetching sales chart data');
        throw error;
    }
}

export const getEarningsChart = async (range) => {
    try {
        const response = await axiosInstance.get(`/api/admin/dashboard/earnings-chart?range=${range}`);
        return response.data;
    } catch (error) {
        message.error('Error fetching earnings chart data');
        throw error;
    }
}

export const getAverageOrderChart = async (duration) => {
    try {
        const response = await axiosInstance.get(`/api/admin/dashboard/average-order-chart?duration=${duration}`);
        return response.data;
    } catch (error) {
        message.error('Error fetching average order chart data');
        throw error;
    }
}