import React from 'react';
import { Table, Button, Card, Avatar } from 'antd';
import { useNavigate } from 'react-router';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ShopWallet = ({ shopWallets, loading}) => {

    const navigate = useNavigate()

    const columns = [
        {
            title: 'Shop',
            dataIndex: 'name',
            key: 'name',
            render: (name, record) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="square"
                        size={50}
                        src={`${BASE_URL}/${record.shopImage.replace(/\\/g, '/')}`}
                        alt={record.name}
                    />
                    <span>{name || "N/A"}</span>
                </span>
            ),
        },
        {
            title: 'Wallet Balance (₹)',
            dataIndex: 'wallet_balance',
            key: 'wallet_balance',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="link" onClick={() => navigate(`/vendor/wallet/${record._id}`)}>
                    View History
                </Button>
            ),
        },
    ];

    return (
        <>
            <Card>
                <h3 className="text-lg font-semibold mb-4">Shop Wallets</h3>
                <Table
                    columns={columns}
                    dataSource={shopWallets}
                    rowKey="_id"
                    pagination={false}
                    loading={loading}
                />
            </Card>
        </>
    );
};

export default ShopWallet;
