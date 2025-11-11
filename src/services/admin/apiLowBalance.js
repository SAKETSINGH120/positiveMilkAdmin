import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getLoweBalanceUserList = async () => {
  try {
    const response = await axiosInstance.get("/api/admin/lowBalanceUser");
    // console.log(response.data.data)
    return response.data;
  } catch (error) {
    // console.log(error)
    message.error("Error fetching user balance list");
  }
};
