import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router';
import axiosInstance from '../../../../utils/axiosInstance';
import { changeVendorPassword } from '../../../../services/vendor/apiAuth';

const ChangePassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChangePassword = async (values) => {
        if (values.newPassword !== values.confirmPassword) {
            return message.error('Passwords do not match');
        }

        try {
            setLoading(true);

            const res = await changeVendorPassword(values.oldPassword, values.newPassword)

            if (res?.status) {
                message.success('Password changed successfully!');
                navigate('/vendor/login'); // Or wherever you want to redirect
            } else {
                message.error(res.data?.message || 'Failed to change password');
            }
        } catch (error) {
            message.error(error?.response?.data?.message || 'Error changing password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="bg-gray-100 flex justify-center items-center">
                <div className="w-full max-w-md">

                    <Form form={form} layout="vertical" onFinish={handleChangePassword}>
                        <Form.Item
                            label="Current Password"
                            name="oldPassword"
                            rules={[{ required: true, message: 'Please enter your current password' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="New Password"
                            name="newPassword"
                            rules={[{ required: true, message: 'Please enter your new password' }]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            label="Confirm New Password"
                            name="confirmPassword"
                            dependencies={['newPassword']}
                            rules={[
                                { required: true, message: 'Please confirm your new password' },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('newPassword') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('Passwords do not match'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading} block>
                                Change Password
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </>
    );
};

export default ChangePassword;
