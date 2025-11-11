import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Button, Select, message, Spin } from 'antd';
import { getAllRoles } from '../../../../services/admin/apiRolePremission';
import { createAdmin } from '../../../../services/admin/apiAdmin';

const AddAdminModal = ({ visible, onClose, onSuccess }) => {
    const [form] = Form.useForm();
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchRoles();
            form.resetFields();
        }
    }, [visible]);

    const fetchRoles = async () => {
        setLoading(true);
        try {
            const response = await getAllRoles();
            setRoles(response.data.roles || []);
        } catch (error) {
            message.error('Failed to load roles');
        } finally {
            setLoading(false);
        }
    };

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);
            await createAdmin(values);
            message.success('Admin added successfully!');
            onSuccess && onSuccess();
            onClose();
        } catch (error) {
            if (error && error.errorFields) return; // validation error
            message.error('Failed to add admin');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title="Add Admin"
            visible={visible}
            onCancel={onClose}
            onOk={handleOk}
            confirmLoading={submitting}
            okText="Add Admin"
            destroyOnClose
        >
            <Spin spinning={loading}>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Admin Name"
                        rules={[{ required: true, message: 'Please enter the admin name!' }]}
                    >
                        <Input placeholder="Admin name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter the email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input placeholder="admin@example.com" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[{ required: true, message: 'Please enter the password!' }]}
                    >
                        <Input.Password placeholder="Password" />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[{ required: true, message: 'Please select a role!' }]}
                    >
                        <Select placeholder="Select a role" loading={loading}>
                            {roles.map(role => (
                                <Select.Option key={role._id} value={role._id}>
                                    {role.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default AddAdminModal; 