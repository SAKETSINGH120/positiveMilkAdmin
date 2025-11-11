import axiosInstance from "../../utils/axiosInstance";

// Get all farmers with pagination
export const getAllFarmers = async (page = 1, limit = 20) => {
  const response = await axiosInstance.get(
    `/api/admin/farmers?page=${page}&limit=${limit}`
  );
  return response.data;
};
