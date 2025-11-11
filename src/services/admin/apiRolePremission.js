import axiosInstance from "../../utils/axiosInstance";

export const getAllPremission = async () => {
    const response = await axiosInstance.get('/api/admin/premission');
    return response.data;
}

export const getAllRoles = async () => {
    const response = await axiosInstance.get('/api/admin/role');
    return response.data;
}

export const createRole = async (data) => {
    const response = await axiosInstance.post('/api/admin/role', data); // data = {"name"= "Product Manager", "permissions"= ["CREATE_PRODUCT","UPDATE_PRODUCT"]}
    return response.data;
}

export const updateRole = async (id, data) => {
    const response = await axiosInstance.patch(`/api/admin/role/${id}`, data); // data = {"name"= "Product Manager", "permissions"= ["CREATE_PRODUCT","UPDATE_PRODUCT"]}
    return response.data;
}

export const deleteRole = async (id) => {
    const response = await axiosInstance.delete(`/api/admin/role/${id}`);
    return response.data;
}