import { Avatar, Badge, Button, Input, InputNumber, message, Modal, Space, Spin, Switch, Table, Tag, Tooltip } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { IoMdEye } from 'react-icons/io';
import { useNavigate } from 'react-router';
import { vendorApprove, vendorBlock } from '@services/apiVendor';
import { FaUserTie } from 'react-icons/fa6';
import { IoStorefront } from 'react-icons/io5';
import { useState } from 'react';
import { settleVendorWallet } from '../../../../services/admin/apiWallet';
import EditVendorBasicModal from './EditVendorBasicModal';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const VendorTable = ({ data, searchText, onDelete, loading, onSettleSuccess, fetchVendor, hasPermission }) => {
    const navigate = useNavigate();
    const [isSettleModalVisible, setIsSettleModalVisible] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [settleAmount, setSettleAmount] = useState(0);
    const [remarks, setRemarks] = useState('');

    const [isCommissionModalVisible, setIsCommissionModalVisible] = useState(false);
    const [commissionValue, setCommissionValue] = useState(null);
    const [payoutType, setPayoutType] = useState('weekly');
    const [approvingVendor, setApprovingVendor] = useState(null);

    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);

    const openSettleModal = (vendor) => {
        setSelectedVendor(vendor);
        setSettleAmount(vendor.wallet_balance);
        setRemarks('');
        setIsSettleModalVisible(true);
    };

    const handleSettle = async () => {
        if (settleAmount !== selectedVendor?.wallet_balance) {
            message.error("Settle total amount in single time");
            return;
        }

        const data = {
            amount: settleAmount,
            remark: remarks
        };

        try {
            await settleVendorWallet(data, selectedVendor._id);
            message.success("Settlement done successfully");
            setIsSettleModalVisible(false);
            onSettleSuccess(selectedVendor._id); // Callback to update the table data
        } catch (error) {
            console.error("Something went wrong:", error);
            message.error("Failed to settle the wallet");
        }
    };

    const handleApproveToggle = (checked, vendor) => {
        if (vendor.status) {
            // Already approved: don't allow unapproving
            message.warning("Vendor already approved. You can only block/unblock.");
            return;
        }

        if (checked) {
            // Show modal to set commission
            setApprovingVendor(vendor);
            setCommissionValue(null);
            setIsCommissionModalVisible(true);
        }
    };

    const handleApproveWithCommission = async () => {
        if (commissionValue === null || commissionValue < 0) {
            message.error("Please enter a valid commission percentage.");
            return;
        }

        try {
            await vendorApprove(approvingVendor._id, true, commissionValue, payoutType);
            message.success("Vendor approved successfully with payout settings.");
            setIsCommissionModalVisible(false);
            setApprovingVendor(null);
            setCommissionValue(null);
            setPayoutType('weekly');
            fetchVendor();
        } catch (error) {
            console.error(error);
            message.error("Failed to approve vendor.");
        }
    };


    const columns = [
        {
            title: 'Avatar',
            key: 'avatar',
            align: "center",
            render: (_, { profileImg, name }) => (
                <Avatar size={40} style={{ backgroundColor: '#f56a00' }}>
                    {profileImg ? <img src={`${BASE_URL}/${profileImg}`} alt={name} /> : <FaUserTie />}
                </Avatar>
            )
        },
        { title: 'Owner Name', dataIndex: 'name', key: 'name', align: "center" },
        { title: 'User Name', dataIndex: 'userId', key: 'userId', align: "center" },
        { title: 'Mobile no', dataIndex: 'mobile', key: 'mobile', align: "center" },
        { title: 'Email', dataIndex: 'email', key: 'email', align: "center" },
        { title: 'Approve', dataIndex: 'status', key: 'status', align: "center", render: (_, record) => (<Switch defaultChecked={record.status} disabled={record.status} onChange={(checked) => handleApproveToggle(checked, record)} />) },
        { title: 'Commission Rate', dataIndex: 'commission', key: 'commission', align: "center", render: (commission) => (<><Badge color={commission > 0 ? 'green' : 'red'} count={`${commission}%`} /></>) },
        {
            title: 'Payout Schedule', dataIndex: 'payoutType', key: 'payoutType', align: "center", render: (payoutType) => {
                if (!payoutType) return <Tag color="gray">Not Set</Tag>;
                const colorMap = { 'daily': 'green', 'weekly': 'blue', 'monthly': 'purple' };
                return (<Tag color={colorMap[payoutType] || 'gray'}> {payoutType?.charAt(0).toUpperCase() + payoutType?.slice(1)} </Tag>);
            }
        },
        { title: 'Block', dataIndex: 'isBlocked', key: 'isBlocked', align: "center", render: (_, record) => (<Switch defaultChecked={record.isBlocked} onChange={(checked) => vendorBlock(record._id, checked)} />) },
        {
            title: 'Action',
            key: 'action',
            align: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Shops">
                        <Badge count={record.shopCount} showZero size='small'>
                            <Button
                                type="primary"
                                icon={<IoStorefront />}
                                onClick={() => navigate(`/admin/vendor/shops/${record._id}`)}
                            />
                        </Badge>
                    </Tooltip>
                    {hasPermission(['VIEW_VENDOR_DETAILS']) && (
                        <Tooltip title="Details"><Button type="primary" icon={<IoMdEye />} onClick={() => navigate(`/admin/vendor/${record._id}`)} /></Tooltip>
                    )}

                    {hasPermission(['UPDATE_VENDOR']) && (
                        <Tooltip title="Edit Vendor">
                            <Button type="primary" icon={<FaEdit />}
                                onClick={() => {
                                    setEditingVendor(record);
                                    setIsEditModalVisible(true);
                                }}
                            />
                        </Tooltip>
                    )}

                    {hasPermission(['DELETE_VENDOR']) && (
                        <Tooltip title="Delete">
                            <Button
                                type="primary"
                                danger
                                icon={<FaTrash />}
                                onClick={() => onDelete(record)}
                            />
                        </Tooltip>
                    )}
                </Space>
            )
        }
    ];

    const filteredData = data.filter(item =>
        item.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="_id"
                scroll={{ x: true }}
                bordered={false}
                size='small'
                loading={loading}
            />

            {/* settlement modal */}
            <Modal
                title={`Settle Amount - ${selectedVendor?.name}`}
                open={isSettleModalVisible}
                onCancel={() => setIsSettleModalVisible(false)}
                onOk={handleSettle}
                okText="Settle"
            >
                <p><strong>Current Wallet:</strong> ₹{selectedVendor?.wallet_balance || 0}</p>
                <InputNumber
                    placeholder="Enter amount to settle"
                    value={settleAmount}
                    min={0}
                    onChange={setSettleAmount}
                    style={{ width: '100%', marginBottom: 10 }}
                />
                <Input.TextArea
                    placeholder="Remarks (optional)"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    rows={3}
                />
            </Modal>

            {/* approve modal */}
            <Modal
                title={`Set Commission & Payout for ${approvingVendor?.name}`}
                open={isCommissionModalVisible}
                onCancel={() => {
                    setIsCommissionModalVisible(false);
                    setCommissionValue(null);
                    setPayoutType('weekly');
                }}
                onOk={handleApproveWithCommission}
                okText="Approve"
                width={500}
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Commission Percentage
                        </label>
                        <InputNumber
                            placeholder="Enter commission %"
                            value={commissionValue}
                            min={0}
                            max={100}
                            onChange={setCommissionValue}
                            style={{ width: '100%' }}
                            size="large"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Payout Schedule
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="payoutType"
                                    value="daily"
                                    checked={payoutType === 'daily'}
                                    onChange={(e) => setPayoutType(e.target.value)}
                                    className="mr-2"
                                />
                                Daily Payout
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="payoutType"
                                    value="weekly"
                                    checked={payoutType === 'weekly'}
                                    onChange={(e) => setPayoutType(e.target.value)}
                                    className="mr-2"
                                />
                                Weekly Payout
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="payoutType"
                                    value="monthly"
                                    checked={payoutType === 'monthly'}
                                    onChange={(e) => setPayoutType(e.target.value)}
                                    className="mr-2"
                                />
                                Monthly Payout
                            </label>
                        </div>
                    </div>
                </div>
            </Modal>

            <EditVendorBasicModal
                open={isEditModalVisible}
                vendor={editingVendor}
                onCancel={() => setIsEditModalVisible(false)}
                onSuccess={() => {
                    setIsEditModalVisible(false);
                    fetchVendor();
                }}
            />

        </>
    );
};

export default VendorTable;
