import { message } from 'antd';
import axiosInstance from "@utils/axiosInstance";

export const getAllCollections = async () => {
    try {
        const response = await axiosInstance.get('/api/admin/driver-collection/list');
        return response.data;
    } catch (error) {
        message.error('Error fetching collection list');
        throw error;
    }
}

export const addCollection = async (data) => {
    try {
        const response = await axiosInstance.post('/api/admin/driver-collection/create', data);
        return response.data;
    } catch (error) {
        message.error(error.response?.data?.message || 'Error adding collection');
        throw error;
    }
}

export const updateCollection = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/driver-collection/update/${id}`, data);
        return response.data;
    } catch (error) {
        message.error('Error updating collection');
        throw error;
    }
}

export const deleteCollection = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/admin/driver-collection/delete/${id}`);
        message.success('Collection deleted successfully');
        return response.data;
    } catch (error) {
        message.error('Error deleting collection');
        throw error;
    }
}
