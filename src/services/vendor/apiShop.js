import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance"

export const addShop = async (formData) => {
    const response = await axiosInstance.post("/api/vendor/shop/create", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data
}

export const getAllShop = async () => {
    const response = await axiosInstance.get("/api/vendor/shop/list");
    return response.data.data;
}

export const updateShop = async (id, formData) => {
    const response = await axiosInstance.patch(`/api/vendor/shop/update/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
    return response.data.data;
}

export const shopClose = async (id, status) => {
    try {
        const response = await axiosInstance.post(`/api/vendor/shop/close/${id}`, { isClose: status });
        message.success('Shop status change');
        return response;
    } catch (error) {
        // console.log(error)
        message.error('Something went wrong');
    }
}

export const shopStatus = async (id, status) => {
    var status = status ? 'active' : 'inactive';
    try {
        const response = await axiosInstance.post(`/api/vendor/shop/status/${id}`, { status: status });
        message.success('Shop status change');
        return response;
    } catch (error) {
        message.error('Something went wrong');
    }
}

export const shopNightCafe = async (id, status) => {
    // var status = status ? 'active' : 'inactive';
    try {
        const response = await axiosInstance.post(`/api/vendor/shop/nightCafe/${id}`, { status });
        message.success('Shop status change');
        return response;
    } catch (error) {
        message.error('Something went wrong');
    }
}