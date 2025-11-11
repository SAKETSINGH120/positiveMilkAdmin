import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { getEarningsChart } from '../../../../services/vendor/apiDashboard';
import { Spin, message } from 'antd';

const EarningChart = () => {
    const [range, setRange] = useState(7);
    const [earningData, setEarningData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEarningChart(range);
    }, [range]);

    const fetchEarningChart = async (range) => {
        setLoading(true);
        try {
            const res = await getEarningsChart(range);
            setEarningData(res.data);
        } catch {
            message.error("Failed to load earnings chart");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Daily Earnings</h2>
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

            {loading ? (
                <div className="flex justify-center items-center h-72">
                    <Spin size="large" />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={earningData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" name="Revenue (₹)" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default EarningChart;
