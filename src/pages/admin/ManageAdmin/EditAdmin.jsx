import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Form, Input, Button, Checkbox, Card, Row, Col, message, Spin, Tag, Select } from 'antd';
import { ArrowLeftOutlined, UserOutlined, SaveOutlined } from '@ant-design/icons';
import { PERMISSION_GROUPS } from '../ManageRolePage/PERMISSION_GROUPS';
import { getAdminDetails, updateAdmin } from '../../../services/admin/apiAdmin';
import { getAllRoles } from '../../../services/admin/apiRolePremission';

const EditAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [roleData, setRoleData] = useState(null);

    // --- Data Fetching for Edit Mode ---
    useEffect(() => {
        if (id) {
            setLoading(true);
            loadAdminData();
        }
    }, [id]);

    const loadAdminData = async () => {
        try {
            const response = await getAdminDetails(id);
            const rolesData = await getAllRoles();
            setAdminData(response.data.admin);
            setRoleData(rolesData.data.roles)
            form.setFieldsValue({
                name: response.data.admin.name,
                email: response.data.admin.email,
                role: response.data.admin.role?._id || '',
            });
        } catch (error) {
            console.error('Error loading admin data:', error);
            message.error('Failed to load admin data');
        } finally {
            setLoading(false);
        }
    };

    // --- Form Submission ---
    const onFinish = async (values) => {

        setSaving(true);
        try {
            // Ensure role is sent as _id
            const payload = { ...values, role: values.role };
            await updateAdmin(id, payload);
            message.success('Admin updated successfully!');
            navigate('/admin/manage-admin'); // Navigate back to the admin list
        } catch (error) {
            console.error('Error updating admin:', error);
            message.error('An error occurred. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <Spin spinning={loading}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center mb-6">
                        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} className="mr-4" />
                        <h1 className="text-3xl font-bold text-gray-800">
                            Edit Admin Permissions
                        </h1>
                    </div>

                    {adminData && (
                        <div className="bg-blue-50 p-4 rounded-lg mb-6">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <UserOutlined className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{adminData.name}</h3>
                                    <p className="text-gray-600">{adminData.email}</p>
                                    <Tag color="blue" className="mt-1">{adminData.role && adminData.role.name || 'Admin'}</Tag>
                                </div>
                            </div>
                        </div>
                    )}

                    <Form form={form} layout="vertical" onFinish={onFinish}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label={<span className="font-semibold text-lg">Admin Name</span>}
                                    rules={[{ required: true, message: 'Please enter the admin name!' }]}
                                >
                                    <Input placeholder="Admin name" size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="email"
                                    label={<span className="font-semibold text-lg">Email</span>}
                                    rules={[
                                        { required: true, message: 'Please enter the email!' },
                                        { type: 'email', message: 'Please enter a valid email!' }
                                    ]}
                                >
                                    <Input placeholder="admin@example.com" size="large" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item
                            name="role"
                            label={<span className="font-semibold text-lg">Role</span>}
                            rules={[{ required: true, message: 'Please enter the role!' }]}
                        >
                            <Select
                                placeholder="Select a role"
                                size="large"
                                loading={!roleData}
                                optionFilterProp="children"
                                showSearch
                            >
                                {roleData && roleData.map(role => (
                                    <Select.Option key={role._id} value={role._id}>
                                        {role.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item className="mt-10 text-right">
                            <Button type="primary" htmlType="submit" size="large" loading={saving} icon={<SaveOutlined />}>
                                Update Admin
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </Spin>
        </div>
    );
};

export default EditAdmin; 