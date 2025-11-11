import axiosInstance from "../../utils/axiosInstance";

// Get all admins
export const getAllAdmins = async () => {
    const response = await axiosInstance.get('/api/admin/getadmin');
    return response.data;
};

/**
 * 
 *  {
    "name": "Abhishek",
    "email": "abhishek@gmail.com",
    "phoneNo": "1234567890",
    "password": "123456",
    "address": "address",
    "bio": "Bio",
    "role": "6893001a94fea0154cefec8c"
*   }
 */

export const createAdmin = async (data) => {
    const response = await axiosInstance.post(`/api/admin/createadmin`, data);
    return response.data;
};

// Get admin details by ID
export const getAdminDetails = async (adminId) => {
    const response = await axiosInstance.get(`/api/admin/getadmin/${adminId}`);
    return response.data;
};

// Update admin permissions
export const updateAdmin = async (adminId, data) => {
    const response = await axiosInstance.patch(`/api/admin/updateadmin/${adminId}`, data);
    return response.data;
};

// Delete admin
export const deleteAdmin = async (adminId) => {
    const response = await axiosInstance.delete(`/api/admin/deleteadmin/${adminId}`);
    return response.data;
};

// Block/Unblock admin
export const toggleAdminStatus = async (adminId, isBlocked) => {
    const response = await axiosInstance.patch(`/api/admin/updateadmin/${adminId}`, {
        status: isBlocked
    });
    return response.data;
};

// Get all permissions
export const getAllPermissions = async () => {
    const response = await axiosInstance.get('/api/admin/permissions');
    return response.data;
}; 