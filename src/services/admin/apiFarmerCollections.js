import axiosInstance from "../../utils/axiosInstance";

// Get all farmer collections with pagination
export const getAllFarmerCollections = async (page = 1, limit = 20) => {
  const response = await axiosInstance.get(
    `/api/admin/farmer-collections?page=${page}&limit=${limit}`
  );
  return response.data;
};
