import React from 'react';
import CountStats from './components/CountStats';
import SaleChart from './components/SaleChart';
import OrderChart from './components/OrderChart';
import EarningChart from './components/EarningChart';
import OrderListener from '../../../components/orderListeners';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-700">Dashboard Overview</h2>

            <CountStats />

            <SaleChart />

            <OrderChart />

            <EarningChart />
        </div>
    );
};

export default Dashboard;
