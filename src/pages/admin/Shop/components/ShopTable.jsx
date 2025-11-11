import { Avatar, Button, Space, Table, Tag, Tooltip, Modal, Form, Select } from 'antd';
import { IoMdEye } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { FaEdit, FaStore, FaTrash } from 'react-icons/fa';
import React, { useState } from 'react';
import EditShopModal from './EditShopModal';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ShopTable = ({ data, searchText, loading, fetchShop, hasPermission}) => {
    const navigate = useNavigate();
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);
    // Remove priority and saving state, as EditTopShopModal will handle it

    const handleEditClick = (record) => {
        setSelectedShop(record);
        setEditModalOpen(true);
    };

    const handleCancelEditModal = () => {
        setEditModalOpen(false);
        setSelectedShop(null);
    };

    const columns = [
        {
            title: 'Image',
            key: 'image',
            align: 'center',
            render: (_, record) => (
                <Avatar
                    shape="square"
                    size={50}
                    src={`${BASE_URL}/${record.shopImage.replace(/\\/g, '/')}`}
                    alt={record.name}
                />
            )
        },
        {
            title: 'Shop Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'Type',
            dataIndex: 'shopType',
            key: 'shopType',
            align: 'center',
            filters: [
                { text: 'Veg', value: 'veg' },
                { text: 'Non-Veg', value: 'non-veg' }
            ],
            onFilter: (value, record) => record.shopType === value,
            render: type => (
                <Tag color={type === 'veg' ? 'green' : 'red'}>{type?.toUpperCase()}</Tag>
            )
        },
        {
            title: 'Service',
            key: 'service',
            align: 'center',
            filters: [...new Set(data.map(d => d.serviceId?.name))]
                .filter(Boolean)
                .map(service => ({ text: service, value: service })),
            onFilter: (value, record) => record.serviceId?.name === value,
            render: (_, record) => record.serviceId?.name || 'N/A'
        },
        {
            title: 'Vendor',
            dataIndex: 'vendorId',
            key: 'vendorId',
            align: 'center',
            render: (_, record) => record.vendorId?.name || 'N/A'
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            align: 'center',
            render: (priority) => (
                <Tag color="blue">{priority || "no-priority"}</Tag>
            )
        },
        // {
        //     title: 'Rating',
        //     dataIndex: 'rating',
        //     key: 'rating',
        //     align: 'center'
        // },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center'
        },
        {
            title: 'Product Count',
            dataIndex: 'productCount',
            key: 'productCount',
            align: 'center'
        },
        {
            title: 'Wallet',
            dataIndex: 'wallet',
            key: 'wallet',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tag>₹{record.wallet_balance || 0}</Tag>
                </Space>
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: status => (
                <Tag color={status === 'active' ? 'blue' : 'gray'}>{status}</Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space size="small">
                    {hasPermission(['VIEW_SHOP_DETAILS']) && (<Tooltip title="Details"> <Button type="primary" icon={<IoMdEye />} onClick={() => navigate(`${record._id}`)} /></Tooltip>)}
                    {hasPermission(['UPDATE_SHOP_PRIORITY']) && (<Tooltip title="Edit Priority"> <Button type="primary" icon={<FaEdit />} onClick={() => handleEditClick(record)} /></Tooltip>)}
                </Space>
            )
        }
    ];

    const filteredData = data.filter(item =>
        item.name?.toLowerCase().includes(searchText.toLowerCase()) || item.vendorId.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="_id"
                scroll={{ x: true }}
                bordered={false}
                size="small"
                loading={loading}
            />
            <EditShopModal
                isModalOpen={editModalOpen}
                handleCancel={handleCancelEditModal}
                shopData={selectedShop}
                categoryId={selectedShop?.categoryId?._id || selectedShop?.categoryId}
                fetchShop={fetchShop}
            />
        </>
    );
};

export default ShopTable;
