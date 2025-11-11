import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router'; // ✅ use 'react-router-dom' not 'react-router'
import axiosInstance from '../../../utils/axiosInstance';
import { resetVendorPassword, verifyVendor } from '../../../services/vendor/apiAuth';

function VendorForgotPassword() {
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const handleVerify = async () => {
        try {
            const userId = form.getFieldValue('userId');
            if (!userId) {
                return message.error('Please enter your User ID');
            }
            setLoading(true);
            const res = await verifyVendor(userId);
            if (res?.success) {
                message.success('Vendor verified!');
                setVerified(true);
            } else {
                message.error('Invalid Vendor');
            }
        } catch (err) {
            message.error(err?.response?.data?.message || 'Verification failed');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (values) => {
        if (values.password !== values.confirmPassword) {
            return message.error('Passwords do not match');
        }
        try {
            setLoading(true);
            const res = await resetVendorPassword(values.userId, values.password)
            if (res?.status) {
                message.success('Password reset successfully!');
                navigate('/vendor/login');
            } else {
                message.error('Password reset failed');
            }
        } catch (err) {
            message.error(err?.response?.data?.message || 'Error resetting password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-100 px-4 py-10">
            <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Forgot Password</h2>

                <Form layout="vertical" form={form} onFinish={handleResetPassword}>
                    <Form.Item
                        label="User ID"
                        name="userId"
                        rules={[{ required: true, message: 'Please enter your User ID' }]}
                    >
                        <Input disabled={verified} />
                    </Form.Item>

                    {!verified ? (
                        <Form.Item>
                            <Button
                                type="primary"
                                onClick={handleVerify}
                                loading={loading}
                                block
                            >
                                Verify
                            </Button>
                        </Form.Item>
                    ) : (
                        <>
                            <Form.Item
                                label="New Password"
                                name="password"
                                rules={[{ required: true, message: 'Enter new password' }]}
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item
                                label="Confirm Password"
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Please confirm your password' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
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
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                >
                                    Reset Password
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form>
            </div>
        </div>
    );
}

export default VendorForgotPassword;
