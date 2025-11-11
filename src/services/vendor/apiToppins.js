import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getAllToppins = async (productId) => {
    try {
        const response = await axiosInstance.get(`/api/vendor/toppins/${productId}`)
        // console.log(response.data.data)
        return response.data.data;
    } catch (error) {
        console.log(error)
        message.error('Error fetching category list');
    }
}
export const addToppins = async (data) => {
  console.log(data)
  try {
    const response = await axiosInstance.post(`/api/vendor/toppins/${data.productId}`, data);
    return response;
  } catch (error) {
    const errorMsg = error?.response?.data?.message || 'Error adding coupon';
    message.error(errorMsg);
    throw error;
  }
};
// ✅ FIXED VERSION
export const updateToppins = async (id, data) => {
  try {
    const response = await axiosInstance.patch(`/api/vendor/toppins/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update coupon";
  }
};

export const deleteToppins = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/vendor/toppins/${id}`);
        return response;
    } catch (error) {
        message.error('Error deleteing category');
    }
}
