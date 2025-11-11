import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getAllCategory = async () => {
    try {
        const response = await axiosInstance.get('/api/vendor/category/list')
        // console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        // console.log(error)
        message.error('Error fetching category list');
    }
}

export const getAllSubCategory = async () => {
    try {
        const response = await axiosInstance.get('/api/vendor/subcategory/list')
        // console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        message.error('Error fetching subcategory list');
    }
}

export const getSubCategory = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/vendor/subcategory/${id}`);
        return response.data.data;
    } catch (error) {
        message.error('Error fetching subcategory');
    }
}

