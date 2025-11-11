import React, { useState, useEffect } from 'react';
import { Button, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAllRoles, deleteRole } from '../../../services/admin/apiRolePremission';
import RoleTable from './components/RoleTable';
import AddRoleModal from './components/AddRoleModal';
import EditRoleModal from './components/EditRoleModal';

const ManageRolePage = () => {
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editRoleData, setEditRoleData] = useState(null);

    // Fetch all roles
    const fetchRoles = async () => {
        setLoading(true);
        try {
            const res = await getAllRoles();
            setRoles(res.data.roles || []);
        } catch {
            message.error('Failed to fetch roles');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRoles();
    }, []);

    // Handlers
    const handleEdit = (role) => {
        setEditRoleData(role);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (role) => {
        if (window.confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
            setLoading(true);
            try {
                await deleteRole(role._id);
                message.success('Role deleted successfully');
                fetchRoles();
            } catch {
                message.error('Failed to delete role');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="p-4 md:p-8 min-h-screen">
            <Spin spinning={loading}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">Roles</h1>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsAddModalOpen(true)}
                            size="large"
                        >
                            Create New Role
                        </Button>
                    </div>
                    <RoleTable
                        data={roles}
                        loading={loading}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </Spin>
            <AddRoleModal
                isModalOpen={isAddModalOpen}
                handleOk={() => setIsAddModalOpen(false)}
                handleCancel={() => setIsAddModalOpen(false)}
                onRoleCreated={fetchRoles}
            />
            <EditRoleModal
                isModalOpen={isEditModalOpen}
                handleOk={() => setIsEditModalOpen(false)}
                handleCancel={() => setIsEditModalOpen(false)}
                roleData={editRoleData}
                onRoleUpdated={fetchRoles}
            />
        </div>
    );
};

export default ManageRolePage;