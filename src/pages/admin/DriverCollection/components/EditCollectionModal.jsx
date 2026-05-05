import React, { useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber } from "antd";

const EditCollectionModal = ({ visible, initialValues, onCancel, onOk }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                amount: initialValues.amount,
                status: initialValues.status,
                description: initialValues.description,
            });
        }
    }, [visible, initialValues]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onOk(values);
        });
    };

    return (
        <Modal
            title="Edit Collection Record"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText="Update"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Amount"
                    name="amount"
                    rules={[{ required: true, message: "Please enter amount" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Enter amount"
                        min={1}
                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
                    />
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="status"
                    rules={[{ required: true, message: "Please select status" }]}
                >
                    <Select
                        options={[
                            { value: "received", label: "Received" },
                            { value: "pending", label: "Pending" },
                            { value: "cancelled", label: "Cancelled" },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea placeholder="Optional notes" rows={2} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default EditCollectionModal;
