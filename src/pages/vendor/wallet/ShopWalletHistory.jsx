import React, { useEffect, useState } from 'react';
import { Card, Col, message, Row, Switch, Table, Tag } from 'antd';
import { getShopWalletHistory } from '../../../services/vendor/apiWallet';
import { useParams } from 'react-router';

const ShopWalletHistory = () => {

    const { shopId } = useParams();
    // console.log(shopId)

    const [shopDetails, setShopDetails] = useState({});
    const [vendorDetails, setVendorDetails] = useState({});
    const [walletHistory, setWalletHistory] = useState([]);
    const [shopSummary, setShopSummary] = useState({});
    const [loading, setLoading] = useState(false)

    useEffect(() => { fetchShopWalletHistory(shopId) }, [])

    const fetchShopWalletHistory = async (shopId) => {
        setLoading(true)
        try {
            const res = await getShopWalletHistory(shopId);
            setShopDetails(res.shopDetails)
            setVendorDetails(res.vendorDetails)
            setWalletHistory(res.WalletTransactionHistory)
            setShopSummary(res.last7DaysSummary)
        } catch (error) {
            message.error("Something went wrong in wallet")
        } finally {
            setLoading(false)
        }
    }

    const convertDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Kolkata",
        });
    };

    const columns = [
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (_, record) => convertDate(record?.createdAt),
        },
        {
            title: 'Type', dataIndex: 'type', key: 'type',
            render: (type) => (
                <Tag color={type === 'Order Payment' ? 'blue' : 'green'}>{type}</Tag>
            )
        },
        { title: 'Order ID', dataIndex: 'orderId', key: 'orderId' },
        { title: 'Order Amount', dataIndex: 'amount', key: 'amount', render: amt => `₹ ${amt}` },
        { title: 'Commission (%)', dataIndex: 'commission', key: 'commission', render: amt => `${amt} %` },
        { title: 'Commission Amount', dataIndex: 'commission_amount', key: 'commission_amount', render: amt => `₹ ${amt}` },
        { title: 'Final Amount', dataIndex: 'final_amount', key: 'final_amount', render: amt => <strong>₹ {amt}</strong> },
    ];

    return (
        <div className="p-4 mx-auto space-y-6">

            {/* shop details card */}

            <Row gutter={16}>
                <Col  lg={10} md={24}>
                    <Card title="Shop Details" className="bg-gray-50 border border-gray-200 shadow rounded-xl mb-6" loading={loading}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            <div>
                                <div className="text-gray-600">Shop Name</div>
                                <div className="font-semibold text-blue-600 text-lg">{shopDetails.name}</div>
                            </div>
                            <div>
                                <div className="text-gray-600">Wallet Balance</div>
                                <div className="font-semibold text-gray-800 text-lg">₹ {shopDetails.wallet_balance}</div>
                            </div>
                        </div>
                    </Card>
                </Col>
                <Col  lg={14} md={24}>
                    <Card
                        title="Shop Wallet Summary ( Last 7 Days )"
                        className="bg-gray-50 border border-gray-200 shadow rounded-xl"
                        loading={loading}
                    >
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                            <div>
                                <div className="text-gray-600">Total Orders Amount</div>
                                <div className="font-semibold text-blue-600 text-lg">₹ {shopSummary.totalOrdersAmount}</div>
                            </div>
                            <div>
                                <div className="text-gray-600">Total Commission</div>
                                <div className="font-semibold text-red-500 text-lg">₹ {shopSummary.totalCommission}</div>
                            </div>
                            <div>
                                <div className="text-gray-600">Final Wallet Balance</div>
                                <div className="font-bold text-gray-800 text-lg">₹ {shopSummary.finalWalletBalance}</div>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
            <div>

            </div>

            {/* Summary Card */}


            {/* Transaction History Table */}
            <div className='mt-5'>
                <Card title="Wallet Transaction History">
                    <Table
                        dataSource={walletHistory}
                        columns={columns}
                        pagination={{ pageSize: 5 }}
                        bordered
                        rowKey="key"
                        size="middle"
                        loading={loading}
                        scroll={{ x: 'max-content' }}
                    />
                </Card>
            </div>
        </div>
    );
};

export default ShopWalletHistory;
