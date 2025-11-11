import { Tabs, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { changeOrderStatus, getAllOrder } from '../../../services/vendor/apiOrder';
import NewOrder from './components/newOrder';
import AllOrdersTable from './components/AllOrdersTable';
import { useNavigate } from 'react-router';

function Order() {
    const [orders, setOrders] = useState([]);
    const [orderCounts, setOrderCounts] = useState({});
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new');

    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderList(activeTab);
    }, [activeTab]);

    const fetchOrderList = async (type = 'all') => {
        setLoading(true);
        try {
            const res = await getAllOrder(type);
            setOrders(res.orders);
            setOrderCounts(res.counts || {});
        } catch (error) {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = (orderId) => {
        navigate(`${orderId}`);
    };

    const handleStatusChange = async (newStatus, orderId, time) => {
        setLoading(true);
        try {
            const payload = { status: newStatus };
            if ((newStatus === 'preparing' || newStatus === 'delay') && time) {
                payload.preparationTime = time;
            }
            const res = await changeOrderStatus(orderId, payload);
            message.success(`Order marked as ${res.order.orderStatus}`);
            fetchOrderList(activeTab);
        } catch (error) {
            message.error('Failed to update order status');
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const tabItems = [
        {
            label: `New Orders (${orderCounts.new || 0})`,
            key: 'new',
            children: (
                <NewOrder
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            ),
        },
        {
            label: `Accepted Orders (${orderCounts.accepted || 0})`,
            key: 'accepted',
            children: (
                <NewOrder
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            ),
        },
        {
            label: `Preparing Orders (${orderCounts.preparing || 0})`,
            key: 'preparing',
            children: (
                <NewOrder
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            ),
        },
        {
            label: `Ready Orders (${orderCounts.ready || 0})`,
            key: 'ready',
            children: (
                <AllOrdersTable
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            ),
        },
        {
            label: `PickedUp Orders (${orderCounts.pickedup || 0})`,
            key: 'pickedup',
            children: (
                <AllOrdersTable
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            ),
        },
        {
            label: `Running Orders (${orderCounts.running || 0})`,
            key: 'running',
            children: (
                <AllOrdersTable
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            ),
        },
        {
            label: `Delivered Orders (${orderCounts.delivered || 0})`,
            key: 'delivered',
            children: (
                <AllOrdersTable
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            ),
        },
        {
            label: `Cancelled Orders (${orderCounts.cancelled || 0})`,
            key: 'cancelled',
            children: (
                <AllOrdersTable
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            ),
        },
        {
            label: `All Orders (${orderCounts.all || 0})`,
            key: 'all',
            children: (
                <AllOrdersTable
                    data={orders}
                    loading={loading}
                    handleStatusChange={handleStatusChange}
                    onViewDetails={viewDetails}
                />
            ),
        },
    ];

    return (
        <Tabs items={tabItems} activeKey={activeTab} onChange={handleTabChange} />
    );
}

export default Order;
