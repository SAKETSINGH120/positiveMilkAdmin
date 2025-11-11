import React, { useEffect, useState } from 'react';
import { Input, message, Modal, Tabs } from 'antd';
import VendorTable from './components/VendorTable';
import { deleteVendor, getAllVendor } from '../../../services/apiVendor';
import { usePermissions } from '../../../hooks/usePermissions';

function Vendor() {
    const [searchText, setSearchText] = useState('');
    const [dataSource, setDataSource] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new'); // Default tab
    const [vendorCounts, setVendorCounts] = useState({});

    const { hasPermission } = usePermissions();

    const fetchVendor = async () => {
        setLoading(true);
        try {
            const res = await getAllVendor(activeTab); // Pass tab key as type
            setDataSource(res?.vendors || []);
            setVendorCounts(res?.counts || {});
        } catch (error) {
            console.error(error);
            message.error("Failed to fetch vendors.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendor();
    }, [activeTab]); // refetch on tab change

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Delete Vendor',
            content: `Are you sure you want to delete "${record.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await deleteVendor(record._id);
                    message.success("Vendor deleted successfully!");
                    fetchVendor();
                } catch {
                    message.error("Failed to delete vendor.");
                }
            }
        });
    };

    const handleSettleSuccess = (vendorId) => {
        setDataSource(prevData =>
            prevData.map(vendor =>
                vendor._id === vendorId ? { ...vendor, wallet_balance: 0 } : vendor
            )
        );
    };

    const tabItems = [
        { key: 'new', label: `New Vendors (${vendorCounts.new || 0})` },
        { key: 'approve', label: `Approved Vendors (${vendorCounts.approve || 0})` },
        { key: 'unapprove', label: `Unapproved Vendors (${vendorCounts.unapprove || 0})` },
        { key: 'block', label: `Blocked Vendors (${vendorCounts.block || 0})` },
        { key: 'all', label: `All Vendors (${vendorCounts.all || 0})` },
    ];

    return (
        <>
            <div className="px-5 lg:px-10">
                <Tabs
                    activeKey={activeTab}
                    onChange={(key) => setActiveTab(key)}
                    items={tabItems}
                    className="my-4"
                />

                <div className='mb-6 md:flex items-center gap-4 justify-between'>
                    <Input.Search
                        placeholder="Search by name"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ maxWidth: 300, borderRadius: '6px' }}
                        size="large"
                    />
                </div>

                <VendorTable
                    data={dataSource}
                    searchText={searchText}
                    onDelete={handleDelete}
                    loading={loading}
                    onSettleSuccess={handleSettleSuccess}
                    fetchVendor={fetchVendor}
                    hasPermission={hasPermission}
                />
            </div>
        </>
    );
}

export default Vendor;
