import { message } from 'antd'
import axiosInstance from '@utils/axiosInstance'

export const getAllSubscription = async () => {
  try {
    const response = await axiosInstance.get('/api/admin/subscriptionList')
    // console.log(response.data.data)
    return response.data
  } catch (error) {
    // console.log(error)
    message.error('Error fetching subscription list')
  }
}

export const getSubscriptionsDetails = async (id) => {
  try {
    const response = await axiosInstance.get(`/api/admin/subscriptionDataById/${id}`)
    // console.log(response.data.data)
    return response.data
  } catch (error) {
    // console.log(error)
    message.error('Error fetching subscription list')
  }
}
