import { Modal, Tabs, message } from 'antd'
import React, { useEffect, useState } from 'react'
import UserTable from './components/UserTable'
import GocoinHistoryModal from './components/GocoinHistoryModal'
import { getAllUser, blockUser, getUserGocoinHistory } from '../../../services/admin/apiUser'

function User() {
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new');
    const [userCounts, setUserCounts] = useState({
        all: 0,
        new: 0,
        verified: 0,
        unverified: 0,
        block: 0
    });

    // History modal state
    const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [gocoinHistory, setGocoinHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const fetchUser = async (type = activeTab) => {
        setLoading(true);
        try {
            const res = await getAllUser(type);
            setUser(res.data);
            setUserCounts(res.counts)
        } catch {
            message.error("Failed to load user.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser(activeTab);
    }, [activeTab]);

    const handleToggleBlock = async (userId) => {
        try {
            await blockUser(userId);
            message.success("User status update");
            // Refresh data
            fetchUser();
        } catch {
            message.error("Failed to update user status");
        }
    };

    const handleShowHistory = async (user) => {
        setSelectedUser(user);
        setIsHistoryModalVisible(true);
        setHistoryLoading(true);

        try {
            const res = await getUserGocoinHistory(user._id);
            setGocoinHistory(res.data.history || []);
        } catch {
            message.error("Failed to load gocoin history.");
            setGocoinHistory([]);
        } finally {
            setHistoryLoading(false);
        }
    };

    const handleCloseHistoryModal = () => {
        setIsHistoryModalVisible(false);
        setSelectedUser(null);
        setGocoinHistory([]);
    };

    const handleDelete = (user) => {
        Modal.confirm({
            title: 'Delete User',
            content: `Are you sure you want to delete "${user.name}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: () => {
                // console.log('Deleting category:', user);
            }
        });
    };

    const tabItems = [
        {
            key: 'new',
            label: `New (${userCounts.new})`,
        },
        {
            key: 'verified',
            label: `Verified (${userCounts.verified})`,
        },
        {
            key: 'unverified',
            label: `Unverified (${userCounts.unverified})`,
        },
        {
            key: 'block',
            label: `Blocked (${userCounts.block})`,
        },
        {
            key: 'all',
            label: `All (${userCounts.all})`,
        },
    ];

    return (
        <>
            <div className='lg:px-10 px-5 my-8'>

                <Tabs
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    className="mb-6"
                />

                <UserTable
                    onDelete={handleDelete}
                    data={user}
                    onToggleBlock={handleToggleBlock}
                    onShowHistory={handleShowHistory}
                    loading={loading}
                />
            </div>

            {/* Gocoin History Modal */}
            <GocoinHistoryModal
                visible={isHistoryModalVisible}
                user={selectedUser}
                history={gocoinHistory}
                loading={historyLoading}
                onClose={handleCloseHistoryModal}
            />

            {/* modal */}
            {/* <AddSubCategoryModel
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
            /> */}

            {/* edit modal */}
            {/* <EditSubCategoryModel
                isModalOpen={isEditModalOpen}
                handleOk={handleEditOk}
                handleCancel={handleEditCancel}
                categoryData={selectedCategory}
            /> */}
        </>
    )
}

export default User
