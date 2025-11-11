import { message } from "antd";
import axiosInstance from "@utils/axiosInstance"

export const getAllVendor = async (type = 'all') => {
    try {
        const response = await axiosInstance.get(`/api/admin/vendor/list?type=${type}`);
        // console.log(response.data.data.vendors)
        return response.data.data;
    } catch {
        message.error('Error fetching vendor list');
    }
}

export const getVendorDetails = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/vendor/${id}`);
        // console.log(response.data);
        return response.data.data
    } catch {
        message.error('Error fetching vendor details');
    }
}

export const getVendorProduct = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/vendor/${id}/product`);
        return response.data.data;
    } catch {
        message.error('Error fetching vendor product');
    }
}

export const getVendorShop = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/admin/vendor/shop/list/${id}`);
        return response.data.data;
    } catch {
        message.error('Error fetching vendor shops');
    }
}

export const vendorBlock = async (id, status) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/vendor/block/${id}`, { status });
        message.success('vendor status update');
        return response;
    } catch {
        message.error('vendor status not update');
    }
}

export const vendorApprove = async (id, status, commission, payoutType = 'weekly') => {
    try {
        const response = await axiosInstance.patch(`/api/admin/vendor/approve/${id}`, { 
            status, 
            commission, 
            payoutType 
        });
        message.success('vendor status update');
        return response;
    } catch {
        message.error('vendor status not update');
    }
}

export const vendorUpdate = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/api/admin/vendor/${id}`, data);
        return response.data.data;
    } catch {
        message.error('Error updating vendor');
        throw new Error('Failed to update vendor');
    }
}

export const deleteVendor = async (vendorId) => {
    // console.log(vendorId)
    try {
        const response = await axiosInstance.delete(`/api/admin/vendor/delete/${vendorId}`);
        return response.data.data;
    } catch {
        message.error('Error deleting vendor');
    }
}