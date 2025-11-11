import { message } from "antd";
import axiosInstance from "@utils/axiosInstance"

export const getAllBrand = async () => {
    try {
        const response = await axiosInstance("/api/admin/brand/list");
        return response.data.data
    } catch (error) {
        message.error('Error fetching brand list');
    }
}