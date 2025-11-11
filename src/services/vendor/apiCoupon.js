import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getAllCoupon = async () => {
  try {
    const response = await axiosInstance.get('/api/vendor/coupon')
    // console.log(response.data.data)
    return response.data.data;
  } catch (error) {
    // console.log(error)
    message.error('Error fetching coupon list');
  }
}

export const addCoupon = async (data) => {
  try {
    const response = await axiosInstance.post('/api/vendor/coupon', data);
    return response;
  } catch (error) {
    const errorMsg = error?.response?.data?.message || 'Error adding coupon';
    message.error(errorMsg);
    throw error;
  }
};

export const updateCoupon = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/api/vendor/coupon/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update coupon";
  }
};

export const updateStatus = async (id, status) => {
  status = status ? "active" : "inactive"
  try {
    const response = await axiosInstance.patch(`/api/vendor/coupon/${id}`, { status });
    message.success('coupon status update');
    return response;
  } catch (error) {
    message.error('Error updating coupon status');
  }
}

export const deleteCoupon = async (id) => {
  try {
    const response = await axiosInstance.delete(`/api/vendor/coupon/${id}`);
    return response;
  } catch (error) {
    message.error('Error deleteing coupon');
  }
}
