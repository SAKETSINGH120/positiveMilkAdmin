import React, { useEffect, useState } from 'react';
import { Modal, Form, InputNumber, Button, message, Avatar, Space, Tag, Select } from 'antd';
import { updateShop, updateTopShop } from '../../../../services/admin/apiShop';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditShopModal = ({ isModalOpen, handleCancel, shopData, categoryId, fetchShop }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Set initial form values when modal opens
    useEffect(() => {
        if (isModalOpen && shopData) {
            form.setFieldsValue({
                priority: shopData.priority || 1
            });
        }
    }, [isModalOpen, shopData, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const payload = {
                shopId: shopData._id,
                priority: values.priority
            };

            await updateShop(payload);
            message.success('Priority updated successfully!');
            handleCancel();
        } catch {
            message.error('Failed to update priority');
        } finally {
            setLoading(false);
            fetchShop()
        }
    };

    const handleCancelModal = () => {
        form.resetFields();
        handleCancel();
    };

    return (
        <Modal
            title="Edit Top Shop Priority"
            open={isModalOpen}
            onCancel={handleCancelModal}
            footer={null}
            width={500}
        >
            {shopData && (
                <div className="space-y-4">
                    {/* Shop Info Display */}
                    <div style={{
                        padding: '16px',
                        border: '1px solid #d9d9d9',
                        borderRadius: '6px',
                        backgroundColor: '#fafafa'
                    }}>
                        <Space align="start">
                            <Avatar
                                shape="square"
                                size={60}
                                src={`${BASE_URL}/${shopData.shopImage?.replace(/\\/g, '/')}`}
                                alt={shopData.name}
                            />
                            <div>
                                <h4 style={{ margin: '0 0 8px 0' }}>{shopData.name}</h4>
                                <div style={{ marginBottom: '4px' }}>
                                    <strong>Vendor:</strong> {shopData.vendorName || 'N/A'}
                                </div>
                                <div style={{ marginBottom: '4px' }}>
                                    <strong>Type:</strong>
                                    <Tag color={shopData.shopType === 'veg' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                                        {shopData.shopType?.toUpperCase()}
                                    </Tag>
                                </div>
                                <div>
                                    <strong>Phone:</strong> {shopData.phone || 'N/A'}
                                </div>
                            </div>
                        </Space>
                    </div>

                    {/* Priority Form */}
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                    >
                        <Form.Item
                            label="Priority"
                            name="priority"
                            rules={[
                                { required: true, message: 'Please select priority!' }
                            ]}
                        >
                            <Select
                                style={{ width: '100%' }}
                                placeholder="Select priority (1-10)"
                            >
                                {[...Array(10)].map((_, i) => (
                                    <Select.Option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                            <Space>
                                <Button onClick={handleCancelModal}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Update Priority
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            )}
        </Modal>
    );
};

export default EditShopModal; 