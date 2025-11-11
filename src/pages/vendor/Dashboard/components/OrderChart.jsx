import React, { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Button, message, Spin } from 'antd';
import { getOrdersChart } from '../../../../services/vendor/apiDashboard';

const COLORS = ['#8884d8', '#82ca9d'];

const OrderChart = () => {
    const [duration, setDuration] = useState('7');
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchOrderChart();
    }, [duration]);

    const fetchOrderChart = async () => {
        setLoading(true);
        try {
            const res = await getOrdersChart(duration);
            setOrderData(res.data);
        } catch {
            message.error("Failed to load orders chart");
        } finally {
            setLoading(false);
        }
    };

    const pieData = orderData.map(item => ({
        name: item.name,
        value: item.amount,
    }));

    return (
        <div className="p-4 bg-white rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Orders Breakdown</h2>
                <div className="space-x-2">
                    <Button
                        type={duration === '7' ? 'primary' : 'default'}
                        onClick={() => setDuration('7')}
                    >
                        Last 7 Days
                    </Button>
                    <Button
                        type={duration === '30' ? 'primary' : 'default'}
                        onClick={() => setDuration('30')}
                    >
                        Last 30 Days
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-72">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                nameKey="name"
                                label={({ name, value }) => `${name}: ₹${value}`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`₹${value}`, 'Sales']} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                        {orderData.map((item, idx) => (
                            <div key={idx} className="bg-gray-50 p-3 rounded-lg shadow-sm">
                                <strong>{item.name}</strong>
                                <div>Orders: {item.count}</div>
                                <div>Sales: ₹{item.amount}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default OrderChart;
