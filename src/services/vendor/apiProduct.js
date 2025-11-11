import { message } from "antd";
import axiosInstance from "@utils/axiosInstance"


export const addProduct = async (formData) => {
    const response = await axiosInstance.post("/api/vendor/vendorproduct", formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getAllProducts = async () => {
    try {
        const response = await axiosInstance.get(`/api/vendor/copy/product/all`);
        return response.data.data;
    } catch (error) {
        message.error('Error fetching product list');
    }
}

export const assignBulkProduct = async (data) => {
    try {
        const response = await axiosInstance.post(`/api/vendor/copy/product/bulk/create`, data);
        return response.data;
    } catch (error) {
        message.error('Error fetching product list');
    }
}

export const getAllProductOfShop = async (shopId) => {
    try {
        const response = await axiosInstance.get(`/api/vendor/shop/product/${shopId}`);
        return response.data;
    } catch (error) {
        message.error('Error fetching product list');
    }
}

export const getProductDetail = async (id) => {
    try {
        const response = await axiosInstance.get(`/api/vendor/copy/product/${id}`);
        // console.log(response)
        return response.data.data;
    } catch (error) {
        // console.log(error)
        message.error('Error fetching product details');
    }
}

export const updateProductStatus = async (id, status) => {
    status = status ? "active" : "inactive"
    try {
        const response = await axiosInstance.patch(`/api/vendor/copy/product/status/${id}`, { status });
        message.success('product status update');
        return response.data.data;
    } catch (error) {
        message.error('Error updating product status');
    }
}

export const updateProductRecommended = async (id, isRecommended) => {
    try {
        const response = await axiosInstance.patch(`/api/vendor/copy/product/recommended/${id}`, { isRecommended });
        message.success('product status update');
        return response.data.data;
    } catch (error) {
        message.error('Error updating product status');
    }
}

export const updateProductImages = async (productId, formData) => { 
    console.log(productId)
    formData.forEach((p,a)=>{
        console.log(p,a)
    })
    try {
        const res = await axiosInstance.patch(`/api/vendor/product/images/${productId}`, formData);
        console.log(res)
    } catch (error) {
        console.log(error)
        message.error('Error updating product image');
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/vendor/copy/product/delete/${id}`)
        message.success(response.data.message);
        return response.data;
    } catch (error) {
        message.error('"Product deleted"');
    }
}

export const updateProduct = async (id, data) => {
    try {
        const response = await axiosInstance.patch(`/api/vendor/copy/product/update/${id}`, data)
        return response.data;
    } catch (error) {
        message.error('"Product not updated"');
    }
}

export const toggleProductFlag = async () => {
    console.log("work")
}