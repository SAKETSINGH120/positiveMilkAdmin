import axiosInstance from "../../utils/axiosInstance";

export const getPayoutData = async (payoutType, tabType) => {
    const response = await axiosInstance.get(`/api/admin/payout?type=${tabType}&tab=${payoutType}`);
        return response.data;
}

// export const processPayout = async (payoutId, action, remarks = '') => {
//     try {
//         const response = await axiosInstance.patch(`/api/admin/payout/${payoutId}`, {
//             action,
//             remarks
//         });
//         message.success(`Payout ${action} successfully`);
//         return response.data;
//     } catch (error) {
//         console.log(error.message)
//         message.error('Something went wrong');
//         throw error;
//     }
// }

// export const getPayoutStats = async (payoutType) => {
//     try {
//         const response = await axiosInstance.get(`/api/admin/payout/stats?type=${payoutType}`);
//         return response.data;
//     } catch (error) {
//         console.log(error.message)
//         message.error('Something went wrong');
//         throw error;
//     }
// }

// export const generatePayoutReport = async (payoutType, startDate, endDate) => {
//     try {
//         const response = await axiosInstance.get(`/api/admin/payout/report`, {
//             params: {
//                 type: payoutType,
//                 startDate,
//                 endDate
//             }
//         });
//         return response.data;
//     } catch (error) {
//         console.log(error.message)
//         message.error('Something went wrong');
//         throw error;
//     }
// } 