// import React, { useState, useEffect } from 'react';
// import { Modal, Form, Input, Checkbox, message } from 'antd';
// import { updateRole } from '../../../../services/admin/apiRolePremission';
// import { PERMISSION_GROUPS } from '../PERMISSION_GROUPS';

// const EditRoleModal = ({ isModalOpen, handleOk, handleCancel, roleData, onRoleUpdated }) => {
//     const [form] = Form.useForm();
//     const [loading, setLoading] = useState(false);
//     const [selectedPermissions, setSelectedPermissions] = useState([]);

//     useEffect(() => {
//         if (roleData) {
//             form.setFieldsValue({ name: roleData.name });
//             setSelectedPermissions(roleData.permissions || []);
//         }
//     }, [roleData, form]);

//     const handleSubmit = async (values) => {
//         if (selectedPermissions.length === 0) {
//             return message.error('Please select at least one permission.');
//         }
//         setLoading(true);
//         try {
//             await updateRole(roleData._id, {
//                 name: values.name,
//                 permissions: selectedPermissions,
//             });
//             message.success('Role updated successfully!');
//             form.resetFields();
//             setSelectedPermissions([]);
//             handleOk();
//             if (onRoleUpdated) onRoleUpdated();
//         } catch {
//             message.error('Failed to update role.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handlePermissionChange = (checkedValues) => {
//         setSelectedPermissions(checkedValues);
//     };

//     const onCancel = () => {
//         form.resetFields();
//         setSelectedPermissions([]);
//         handleCancel();
//     };

//     return (
//         <Modal
//             title="Edit Role"
//             open={isModalOpen}
//             onOk={form.submit}
//             onCancel={onCancel}
//             confirmLoading={loading}
//             okText="Update Role"
//         >
//             <Form
//                 form={form}
//                 layout="vertical"
//                 onFinish={handleSubmit}
//             >
//                 <Form.Item
//                     label="Role Name"
//                     name="name"
//                     rules={[{ required: true, message: 'Please enter role name!' }]}
//                 >
//                     <Input placeholder='Enter Role Name' />
//                 </Form.Item>
//                 <Form.Item label="Permissions" required>
//                     <Checkbox.Group
//                         value={selectedPermissions}
//                         onChange={handlePermissionChange}
//                         style={{ width: '100%' }}
//                     >
//                         {PERMISSION_GROUPS.map(group => (
//                             <div key={group.groupName} style={{ marginBottom: 12 }}>
//                                 <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{group.groupName}</div>
//                                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//                                     {group.permissions.map(permission => (
//                                         <Checkbox key={permission.key} value={permission.key} style={{ marginRight: 8 }}>
//                                             {permission.label}
//                                         </Checkbox>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </Checkbox.Group>
//                 </Form.Item>
//             </Form>
//         </Modal>
//     );
// };

// export default EditRoleModal; 

import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Checkbox, message, Card, Spin } from 'antd';
import { updateRole } from '../../../../services/admin/apiRolePremission';
import { PERMISSION_GROUPS } from '../PERMISSION_GROUPS';

const EditRoleModal = ({ isModalOpen, handleOk, handleCancel, roleData, onRoleUpdated }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        if (roleData) {
            form.setFieldsValue({ name: roleData.name });
            setSelectedPermissions(roleData.permissions || []);
        }
    }, [roleData, form]);

    const handleSubmit = async (values) => {
        if (selectedPermissions.length === 0) {
            return message.error('Please select at least one permission.');
        }
        setLoading(true);
        try {
            await updateRole(roleData._id, {
                name: values.name,
                permissions: selectedPermissions,
            });
            message.success('Role updated successfully!');
            form.resetFields();
            setSelectedPermissions([]);
            handleOk();
            if (onRoleUpdated) onRoleUpdated();
        } catch {
            message.error('Failed to update role.');
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
            title="Edit Role"
            open={isModalOpen}
            onOk={form.submit}
            onCancel={onCancel}
            confirmLoading={loading}
            okText="Update Role"
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

export default EditRoleModal;
