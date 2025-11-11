import React, { useState } from 'react';
import { Modal, Form, Input, Checkbox, message, Card, Spin } from 'antd';
import { createRole } from '../../../../services/admin/apiRolePremission';
import { PERMISSION_GROUPS } from '../PERMISSION_GROUPS';

const AddRoleModal = ({ isModalOpen, handleOk, handleCancel, onRoleCreated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const handleSubmit = async (values) => {
        if (selectedPermissions.length === 0) {
            return message.error('Please select at least one permission.');
        }
        setLoading(true);
        try {
            await createRole({
                name: values.name,
                permissions: selectedPermissions,
            });
            message.success('Role created successfully!');
            form.resetFields();
            setSelectedPermissions([]);
            handleOk();
            if (onRoleCreated) onRoleCreated();
        } catch {
            message.error('Failed to create role.');
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
        form.resetFields();
        setSelectedPermissions([]);
        handleCancel();
    };

    return (
        <Modal
            title="Create New Role"
            open={isModalOpen}
            onOk={form.submit}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Create Role"
            width={1000}
        >
            <Spin spinning={loading}>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Role Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter role name!' }]}
                    >
                        <Input placeholder='Enter Role Name' />
                    </Form.Item>

                    <Form.Item label="Permissions" required>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {PERMISSION_GROUPS.map(group => {
                                const allChildren = group.permissions.map(p => p.key);
                                const isAllSelected = allChildren.every(key => selectedPermissions.includes(key));
                                const isPartiallySelected =
                                    allChildren.some(key => selectedPermissions.includes(key)) && !isAllSelected;

                                const handleGroupChange = (e) => {
                                    const checked = e.target.checked;
                                    setSelectedPermissions((prev) => {
                                        const newPermissions = new Set(prev);
                                        if (checked) {
                                            allChildren.forEach(p => newPermissions.add(p));
                                        } else {
                                            allChildren.forEach(p => newPermissions.delete(p));
                                        }
                                        return Array.from(newPermissions);
                                    });
                                };

                                const handleChildChange = (checkedList) => {
                                    setSelectedPermissions((prev) => {
                                        const otherPermissions = prev.filter(p => !allChildren.includes(p));
                                        return [...otherPermissions, ...checkedList];
                                    });
                                };

                                return (
                                    <Card
                                        key={group.groupName}
                                        title={
                                            <Checkbox
                                                indeterminate={isPartiallySelected}
                                                checked={isAllSelected}
                                                onChange={(e) => handleGroupChange(e)}
                                                style={{ fontWeight: 600 }}
                                            >
                                                {group.groupName}
                                            </Checkbox>
                                        }
                                        className="shadow-sm border border-gray-200"
                                        size="small"
                                    >
                                        <Checkbox.Group
                                            className="flex flex-col space-y-2"
                                            value={selectedPermissions.filter(key => allChildren.includes(key))}
                                            onChange={handleChildChange}
                                        >
                                            {group.permissions.map(permission => (
                                                <Checkbox
                                                    key={permission.key}
                                                    value={permission.key}
                                                    className="text-sm"
                                                >
                                                    {permission.label}
                                                </Checkbox>
                                            ))}
                                        </Checkbox.Group>
                                    </Card>
                                );
                            })}
                        </div>
                    </Form.Item>
                </Form>
            </Spin>
        </Modal>
    );
};

export default AddRoleModal;
