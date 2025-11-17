import { message } from "antd";
import axiosInstance from "@utils/axiosInstance";

export const getReportsList = async (type) => {
  try {
    const response = await axiosInstance.get(`/api/admin/report?type=${type}`);
    // console.log(response.data.data)
    return response.data;
  } catch (error) {
    // console.log(error)
    message.error("Error fetching report list");
  }
};

export const downloadReportsViaType = async (type) => {
  try {
    const response = await axiosInstance.get(
      `/api/admin/reportDownload?type=${type}`,
      {
        responseType: "blob", // Important for Excel file downloads
      }
    );
    return response.data;
  } catch (error) {
    console.error("Download error:", error);
    message.error("Error while downloading report");
    throw error;
  }
};
