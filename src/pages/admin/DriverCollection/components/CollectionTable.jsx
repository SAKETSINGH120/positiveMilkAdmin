import React from 'react';
import { Table, Button, Space, Popconfirm, Tag } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import moment from 'moment';

const CollectionTable = ({ data, loading, searchText, onEdit, onDelete }) => {
    const filteredData = data.filter(item => {
        const driverName = item.driverId?.name?.toLowerCase() || '';
        const userName = item.userId?.name?.toLowerCase() || '';
        const search = searchText.toLowerCase();
        return driverName.includes(search) || userName.includes(search);
    });

    const columns = [
        {
            title: 'Driver',
            key: 'driver',
            render: (_, record) => (
                <div>
                    <div>{record.driverId?.name || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{record.driverId?.mobileNo}</div>
                </div>
            )
        },
        {
            title: 'User',
            key: 'user',
            render: (_, record) => (
                <div>
                    <div>{record.userId?.name || 'N/A'}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{record.userId?.mobileNo}</div>
                </div>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amt) => <Tag color="green">₹{amt}</Tag>
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={status === 'received' ? 'blue' : 'orange'}>
                    {status.toUpperCase()}
                </Tag>
            )
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'date',
            render: (date) => moment(date).format('DD-MM-YYYY hh:mm A')
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button icon={<FaEdit />} onClick={() => onEdit(record)} />
                    <Popconfirm
                        title="Delete collection?"
                        onConfirm={() => onDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<FaTrash />} danger />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <Table
            dataSource={filteredData}
            columns={columns}
            loading={loading}
            rowKey="_id"
            bordered
        />
    );
};

export default CollectionTable;
