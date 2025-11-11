import React from 'react';
import { Table, Space, Button, Card, Switch, Tooltip, Badge, Tag } from 'antd';
import { shopClose, shopNightCafe, shopStatus } from '../../../../services/vendor/apiShop';
import { IoMdEye } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { FaEdit, FaPlus } from 'react-icons/fa';
import { IoStorefront } from 'react-icons/io5';

function ShopTable({ shops, handleEdit, loading, fetchAllShop }) {

    const navigate = useNavigate()

    const columns = [
        {
            title: 'Shop Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Service',
            dataIndex: 'service',
            key: 'service',
            render: (_, record) => (record.serviceId.name)
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => (record.shopType)
        },
        {
            title: 'Close',
            dataIndex: 'close',
            key: 'close',
            align: "center",
            render: (_, record) => (
                <Space direction="vertical" align="center">
                    <Switch
                        checked={record.isClose}
                        onChange={async (checked) => {
                            await shopClose(record._id, checked);
                            fetchAllShop();
                        }}
                    />
                    <span style={{ fontSize: '12px', color: record.isClose ? 'red' : 'green' }}>
                        {record.isClose ? 'Closed' : 'Open'}
                    </span>
                </Space>
            )
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: (_, record) => (<Tooltip title="All Products" className='hover:cursor-pointer'><Badge count={record.productCount} showZero color="#52c41a" overflowCount={999} /></Tooltip>)
        },
        // {
        //     title: 'Today Orders',
        //     dataIndex: 'orders',
        //     key: 'orders',
        //     render: (orders) => orders ?? 0,
        // },
        {
            title: 'Wallet',
            dataIndex: 'wallet',
            key: 'wallet',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tag>₹ {record.wallet_balance}</Tag>
                </Space>
            )
        },
        {
            title: 'Night Cafe',
            dataIndex: 'isNightCafe',
            key: 'isNightCafe',
            align: "center",
            render: (_, record) => (
                <Switch defaultChecked={record.isNightCafe} onChange={(checked) => shopNightCafe(record._id, checked)} />
            )
        },
        // {
        //     title: 'Status',
        //     dataIndex: 'status',
        //     key: 'status',
        //     align: "center",
        //     render: (_, record) => (
        //         <Switch defaultChecked={record.status} onChange={(checked) => shopStatus(record._id, checked)} />
        //     )
        // },
        {
            title: 'Action',
            key: 'action',
            align: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="All Products"><Button type="primary" icon={<IoStorefront />} onClick={() => navigate(`/vendor/shop/${record._id}`)}></Button></Tooltip>
                    {/* <Tooltip title="Add Products"><Button type="primary" icon={<FaPlus />} onClick={() => navigate(`/vendor/shop/add/${record._id}`)}></Button></Tooltip> */}
                    <Tooltip title="Edit Shop"><Button type="primary" icon={<FaEdit />} onClick={() => handleEdit(record)}></Button></Tooltip>
                    {/* <Tooltip title="Details"><Button type="primary" icon={<IoMdEye />} onClick={() => navigate(`/admin/vendor/${record._id}`)}></Button></Tooltip> */}
                </Space>
            )
        }
    ];

    return (
        <Card>
            <Table
                columns={columns}
                dataSource={shops}
                rowKey="_id"
                scroll={{ x: true }}
                pagination={shops?.length > 10 ? { pageSize: 10 } : false}
                loading={loading}
            />
        </Card>
    );
}

export default ShopTable;
