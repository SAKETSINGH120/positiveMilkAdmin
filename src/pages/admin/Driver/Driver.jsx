import React, { useEffect, useState } from 'react';
import { Input, Tabs, Select, message } from 'antd';
import DriverTable from './components/DriverTable';
import { getAllDrivers } from '../../../services/admin/apiDrivers';

const { Option } = Select;

function DriverManagement() {
    const [drivers, setDrivers] = useState([]);
    const [counts, setCounts] = useState({})
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('all');
    const [cashFilter, setCashFilter] = useState('all');

    const fetchDrivers = async (type = 'all') => {
        setLoading(true);
        try {
            const response = await getAllDrivers(type);
            if (response?.status && Array.isArray(response.data)) {
                setDrivers(response.data);
                setCounts(response.counts);
            } else {
                setDrivers([]);
                message.warning("No drivers found.");
            }
        } catch (err) {
            console.error("Error fetching drivers:", err);
            message.error("Failed to load drivers.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { 
        fetchDrivers(activeTab === 'cash-settlement' ? 'all' : activeTab);
    }, [activeTab]);

    const onSettleSuccess = () => {
        fetchDrivers(activeTab === 'cash-settlement' ? 'all' : activeTab);
    }

    const handleTabChange = (key) => {
        setActiveTab(key);
        setSearchText('');
        setCashFilter('all');
    };

    // Filter drivers for cash settlement tab
    const getFilteredDrivers = () => {
        if (activeTab !== 'cash-settlement') {
            return drivers.filter((item) =>
                item?.name?.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        let filtered = drivers.filter((item) =>
            item?.name?.toLowerCase().includes(searchText.toLowerCase())
        );

        // Apply cash filter
        if (cashFilter === 'cash-more-than-0') {
            filtered = filtered.filter(driver => (driver.cashCollection || 0) > 0);
        }

        return filtered;
    };

    const tabItems = [
        
        {
            key: 'new',
            label: `New Drivers (${counts.new})`,
            children: null
        },
        {
            key: 'verified',
            label: `Verified Drivers (${counts.verified})`,
            children: null
        },
        {
            key: 'unverified',
            label: `Unverified Drivers (${counts.unverified})`,
            children: null
        },
        {
            key: 'block',
            label: `Blocked Drivers (${counts.block})`,
            children: null
        },
        {
            key: 'all',
            label: `All Drivers (${counts.all})`,
            children: null
        },
        {
            key: 'cash-settlement',
            label: `Cash Settlement (${counts.all})`,
            children: null
        },
    ];

    return (
        <>
            <div className='lg:px-10 px-5 my-8'>
                <Tabs 
                    activeKey={activeTab} 
                    onChange={handleTabChange}
                    items={tabItems}
                    size="large"
                />
            </div>

            <div className='lg:px-10 px-5 mb-6 md:flex items-center gap-4 justify-between'>
                <div className='flex items-center gap-4'>
                    <Input.Search
                        placeholder="Search by driver name"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ maxWidth: 300, borderRadius: '6px' }}
                        size="large"
                    />
                    {activeTab === 'cash-settlement' && (
                        <Select
                            value={cashFilter}
                            onChange={setCashFilter}
                            style={{ width: 200 }}
                            size="large"
                        >
                            <Option value="all">All Drivers</Option>
                            <Option value="cash-more-than-0">Cash &gt; 0</Option>
                        </Select>
                    )}
                </div>
            </div>

            <DriverTable
                loading={loading}
                searchText={searchText}
                data={getFilteredDrivers()}
                onSettleSuccess={onSettleSuccess}
                activeTab={activeTab}
            />
        </>
    );
}

export default DriverManagement;
