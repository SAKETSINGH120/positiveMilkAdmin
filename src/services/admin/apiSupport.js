import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getAllSupportQuery = async () => {
  try {
    const response = await axiosInstance.get("/api/admin/supportQuery");
    // console.log(response.data.data)
    return response.data;
  } catch (error) {
    // console.log(error)
    message.error("Error fetching Support list");
  }
};
