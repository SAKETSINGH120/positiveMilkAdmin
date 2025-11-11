import {
    Avatar, Badge, Button, Input, InputNumber, message,
    Modal, Space, Spin, Switch, Table, Tag, Tooltip
} from 'antd';
import { FaEdit, FaTrash, FaUserTie } from 'react-icons/fa';
import { useState } from 'react';
import { updateDriverBlockStatus, updateDriverStatus } from '../../../../services/admin/apiDrivers';
import { settleDriverWallet } from '../../../../services/admin/apiWallet'; // Make sure this is appropriate
import { useNavigate } from 'react-router';
import { IoMdEye } from 'react-icons/io';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const DriverTable = ({ searchText, data, loading, onSettleSuccess, activeTab }) => {
    const [isSettleModalVisible, setIsSettleModalVisible] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [settleAmount, setSettleAmount] = useState(0);
    const [remarks, setRemarks] = useState('');
    const [settleType, setSettleType] = useState('wallet'); // 'wallet' or 'cash'

    const navigate = useNavigate();

    const openSettleModal = (driver, type = 'wallet') => {
        setSelectedDriver(driver);
        setSettleType(type);
        setSettleAmount(type === 'wallet' ? driver.wallet_balance : driver.cashCollection || 0);
        setRemarks('');
        setIsSettleModalVisible(true);
    };

    const handleSettle = async () => {
        const currentAmount = settleType === 'wallet' ? selectedDriver?.wallet_balance : selectedDriver?.cashCollection;
        if (settleAmount !== currentAmount) {
            message.error("Settle total amount in single time");
            return;
        }

        const payload = {
            amount: settleAmount,
            remark: settleType == "wallet" ? `Driver Wallet Setlment ${remarks}` : `Cash Order Setlment ${remarks}`,
            type: settleType
        };

        try {
            await settleDriverWallet(payload, selectedDriver._id); // Adjust API to handle driver + type
            message.success("Settlement done successfully");
            setIsSettleModalVisible(false);
            if (onSettleSuccess) onSettleSuccess(selectedDriver._id);
        } catch (error) {
            console.error("Settlement error:", error);
            message.error("Failed to settle amount");
        } finally {
            onSettleSuccess()
        }
    };

    const handleVerifyStatusChange = async (driverId, checked) => {
        try {
            await updateDriverStatus(driverId, checked);
            if (onSettleSuccess) onSettleSuccess();
        } catch (error) {
            console.error("Error updating verification status:", error);
        }
    };

    const handleBlockStatusChange = async (driverId, checked) => {
        try {
            await updateDriverBlockStatus(driverId, checked);
            if (onSettleSuccess) onSettleSuccess();
        } catch (error) {
            console.error("Error updating block status:", error);
        }
    };

    const columns = [
        {
            title: 'Avatar',
            key: 'avatar',
            align: "center",
            render: (_, { image, name }) => (
                <Avatar size={40} style={{ backgroundColor: '#f56a00' }}>
                    {image ? <img src={`${BASE_URL}/${image}`} alt={name} /> : <FaUserTie />}
                </Avatar>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: "center"
        },
        {
            title: 'Vehicle Type',
            key: 'vehicleType',
            align: "center",
            render: (_, record) => record?.vehicle?.type || '-'
        },
        {
            title: 'Vehicle Model',
            key: 'vehicleModel',
            align: "center",
            render: (_, record) => record?.vehicle?.model || '-'
        },
        {
            title: 'Registration No.',
            key: 'vehicleReg',
            align: "center",
            render: (_, record) => record?.vehicle?.registrationNumber || '-'
        },
        {
            title: 'License No.',
            key: 'licenseNumner',
            align: "center",
            render: (_, record) => record?.licenseNumber || '-'
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status) => (
                <Tag color={status === 'active' ? 'green' : 'red'}>
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Verify',
            dataIndex: 'status',
            key: 'status',
            align: "center",
            render: (_, record) => {
                // Show switch only for new and unverified tabs
                if (activeTab === 'new' || activeTab === 'unverified') {
                    return (
                        <Switch
                            checked={record?.isVerified}
                            onChange={(checked) => handleVerifyStatusChange(record._id, checked)}
                            disabled={record?.isBlocked} // Disable if driver is blocked
                        />
                    );
                }
                // Show tag for other tabs
                return (
                    <Tag color={record?.isVerified ? "green" : "orange"}>
                        {record?.isVerified ? "Verified" : "Unverified"}
                    </Tag>
                );
            }
        },
        {
            title: 'Block',
            dataIndex: 'isBlocked',
            key: 'isBlocked',
            align: "center",
            render: (_, record) => {
                // Only show block switch for verified drivers
                if (activeTab === 'unverified' || activeTab === 'new') {
                    return <Tag color="orange">Not Verified</Tag>;
                }
                return (
                    <Switch
                        checked={record?.isBlocked}
                        onChange={(checked) => handleBlockStatusChange(record._id, checked)}
                    />
                );
            }
        },
        {
            title: 'Cash',
            dataIndex: 'cashCollection',
            key: 'cashCollection',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tag>₹{record.cashCollection || 0}</Tag>
                    {(record.cashCollection || 0) > 0 && activeTab === 'cash-settlement' && (
                        <Tooltip title="Settle Cash">
                            <Button
                                type="default"
                                onClick={() => openSettleModal(record, 'cash')}
                            >
                                Settle
                            </Button>
                        </Tooltip>
                    )}
                </Space>
            )
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tooltip title="View Details">
                        <Button
                            type="primary"
                            icon={<IoMdEye />}
                            onClick={() => navigate(`${record._id}`)}
                        />
                    </Tooltip>
                </Space>
            )
        }

    ];

    const filteredData = data.filter((item) =>
        item?.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Table
                dataSource={filteredData}
                columns={columns}
                rowKey="_id"
                scroll={{ x: true }}
                bordered={false}
                size="small"
                loading={loading}
            />

            <Modal
                title={`Settle ${settleType === 'wallet' ? 'Wallet' : 'Cash'} - ${selectedDriver?.name}`}
                open={isSettleModalVisible}
                onCancel={() => setIsSettleModalVisible(false)}
                onOk={handleSettle}
                okText="Settle"
            >
                <p>
                    <strong>Current {settleType === 'wallet' ? 'Wallet' : 'Cash'}: </strong>
                    ₹{settleType === 'wallet' ? selectedDriver?.wallet_balance : selectedDriver?.cashCollection}
                </p>
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
        </>
    );
};

export default DriverTable;