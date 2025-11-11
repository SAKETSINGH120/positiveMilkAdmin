import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

export const getShop = async () => {
    try {
        const response = await axiosInstance.get(`/api/admin/shop/list`);
        return response.data.data;
    } catch {
        message.error('Error fetching shop list');
    }
}

export const getShopDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/shop/details/${id}`);
        return response.data;
    } catch {
        message.error('Error fetching shop list');
    }
}

export const deleteShop = async (shopId) => {
    // console.log(shopId)
    try {
        const response = await axiosInstance.delete(`/api/admin/shop/delete/${shopId}`);
        return response.data.data;
    } catch {
        message.error('Error deleting shop');
    }
}

//-----------------------------------------------------------
// Top Shop
//-----------------------------------------------------------

export const getShopViaCategory = async (categoryId) => {
    const response = await axiosInstance.get(`/api/admin/shop/listviacategory/${categoryId}`);
    return response.data.data;
}

export const getTopShop = async (categoryId) => {
    const response = await axiosInstance.get(`/api/admin/topshop/${categoryId}`);
    return response.data.data;
}

export const addTopShop = async (data) => {
    const response = await axiosInstance.post(`/api/admin/topshop`, data);
    return response.data.data;
}

export const updateTopShop = async (data) => {
    const response = await axiosInstance.patch(`/api/admin/topshop`, data);
    return response.data.data;
}

export const deleteTopShop = async (data) => {
    console.log(data)
    const response = await axiosInstance.post(`/api/admin/topshop/delete`, data);
    return response.data.data;
}

export const updateShop = async (data) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/shop/update/${data.shopId}`, data);
        return response.data.data;
    } catch {
        message.error('Error updating shop');
    }
}