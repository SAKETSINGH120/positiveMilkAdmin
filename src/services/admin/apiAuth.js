import axiosInstance from "../../utils/axiosInstance";
const BASE_URL = import.meta.env.VITE_BASE_URL;



export const changeVendorPassword = async (oldPassword, newPassword) => {
    const res = await axiosInstance.post(`/api/admin/changePassword`, { oldPassword, newPassword });
    return res.data
}



