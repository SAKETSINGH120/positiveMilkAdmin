import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Switch, Button, message, Radio } from 'antd';
import { vendorUpdate } from '../../../../services/apiVendor';

const EditVendorBasicModal = ({ open, vendor, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && vendor) {
            // Optional debug logs
            console.log("Populating form with vendor data:", vendor);

            // Reset the form first, then set fields
            form.resetFields();
            form.setFieldsValue({
                name: vendor.name || '',
                email: vendor.email || '',
                mobile: vendor.mobile || '',
                commission: vendor.commission || 0,
                payoutType: vendor.payoutType || 'weekly',
                isBlocked: vendor.isBlocked || false,
                status: vendor.status || false,
            });
        }
    }, [open, vendor, form]);

    const handleFinish = async (values) => {
        setLoading(true);
        try {
            const updateData = {
                name: values.name,
                email: values.email,
                mobile: values.mobile,
                commission: values.commission,
                payoutType: values.payoutType,
            };
            await vendorUpdate(vendor._id, updateData);
            message.success('Vendor updated successfully');
            onSuccess && onSuccess();
        } catch (err) {
            message.error('Failed to update vendor');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title={`Edit Vendor - ${vendor?.name || ''}`}
            open={open}
            onCancel={onCancel}
            footer={null}
            destroyOnClose
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Name is required' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { type: 'email', message: 'Enter a valid email' },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Mobile"
                    name="mobile"
                    rules={[{ required: true, message: 'Mobile is required' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Commission Rate (%)"
                    name="commission"
                    rules={[{ required: true, message: 'Commission is required' }]}
                >
                    <InputNumber min={0} max={100} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Payout Schedule"
                    name="payoutType"
                    rules={[{ required: true }]}
                >
                    <Radio.Group>
                        <Radio value="daily">Daily</Radio>
                        <Radio value="weekly">Weekly</Radio>
                        <Radio value="monthly">Monthly</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item style={{ textAlign: 'right' }}>
                    <Button onClick={onCancel} style={{ marginRight: 8 }}>
                        Cancel
                    </Button>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Update
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditVendorBasicModal;
