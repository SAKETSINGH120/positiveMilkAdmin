import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, message } from 'antd';
import { processRefund } from '../../../../services/admin/apiOrder';

const RefundModal = ({ visible, onCancel, orderData, onSuccess }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Set initial form values when modal opens
    React.useEffect(() => {
        if (visible && orderData) {
            form.setFieldsValue({
                amount: orderData.finalTotalPrice,
                remark: `Refund amount ${orderData.finalTotalPrice} for your order no - ${orderData.booking_id}`,
                type: 'credit'
            });
        }
    }, [visible, orderData, form]);

    const handleSubmit = async (values) => {
        setLoading(true);
        // console.log(values)
        // console.table(orderData)
        try {
            await processRefund(orderData.userId, {
                amount: values.amount,
                remark: values.remark,
                type: values.type,
                orderId: orderData._id
            });
            message.success('Refund processed successfully');
            onSuccess();
            onCancel();
        } catch (error) {
            console.error('Refund error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title="Process Refund"
            open={visible}
            onCancel={handleCancel}
            onOk={() => form.submit()}
            confirmLoading={loading}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="amount"
                    label="Refund Amount"
                    rules={[{ required: true, message: 'Please enter refund amount' }]}
                >
                    <InputNumber
                        style={{ width: '100%' }}
                        placeholder="Enter refund amount"
                        min={0}
                        precision={2}
                        prefix="₹"
                    />
                </Form.Item>

                <Form.Item
                    name="remark"
                    label="Remark"
                    rules={[{ required: true, message: 'Please enter remark' }]}
                >
                    <Input.TextArea
                        rows={3}
                        placeholder="Enter remark for refund"
                    />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Type"
                    rules={[{ required: true, message: 'Please select type' }]}
                >
                    <Input placeholder="Type" disabled />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default RefundModal; 