import React, { useEffect, useState } from 'react';
import { Card, Spin, Table, Tag, Typography, message } from 'antd';
import { getWallet, getWalletHistory } from '../../../services/vendor/apiWallet';

const { Title } = Typography;

const WalletHistory = () => {
    const [wallet, setWallet] = useState(0);
    const [walletHistoryData, setWalletHistoryData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchWalletAndHistory();
    }, []);

    const convertDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Kolkata",
        });
    };

    const fetchWalletAndHistory = async () => {
        setLoading(true);
        try {
            const walletRes = await getWallet();
            setWallet(walletRes.wallet.wallet_balance);

            const historyRes = await getWalletHistory();
            setWalletHistoryData(historyRes.data);
        } catch (error) {
            // console.log(error)
            message.error("Failed to fetch wallet data");
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'requestedAt',
            key: 'date',
            render: (_, record) => convertDate(record?.createdAt),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => `₹ ${amount}`,
        },
        {
            title: 'Remaing Amount',
            dataIndex: 'balance_after_action',
            key: 'balance_after_action',
            render: (balance_after_action) => `₹ ${balance_after_action}`,
        },
        {
            title: 'Type',
            dataIndex: 'action',
            key: 'action',
            render: (action) => (
                <Tag color={getTagColor(action)}>
                    {action}
                </Tag>
            )
        },
        {
            title: 'Note',
            dataIndex: 'description',
            key: 'description',
        }
    ];

    const getTagColor = (action) => {
        switch (action) {
            case 'credit':
                return 'green';
            case 'debit':
                return 'red';
            case 'commission':
                return 'purple';
            case 'withdrawal':
                return 'orange';
            case 'settlement':
                return 'blue';
            default:
                return 'default';
        }
    };

    return (
        <div className="p-4">
            <Title level={3}>Vendor Wallet History</Title>

            <Card className="mb-4 shadow-sm">
                <Title level={5}>Current Wallet Balance: ₹ {loading ? <Spin size='small' /> : wallet}</Title>
            </Card>

            <Table
                columns={columns}
                dataSource={walletHistoryData}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
                className='mt-3'
            />
        </div>
    );
};

export default WalletHistory;
