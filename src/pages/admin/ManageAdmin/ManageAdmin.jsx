import React from 'react';
import AdminTable from './components/AdminTable';

const ManageAdmin = () => {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Admin Management</h1>
                <p className="text-gray-600 mt-2">
                    Manage admin accounts, roles, and permissions for your platform
                </p>
            </div>
            
            <AdminTable />
        </div>
    );
};

export default ManageAdmin; 