import React, { useState, useEffect } from 'react';
import { Modal, Checkbox, Card, Button, message, Spin, Form, Input, Tag } from 'antd';
import { UserOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { PERMISSION_GROUPS } from '../../ManageRolePage/PERMISSION_GROUPS';
import { getAdminDetails } from '../../../../services/admin/apiAdmin';

const AdminPermissionsModal = ({ visible, admin, onClose, onUpdate, readOnly = false }) => {
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && admin) {
            setLoading(true);
            loadAdminData();
        }
    }, [visible, admin]);

    const loadAdminData = async () => {
        try {
            const adminData = await getAdminDetails(admin._id);
            setSelectedPermissions(adminData.data.premission.permissions || []);
            form.setFieldsValue({
                name: adminData.name,
                email: adminData.email,
                role: adminData.role
            });
        } catch (error) {
            console.error('Error loading admin data:', error);
            message.error('Failed to load admin details');
        } finally {
            setLoading(false);
        }
    };

    const handleGroupChange = (group, checked) => {
        const groupPermissionKeys = group.permissions.map(p => p.key);
        let newSelectedPermissions = [...selectedPermissions];

        if (checked) {
            // Add all permissions from the group, avoiding duplicates
            groupPermissionKeys.forEach(key => {
                if (!newSelectedPermissions.includes(key)) {
                    newSelectedPermissions.push(key);
                }
            });
        } else {
            // Remove all permissions from the group
            newSelectedPermissions = newSelectedPermissions.filter(key => !groupPermissionKeys.includes(key));
        }
        setSelectedPermissions(newSelectedPermissions);
    };

    const handleSave = async () => {
        if (selectedPermissions.length === 0) {
            message.error('An admin must have at least one permission.');
            return;
        }

        setSaving(true);
        try {
            // await updateAdminPermissions(admin.id, selectedPermissions);
            message.success('Admin permissions updated successfully!');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Error updating admin permissions:', error);
            message.error('Failed to update admin permissions');
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setSelectedPermissions([]);
        form.resetFields();
        onClose();
    };

    const modalTitle = readOnly ? 'View Admin Permissions' : 'Edit Admin Permissions';
    const modalWidth = 1000;

    return (
        <Modal
            title={
                <div className="flex items-center">
                    <UserOutlined className="mr-2 text-blue-600" />
                    <span className="text-lg font-semibold">{modalTitle}</span>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            width={modalWidth}
            footer={
                readOnly ? [
                    <Button key="close" onClick={handleCancel}>
                        Close
                    </Button>
                ] : [
                    <Button key="cancel" onClick={handleCancel} icon={<CloseOutlined />}>
                        Cancel
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={handleSave}
                        loading={saving}
                        icon={<SaveOutlined />}
                    >
                        Save Changes
                    </Button>
                ]
            }
            destroyOnHidden
        >
            <Spin spinning={loading}>
                {admin && (
                    <div className="space-y-6">
                        {/* Admin Info */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                                    <UserOutlined className="text-blue-600 text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{admin.name}</h3>
                                    <p className="text-gray-600">{admin.email}</p>
                                    <Tag color="blue" className="mt-1">{admin.role ? admin.role.name : 'Admin'}</Tag>
                                </div>
                            </div>
                        </div>

                        {/* Permissions Section */}
                        <div>
                            <h4 className="text-lg font-semibold mb-4 text-gray-800">
                                {readOnly ? 'Current Permissions' : 'Manage Permissions'}
                            </h4>

                            {!readOnly && (
                                <p className="text-sm text-gray-600 mb-4">
                                    Select the permissions you want to assign to this admin.
                                    You can select entire groups or individual permissions.
                                </p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {PERMISSION_GROUPS.map(group => {
                                    // Filter permissions for preview mode
                                    const groupPermissionKeys = group.permissions.map(p => p.key);
                                    let filteredPermissions = group.permissions;
                                    if (readOnly) {
                                        filteredPermissions = group.permissions.filter(permission => selectedPermissions.includes(permission.key));
                                        // If no permissions in this group are assigned, skip rendering this group
                                        if (filteredPermissions.length === 0) return null;
                                    }
                                    const selectedInGroup = groupPermissionKeys.filter(key =>
                                        selectedPermissions.includes(key)
                                    );
                                    const allSelected = selectedInGroup.length === groupPermissionKeys.length;
                                    const isIndeterminate = selectedInGroup.length > 0 && !allSelected;

                                    return (
                                        <Card
                                            key={group.groupName}
                                            title={
                                                !readOnly ? (
                                                    <Checkbox
                                                        indeterminate={isIndeterminate}
                                                        checked={allSelected}
                                                        onChange={(e) => handleGroupChange(group, e.target.checked)}
                                                        disabled={readOnly}
                                                    >
                                                        <span className="font-bold text-base">{group.groupName}</span>
                                                    </Checkbox>
                                                ) : (
                                                    <span className="font-bold text-base">{group.groupName}</span>
                                                )
                                            }
                                            variant="outlined"
                                            className="shadow-sm border border-gray-200"
                                            size="small"
                                        >
                                            <Checkbox.Group
                                                className="flex flex-col space-y-2"
                                                value={selectedPermissions}
                                                onChange={setSelectedPermissions}
                                                disabled={readOnly}
                                            >
                                                {filteredPermissions.map(permission => (
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

                            {!readOnly && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-800">
                                        <strong>Selected Permissions:</strong> {selectedPermissions.length} permissions
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Spin>
        </Modal>
    );
};

export default AdminPermissionsModal; 