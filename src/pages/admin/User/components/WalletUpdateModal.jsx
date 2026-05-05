import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Descriptions, message } from 'antd';
import { IoMdWallet } from 'react-icons/io';

const WalletUpdateModal = ({ visible, user, onUpdate, onClose, loading }) => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible, form]);

    const handleSubmit = async (values) => {
        setSubmitting(true);
        try {
            await onUpdate(user._id, {
                amount: values.amount,
                type: 'credit' // Default to credit for adding amount
            });
            form.resetFields();
        } catch (error) {
            console.error("Wallet update failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <IoMdWallet className="text-blue-500 text-xl" />
                    <span>Manage User Wallet</span>
                </div>
            }
            open={visible}
            onCancel={onClose}
            footer={null}
            destroyOnClose
        >
            {user && (
                <div className="py-4">
                    <Descriptions bordered column={1} size="small" className="mb-6">
                        <Descriptions.Item label="User Name">{user.name}</Descriptions.Item>
                        <Descriptions.Item label="Mobile Number">{user.mobileNo}</Descriptions.Item>
                        <Descriptions.Item label="Current Balance">
                            <span className="text-green-600 font-bold text-lg">
                                ₹{user.wallet || 0}
                            </span>
                        </Descriptions.Item>
                    </Descriptions>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{ amount: 0 }}
                    >
                        <Form.Item
                            name="amount"
                            label="Add Amount (₹)"
                            rules={[
                                { required: true, message: 'Please enter an amount' },
                                { type: 'number', min: 1, message: 'Amount must be at least 1' }
                            ]}
                        >
                            <InputNumber
                                className="w-full"
                                size="large"
                                min={1}
                                placeholder="Enter amount to add"
                                formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/\₹\s?|(,*)/g, '')}
                            />
                        </Form.Item>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button onClick={onClose}>Cancel</Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={submitting || loading}
                            >
                                Update Balance
                            </Button>
                        </div>
                    </Form>
                </div>
            )}
        </Modal>
    );
};

export default WalletUpdateModal;
