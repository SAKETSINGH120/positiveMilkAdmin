import axiosInstance from "@utils/axiosInstance";

export const getAllUser = async (type) => {
  const response = await axiosInstance.get(`/api/admin/user/list?type=${type}`);
  return response.data;
};

export const getUserDetailed = async (userId) => {
  const response = await axiosInstance.get(`/api/admin/user/${userId}`);
  return response.data;
};

export const blockUser = async (userId) => {
  const response = await axiosInstance.patch(`/api/admin/user/${userId}/block`);
  return response.data;
};

export const getUserGocoinHistory = async (userId) => {
  const response = await axiosInstance.get(
    `/api/admin/user/${userId}/settlement/history`,
  );
  return response.data;
};

export const updateUserWallet = async (userId, data) => {
  const response = await axiosInstance.post(
    `/api/admin/user/${userId}/wallet/update`,
    data,
  );
  return response.data;
};

export const getUserByMobile = async (mobileNo) => {
  const response = await axiosInstance.get(
    `/api/admin/user/list?mobileNo=${mobileNo}`,
  );
  return response.data;
};

export const deductUserBalance = async (userId, data) => {
  const response = await axiosInstance.post(
    `/api/admin/user/${userId}/wallet/deduct`,
    data,
  );
  return response.data;
};
