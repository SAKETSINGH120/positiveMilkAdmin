import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getWallet = async () => {
    try {
        const response = await axiosInstance.get("/api/vendor/wallet");
        return response.data;
    } catch (error) {
        // console.log(error.message)
        message.error('Something went wrong');
    }
}

export const getshopsWallet = async () => {
    try {
        const response = await axiosInstance.get("/api/vendor/shops/wallets");
        return response.data;
    } catch (error) {
        // console.log(error.message)
        message.error('Something went wrong');
    }
}

export const getWalletRequest = async () => {
    try {
        const response = await axiosInstance.get("/api/vendor/wallet/request");
        return response.data;
    } catch (error) {
        // console.log(error.message)
        message.error('Something went wrong');
    }
}

export const createWithdrawRequest = async (data) => {
    try {
        const response = await axiosInstance.post("/api/vendor/wallet/request", data);
        return response.data;
    } catch (error) {
        // console.log(error.message)
        message.error('Something went wrong');
    }
}

export const getWalletHistory = async () => {
    try {
        const response = await axiosInstance.get("/api/vendor/wallet/history");
        return response.data;
    } catch (error) {
        // console.log(error.message)
        message.error('Something went wrong');
    }
}

export const getShopWalletHistory = async (shopId) => {
    try {
        const response = await axiosInstance.get(`/api/vendor/shop/${shopId}/wallet/history`);
        return response.data;
    } catch (error) {
        // console.log(error.message)
        message.error('Something went wrong');
    }
}