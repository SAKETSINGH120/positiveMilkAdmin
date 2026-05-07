import { Modal, Tabs, message } from "antd";
import React, { useEffect, useState } from "react";
import UserTable from "./components/UserTable";
import WalletHistoryTable from "./components/WalletHistoryTable";
import WalletUpdateModal from "./components/WalletUpdateModal";
import WalletDeductModal from "./components/WalletDeductModal";
import GocoinHistoryModal from "./components/GocoinHistoryModal";
import {
  getAllUser,
  blockUser,
  getUserGocoinHistory,
  updateUserWallet,
  deductUserBalance,
} from "../../../services/admin/apiUser";

function User() {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("new");
  const [userCounts, setUserCounts] = useState({
    all: 0,
    new: 0,
    verified: 0,
    unverified: 0,
    block: 0,
  });

  // History modal state
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [gocoinHistory, setGocoinHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Wallet modal state
  const [isWalletModalVisible, setIsWalletModalVisible] = useState(false);
  const [selectedWalletUser, setSelectedWalletUser] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  // Deduct modal state
  const [isDeductModalVisible, setIsDeductModalVisible] = useState(false);
  const [selectedDeductUser, setSelectedDeductUser] = useState(null);
  const [deductLoading, setDeductLoading] = useState(false);

  const fetchUser = async (type = activeTab) => {
    setLoading(true);
    try {
      const res = await getAllUser(type);
      setUser(res.data);
      setUserCounts(res.counts);
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

  const handleOpenWalletModal = (user) => {
    setSelectedWalletUser(user);
    setIsWalletModalVisible(true);
  };

  const handleCloseWalletModal = () => {
    setIsWalletModalVisible(false);
    setSelectedWalletUser(null);
  };

  const handleUpdateWallet = async (userId, data) => {
    setWalletLoading(true);
    try {
      await updateUserWallet(userId, data);
      message.success("Wallet updated successfully");
      handleCloseWalletModal();
      fetchUser();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update wallet");
    } finally {
      setWalletLoading(false);
    }
  };

  const handleOpenDeductModal = (user) => {
    setSelectedDeductUser(user);
    setIsDeductModalVisible(true);
  };

  const handleCloseDeductModal = () => {
    setIsDeductModalVisible(false);
    setSelectedDeductUser(null);
  };

  const handleDeductBalance = async (userId, data) => {
    setDeductLoading(true);
    try {
      await deductUserBalance(userId, data);
      message.success("Balance deducted successfully");
      handleCloseDeductModal();
      fetchUser();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Failed to deduct balance",
      );
    } finally {
      setDeductLoading(false);
    }
  };

  const handleDelete = (user) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete "${user.name}"?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        // console.log('Deleting category:', user);
      },
    });
  };
  console.log("userCounts", userCounts);
  const tabItems = [
    {
      key: "new",
      label: `New (${userCounts.new})`,
    },
    {
      key: "verified",
      label: `Verified (${userCounts.verified})`,
    },
    {
      key: "unverified",
      label: `Unverified (${userCounts.unverified})`,
    },
    {
      key: "block",
      label: `Blocked (${userCounts.block})`,
    },
    {
      key: "all",
      label: `All (${userCounts.all})`,
    },
    {
      key: "Wallet History",
      label: `Wallet History (${userCounts.wallet || 0})`,
    },
  ];

  return (
    <>
      <div className="lg:px-10 px-5 my-8">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="mb-6"
        />

        {activeTab === "Wallet History" ? (
          <WalletHistoryTable data={user} loading={loading} />
        ) : (
          <UserTable
            onDelete={handleDelete}
            data={user}
            onToggleBlock={handleToggleBlock}
            onShowHistory={handleShowHistory}
            onWalletClick={handleOpenWalletModal}
            onDeductClick={handleOpenDeductModal}
            loading={loading}
          />
        )}
      </div>

      {/* Wallet Update Modal */}
      <WalletUpdateModal
        visible={isWalletModalVisible}
        user={selectedWalletUser}
        onUpdate={handleUpdateWallet}
        onClose={handleCloseWalletModal}
        loading={walletLoading}
      />

      {/* Wallet Deduct Modal */}
      <WalletDeductModal
        visible={isDeductModalVisible}
        user={selectedDeductUser}
        onDeduct={handleDeductBalance}
        onClose={handleCloseDeductModal}
        loading={deductLoading}
      />

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
  );
}

export default User;
