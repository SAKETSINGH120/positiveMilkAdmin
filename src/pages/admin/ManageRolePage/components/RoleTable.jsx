import React from 'react';
import { Table, Button, Space, Tag } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';

const RoleTable = ({ data, loading, onEdit, onDelete }) => {
    const columns = [
        {
            title: 'Role Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center',
        },
        {
            title: 'Permissions',
            dataIndex: 'permissions',
            key: 'permissions',
            align: 'center',
            render: (permissions) => (
                <div style={{ maxWidth: 300, overflowX: 'auto' }}>
                    {permissions && permissions.length > 0 ? permissions.map((perm) => (
                        <Tag key={perm} color="blue" style={{ marginBottom: 4 }}>{perm}</Tag>
                    )) : <span>-</span>}
                </div>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" icon={<FaEdit />} onClick={() => onEdit(record)}>Edit</Button>
                    <Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record)}>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            dataSource={data}
            columns={columns}
            rowKey={"_id"}
            scroll={{ x: true }}
            bordered={false}
            size='small'
            loading={loading}
        />
    );
};

export default RoleTable; 