import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag, Switch, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { getAllAdmins, deleteAdmin, toggleAdminStatus } from '../../../../services/admin/apiAdmin';
import AdminPermissionsModal from './AdminPermissionsModal';
import AddAdminModal from './AddAdminModal';

const AdminTable = () => {
    const navigate = useNavigate();
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [permissionsModalVisible, setPermissionsModalVisible] = useState(false);
    const [addModalVisible, setAddModalVisible] = useState(false);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const response = await getAllAdmins();
            setAdmins(response.data.admins || []);
        } catch (error) {
            console.error('Error fetching admins:', error);
            message.error('Failed to load admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleViewPermissions = (admin) => {
        setSelectedAdmin(admin);
        setPermissionsModalVisible(true);
    };

    const handleEditAdmin = (admin) => {
        // Navigate to the edit admin page
        navigate(`/admin/manage-admin/edit/${admin._id}`);
    };

    const handleDeleteAdmin = async (adminId) => {
        try {
            await deleteAdmin(adminId);
            message.success('Admin deleted successfully');
            fetchAdmins();
        } catch (error) {
            console.error('Error deleting admin:', error);
            message.error('Failed to delete admin');
        }
    };

    const handleToggleStatus = async (adminId, isBlocked) => {
        try {
            await toggleAdminStatus(adminId, isBlocked);
            message.success(`Admin ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
            fetchAdmins();
        } catch (error) {
            console.error('Error toggling admin status:', error);
            message.error('Failed to update admin status');
        }
    };

    const columns = [
        {
            title: 'Admin',
            key: 'admin',
            render: (_, record) => (
                <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <UserOutlined className="text-blue-600" />
                    </div>
                    <div>
                        <div className="font-medium">{record.name}</div>
                        <div className="text-sm text-gray-500">{record.email}</div>
                    </div>
                </div>
            ),
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role) => (
                <Tag color="blue" className="font-medium">
                    {role ? role.name : "N/A"}
                </Tag>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <div className="flex items-center">
                    <Switch
                        checked={record.isBlocked}
                        onChange={(checked) => handleToggleStatus(record._id, checked)}
                        size="small"
                    />
                    <span className="ml-2 text-sm">
                        {record.isBlocked ? 'Blocked' : 'Active'}
                    </span>
                </div>
            ),
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => (
                <span className="text-sm text-gray-500">
                    {new Date(date).toLocaleDateString()}
                </span>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        size="small"
                        onClick={() => handleViewPermissions(record)}
                    >
                        View
                    </Button>
                    <Button
                        type="default"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditAdmin(record)}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this admin?"
                        onConfirm={() => handleDeleteAdmin(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button
                            type="default"
                            danger
                            icon={<DeleteOutlined />}
                            size="small"
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-4 flex items-center justify-between">
                <Button
                    type="primary"
                    onClick={() => setAddModalVisible(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                    Add Admin
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={admins}
                loading={loading}
                rowKey="_id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} admins`,
                }}
                className="bg-white rounded-lg shadow"
            />

            {/* Permissions Modal */}
            <AdminPermissionsModal
                visible={permissionsModalVisible}
                admin={selectedAdmin}
                onClose={() => {
                    setPermissionsModalVisible(false);
                    setSelectedAdmin(null);
                }}
                onUpdate={fetchAdmins}
                readOnly={true}
            />

            {/* Add Admin Modal */}
            <AddAdminModal
                visible={addModalVisible}
                onClose={() => setAddModalVisible(false)}
                onSuccess={fetchAdmins}
            />


        </div>
    );
};

export default AdminTable; 