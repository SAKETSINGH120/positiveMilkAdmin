import React, { useEffect, useState } from 'react';
import { Card, Statistic, Row, Col, Skeleton, message } from 'antd';
import {
    TagsOutlined,
    ShopOutlined,
    ShoppingCartOutlined,
    GiftOutlined,
    DollarCircleOutlined,
    CarOutlined,
    StarOutlined,
} from '@ant-design/icons';
import { getCounts } from '../../../../services/vendor/apiDashboard';

const CountStats = () => {
    const [counts, setCounts] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        setLoading(true)
        try {
            const res = await getCounts();
            setCounts(res.data);
        } catch {
            message.error("Failed to load counts");
        } finally {
            setLoading(false);
        }
    };

    const {
        totalFoodProduct = 0,
        totalMartProduct = 0,
        todayOrder = 0,
        walletBalance = 0,
    } = counts || {};

    const stats = [
        {
            title: 'Total Food Products',
            value: totalFoodProduct,
            icon: <ShopOutlined className="text-green-500 text-xl" />,
        },
        {
            title: 'Total Mart Products',
            value: totalMartProduct,
            icon: <ShoppingCartOutlined className="text-purple-500 text-xl" />,
        },
        {
            title: "Today's Orders",
            value: todayOrder,
            icon: <GiftOutlined className="text-yellow-500 text-xl" />,
        },
        {
            title: 'Wallet Balance',
            value: walletBalance,
            prefix: '₹',
            icon: <DollarCircleOutlined className="text-pink-500 text-xl" />,
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            {stats.map((stat, index) => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={index}>
                    <Card className="rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                        {loading ? (
                            <Skeleton active paragraph={false} />
                        ) : (
                            <>
                                <div className="flex items-center justify-between">
                                    <div className="text-gray-600 font-medium text-sm">{stat.title}</div>
                                    {stat.icon}
                                </div>
                                <Statistic
                                    value={stat.value}
                                    prefix={stat.prefix}
                                    className="mt-2 text-xl font-semibold"
                                />
                            </>
                        )}
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

export default CountStats;
