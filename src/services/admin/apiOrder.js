import { message } from "antd";
import axiosInstance from "../../utils/axiosInstance";

// export const getAllOrder = async () => {
//     try {
//         const response = await axiosInstance.get(`/api/admin/neworder?orderStatus=all`);
//         // console.log(response)
//         return response.data;
//     } catch (error) {
//         // console.log(error)
//         message.error('Error fetching order');
//     }
// }

export const getAllOrder = async (serviceType, orderType) => {
  try {
    const response = await axiosInstance.get(
      `/api/admin/neworder?serviceType=${serviceType}&orderStatus=${orderType}`
    );
    // console.log(response)
    return response.data;
  } catch (error) {
    // console.log(error)
    message.error("Error fetching order");
  }
};

export const getOrderDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/admin/neworder/${id}`);
    // console.log(response)
    return response.data;
  } catch (error) {
    // console.log(error)
    message.error("Error fetching order");
  }
};

export const getAllDrivers = async (id) => {
  try {
    // const response = await axiosInstance.get(`/api/admin/neworder/${id}/driverlist`)
    const response = await axiosInstance.get(`/api/admin/getDriverList`);

    // console.log(response.data.data)
    return response.data;
  } catch (error) {
    console.log(error);
    message.error("Error fetching category list");
  }
};

export const assignDriver = async (id, driverId) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/order/assign/${id}`,
      { driverId }
    );
    // console.log(response)
    return response.data;
  } catch (error) {
    // console.log(error)
    message.error(error.response.data.message || "Error assigning order");
  }
};

export const AssignDriver = async (payload) => {
  try {
    const response = await axiosInstance.patch(
      `/api/admin/bulkOrderAssign`,
      payload
    );
    return response.data;
  } catch (error) {
    message.error(error.response?.data?.message || "Error assigning order");
    throw error; // Re-throw the error to allow the caller to handle it if needed
  }
};

// --------- working ---------
// export const changeOrderStatus = async (id, data) => {
//     // console.log(id, data);
//     // console.log("---------------------------------");
//     // return;
//     try {
//         const response = await axiosInstance.post(`/api/vendor/order/status/${id}`, data);
//         // console.log(response.data)
//         return response.data;
//     } catch (error) {
//         // console.log(error)
//         message.error('Error fetching order');
//     }
// }

export const processRefund = async (userId, refundData) => {
  try {
    const response = await axiosInstance.post(
      `/api/admin/user/${userId}/wallet/settle`,
      refundData
    );
    return response.data;
  } catch (error) {
    message.error(error.response?.data?.message || "Error processing refund");
    throw error;
  }
};

export const getFailedOrders = async () => {
  try {
    const response = await axiosInstance.get(`/api/admin/failed-orders`);
    return response.data;
  } catch (error) {
    message.error(error.response?.data?.message || "Error fetching failed orders");
    throw error;
  }
};

// Get categorywise order details
export const getCategorywiseOrderDetails = async () => {
  try {
    const response = await axiosInstance.get(`/api/admin/categoryOrderCount`);
    return response.data;
  } catch (error) {
    console.error("Error fetching category order details:", error);
    message.error(
      error.response?.data?.message || "Error fetching category order details"
    );
    throw error;
  }
};
