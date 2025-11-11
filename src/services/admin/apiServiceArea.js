import axiosInstance from "@utils/axiosInstance";

export const getAllServiceArea = async () => {
    const response = await axiosInstance.get('/api/admin/serviceabelArea');
    return response.data;
}

export const addServiceArea = async (data) => {
    const response = await axiosInstance.post('/api/admin/serviceabelArea', data)
    return response;
}

export const updateServiceArea = async (id, data) => {
    const response = await axiosInstance.patch(`/api/admin/serviceabelArea/${id}`, data)
    return response;
}

export const deleteServiceArea = async (id) => {
    const response = await axiosInstance.delete(`/api/admin/serviceabelArea/${id}`);
    return response;
}
