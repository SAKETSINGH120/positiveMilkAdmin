import React, { useEffect, useState } from 'react';
import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { Button, message, Spin } from 'antd';
import { getAverageOrderChart } from '../../../../services/admin/apiDashboard';

const AverageOrderChart = () => {
    const [duration, setDuration] = useState('7');
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAverageOrderChart();
    }, [duration]);

    const fetchAverageOrderChart = async () => {
        setLoading(true);
        try {
            const res = await getAverageOrderChart(duration);
            setOrderData(res.data);
        } catch {
            message.error("Failed to load average order chart");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Average Order Value</h2>
                <div className="space-x-2">
                    <Button
                        type={duration === '7' ? 'primary' : 'default'}
                        onClick={() => setDuration('7')}
                    >
                        Last 7 Days
                    </Button>
                    <Button
                        type={duration === '15' ? 'primary' : 'default'}
                        onClick={() => setDuration('15')}
                    >
                        Last 15 Days
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
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={orderData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`₹${value}`, 'Average Order']} />
                        <Legend />
                        <Line 
                            type="monotone" 
                            dataKey="average" 
                            name="Average Order Value (₹)" 
                            stroke="#8884d8" 
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default AverageOrderChart; 