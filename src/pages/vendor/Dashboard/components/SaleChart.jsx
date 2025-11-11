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
import { Skeleton, message } from 'antd';
import { getSaleChart } from '../../../../services/vendor/apiDashboard';

const SaleChart = () => {
    const [saleData, setSaleData] = useState([]);
    const [range, setRange] = useState(7);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSaleChart(range);
    }, [range]);

    const fetchSaleChart = async (range) => {
        setLoading(true);
        try {
            const res = await getSaleChart(range);
            setSaleData(res.data);
        } catch {
            message.error("Failed to load sales chart");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Sales Overview</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => setRange(7)}
                        className={`${range === 7 ? 'font-bold' : ''}`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setRange(30)}
                        className={`${range === 30 ? 'font-bold' : ''}`}
                    >
                        Last 30 Days
                    </button>
                </div>
            </div>

            <Skeleton active loading={loading}>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={saleData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="food" name="Food Sales (₹)" stroke="#8884d8" />
                        <Line type="monotone" dataKey="mart" name="Mart Sales (₹)" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </Skeleton>
        </div>
    );
};

export default SaleChart;
