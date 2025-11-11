import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getWalletRequest = async (type) => {
    try {
        const response = await axiosInstance.get(`/api/admin/wallet/request?type=${type}`);
        return response.data;
    } catch (error) {
        console.log(error.message)
        message.error('Something went wrong');
    }
}

export const changeWalletRequestStatus = async (data) => {
    const id = data.record._id;
    const status = data.status;
    try {
        const response = await axiosInstance.post(`/api/admin/wallet/request/status/${id}`, { status });
        return response.data;
    } catch (error) {
        console.log(error.message)
        message.error('Something went wrong');
    }
}

export const settleWalletRequest = async (record, type) => {
    const id = record._id;
    const amount = record.amount_requested;
    try {
        const response = await axiosInstance.post(`/api/admin/wallet/request/settle/${id}`, { amount, type });
        return response.data;
    } catch (error) {
        console.log(error.message)
        message.error('Something went wrong');
    }
}

export const settleVendorWallet = async (data, id) => {
    try {
        const response = await axiosInstance.post(`/api/admin/vendor/${id}/wallet/settle`, data);
        return response.data;
    } catch (error) {
        console.log(error.message)
    }
}

export const settleDriverWallet = async (data, id) => {
    try {
        const response = await axiosInstance.post(`/api/admin/driver/${id}/wallet/settle`, data);
        return response.data;
    } catch (error) {
        console.log(error.message)
    }
}

export const getVendorSettlementHistory = async (vendorId) => {
    try {
        const response = await axiosInstance.get(`/api/admin/vendor/${vendorId}/settlement/history`);
        return response.data.data;
    } catch (error) {
        console.log(error.message)
        message.error('Failed to fetch settlement history');
        throw error;
    }
}


export const getDriverSettlementHistory = async (driverId) => {
    try {
        const response = await axiosInstance.get(`/api/admin/driver/${driverId}/settlement/history`);
        return response.data.data;
    } catch (error) {
        console.log(error.message)
        message.error('Failed to fetch settlement history');
        throw error;
    }
}