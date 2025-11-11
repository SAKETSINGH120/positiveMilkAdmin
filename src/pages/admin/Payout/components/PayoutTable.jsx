import React, { useState, useMemo, useCallback } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Modal,
  Tooltip,
  Badge,
  Avatar,
  Input,
  InputNumber,
  message,
  Select,
} from "antd";
import {
  FaCheck,
  FaTimes,
  FaEye,
  FaUserTie,
  FaUniversity,
  FaCreditCard,
  FaHistory,
} from "react-icons/fa";
import { useNavigate } from "react-router";
import { convertDate } from "../../../../utils/formatDate";
import {
  settleVendorWallet,
  getVendorSettlementHistory,
  settleDriverWallet,
  getDriverSettlementHistory,
} from "../../../../services/admin/apiWallet";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Extracted constants
const WALLET_FILTER_OPTIONS = [
  { value: "all", label: "All Drivers" },
  { value: "balance_gt_0", label: "Balance > 0" },
];

const TABLE_PAGINATION_CONFIG = {
  pageSize: 10,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
};

// Extracted components for better organization
const VendorAvatar = React.memo(({ profileImg, name }) => (
  <Avatar size={40} style={{ backgroundColor: "#f56a00" }}>
    {profileImg ? (
      <img src={`${BASE_URL}/${profileImg}`} alt={name} />
    ) : (
      <FaUserTie />
    )}
  </Avatar>
));

const BankDetailsDisplay = React.memo(({ record }) => (
  <div className="text-left">
    <div>
      <strong>Bank Name:</strong> {record.bankName || "N/A"}
    </div>
    <div>
      <strong>Branch:</strong> {record.branchName || "N/A"}
    </div>
    <div>
      <strong>Account Number:</strong> {record.accountNo || "N/A"}
    </div>
    <div>
      <strong>IFSC Code:</strong> {record.ifsc || "N/A"}
    </div>
    <div>
      <strong>Beneficiary Name:</strong> {record.benificiaryName || "N/A"}
    </div>
  </div>
));

const WalletBalanceDisplay = React.memo(
  ({ balance, record, onSettleClick }) => (
    <Space direction="vertical" size="small">
      <Tag color={balance > 0 ? "green" : "red"}>₹{balance || 0}</Tag>
      <Tooltip title="Settle Amount">
        <Button
          type="primary"
          size="small"
          onClick={() => onSettleClick(record)}
          disabled={!balance || balance <= 0}
        >
          Settle
        </Button>
      </Tooltip>
    </Space>
  )
);

const ActionButtons = React.memo(({ record, onView, onHistory }) => (
  <div className="flex flex-col gap-2">
    <Button icon={<FaEye />} onClick={() => onView(record)} size="small">
      View
    </Button>
    <Button
      type="primary"
      icon={<FaHistory />}
      onClick={() => onHistory(record)}
      size="small"
    >
      History
    </Button>
  </div>
));

const VendorDetailsModal = React.memo(({ visible, vendor, onClose }) => {
  if (!vendor) return null;

  const renderBasicInfo = () => (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <FaUserTie className="mr-2" />
        Basic Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <strong>Name:</strong> {vendor.name}
        </div>
        <div>
          <strong>User ID:</strong> {vendor.userId}
        </div>
        <div>
          <strong>Mobile:</strong> {vendor.mobile}
        </div>
        <div>
          <strong>Alternate Mobile:</strong> {vendor.alternateMobile || "N/A"}
        </div>
        <div>
          <strong>Email:</strong> {vendor.email}
        </div>
        <div>
          <strong>Commission:</strong> {vendor.commission || 0}%
        </div>
        <div>
          <strong>Payout Type:</strong>
          <Tag
            color={
              vendor.payoutType === "weekly"
                ? "blue"
                : vendor.payoutType === "daily"
                ? "green"
                : "purple"
            }
            className="ml-2"
          >
            {vendor.payoutType?.charAt(0).toUpperCase() +
              vendor.payoutType?.slice(1) || "Not Set"}
          </Tag>
        </div>
        <div>
          <strong>Status:</strong>
          <Tag color={vendor.status ? "green" : "red"} className="ml-2">
            {vendor.status ? "Active" : "Inactive"}
          </Tag>
        </div>
      </div>
    </div>
  );

  const renderBankDetails = () => (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <FaUniversity className="mr-2" />
        Bank Details
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <strong>Bank Name:</strong> {vendor.bankName || "N/A"}
        </div>
        <div>
          <strong>Branch:</strong> {vendor.branchName || "N/A"}
        </div>
        <div>
          <strong>Account Number:</strong> {vendor.accountNo || "N/A"}
        </div>
        <div>
          <strong>IFSC Code:</strong> {vendor.ifsc || "N/A"}
        </div>
        <div>
          <strong>Beneficiary Name:</strong> {vendor.benificiaryName || "N/A"}
        </div>
        <div>
          <strong>PAN Number:</strong> {vendor.panNo || "N/A"}
        </div>
        <div>
          <strong>GST Number:</strong> {vendor.gstNo || "N/A"}
        </div>
        {/* <div><strong>Food License:</strong> {vendor.foodLicense || 'N/A'}</div> */}
      </div>
    </div>
  );

  const renderWalletInfo = () => (
    <div>
      <h3 className="text-lg font-semibold mb-3 flex items-center">
        <FaCreditCard className="mr-2" />
        Wallet Information
      </h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <strong>Current Balance:</strong>
          <Tag
            color={vendor.wallet_balance > 0 ? "green" : "red"}
            className="ml-2"
          >
            ₹{vendor.wallet_balance || 0}
          </Tag>
        </div>
        <div>
          <strong>Created At:</strong> {convertDate(vendor.createdAt)}
        </div>
        <div>
          <strong>Updated At:</strong> {convertDate(vendor.updatedAt)}
        </div>
      </div>
    </div>
  );

  const renderPayoutInfo = () => {
    if (!vendor.payoutAmount) return null;

    return (
      <div>
        <h3 className="text-lg font-semibold mb-3">Payout Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Payout Amount:</strong> ₹{vendor.payoutAmount}
          </div>
          {vendor.periodStart && vendor.periodEnd && (
            <div>
              <strong>Payout Period:</strong>
              <br />
              {convertDate(vendor.periodStart)} -{" "}
              {convertDate(vendor.periodEnd)}
            </div>
          )}
          {vendor.requestedDate && (
            <div>
              <strong>Requested Date:</strong>{" "}
              {convertDate(vendor.requestedDate)}
            </div>
          )}
          {vendor.processedDate && (
            <div>
              <strong>Processed Date:</strong>{" "}
              {convertDate(vendor.processedDate)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Modal
      title="Vendor Details"
      open={visible}
      footer={<Button onClick={onClose}>Close</Button>}
      onCancel={onClose}
      width={800}
    >
      <div className="space-y-6">
        {renderBasicInfo()}
        {renderBankDetails()}
        {renderWalletInfo()}
        {renderPayoutInfo()}
        {vendor.remarks && (
          <div>
            <strong>Remarks:</strong> {vendor.remarks}
          </div>
        )}
      </div>
    </Modal>
  );
});

const SettlementModal = React.memo(
  ({
    visible,
    vendor,
    settleAmount,
    remarks,
    onSettle,
    onCancel,
    onAmountChange,
    onRemarksChange,
  }) => (
    <Modal
      title={`Settle Amount - ${vendor?.name}`}
      open={visible}
      onCancel={onCancel}
      onOk={onSettle}
      okText="Settle"
    >
      <p>
        <strong>Current Wallet:</strong> ₹{vendor?.wallet_balance || 0}
      </p>
      <InputNumber
        placeholder="Enter amount to settle"
        value={settleAmount}
        min={0}
        onChange={onAmountChange}
        style={{ width: "100%", marginBottom: 10 }}
      />
      <Input.TextArea
        placeholder="Remarks (optional)"
        value={remarks}
        onChange={onRemarksChange}
        rows={3}
      />
    </Modal>
  )
);

const SettlementHistoryModal = React.memo(
  ({ visible, vendor, history, loading, onClose }) => {
    const historyColumns = useMemo(
      () => [
        {
          title: "Sr No",
          key: "sr",
          align: "center",
          render: (_, _r, i) => i + 1,
        },
        {
          title: "Action",
          dataIndex: "action",
          key: "action",
          align: "center",
          render: (action) => (
            <Tag color="green" style={{ textTransform: "capitalize" }}>
              {action}
            </Tag>
          ),
        },
        {
          title: "Amount",
          dataIndex: "amount",
          key: "amount",
          align: "center",
          render: (amount) => <Tag color="blue">₹{amount}</Tag>,
        },
        {
          title: "Balance After Action",
          dataIndex: "balance_after_action",
          key: "balance_after_action",
          align: "center",
          render: (balance) => <Tag color="purple">₹{balance}</Tag>,
        },
        {
          title: "Description",
          dataIndex: "description",
          key: "description",
          align: "center",
          render: (description) => (
            <div style={{ maxWidth: "200px", wordWrap: "break-word" }}>
              {description || "N/A"}
            </div>
          ),
        },
        {
          title: "Date",
          dataIndex: "createdAt",
          key: "createdAt",
          align: "center",
          render: (date) => <Tag color="orange">{convertDate(date)}</Tag>,
        },
      ],
      []
    );

    return (
      <Modal
        title={`Settlement History - ${vendor?.name}`}
        open={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        loading={loading}
      >
        {!loading && history.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No settlement history found for this vendor.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table
              dataSource={history}
              columns={historyColumns}
              pagination={TABLE_PAGINATION_CONFIG}
              rowKey="_id"
            />
          </div>
        )}
      </Modal>
    );
  }
);

export default function PayoutTable({
  data,
  searchText,
  loading,
  onPayoutAction,
  payoutType,
  tabType,
  onSettleSuccess,
}) {
  const nav = useNavigate();

  // State management
  const [view, setView] = useState(null);
  const [isSettleModalVisible, setIsSettleModalVisible] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [settleAmount, setSettleAmount] = useState(0);
  const [remarks, setRemarks] = useState("");
  const [walletFilter, setWalletFilter] = useState("all");
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [settlementHistory, setSettlementHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Memoized callbacks
  const closeViewModal = useCallback(() => setView(null), []);

  const openSettleModal = useCallback((record) => {
    setSelectedVendor(record);
    setSettleAmount(record.wallet_balance || 0);
    setRemarks("");
    setIsSettleModalVisible(true);
  }, []);

  const openHistoryModal = useCallback(
    async (record) => {
      setSelectedVendor(record);
      setIsHistoryModalVisible(true);
      setHistoryLoading(true);

      try {
        const response =
          payoutType === "vendor"
            ? await getVendorSettlementHistory(record._id)
            : await getDriverSettlementHistory(record._id);
        setSettlementHistory(response.history || []);
      } catch (error) {
        console.error("Failed to fetch settlement history:", error);
        setSettlementHistory([]);
      } finally {
        setHistoryLoading(false);
      }
    },
    [payoutType]
  );

  const handleSettle = useCallback(async () => {
    if (settleAmount !== selectedVendor?.wallet_balance) {
      message.error("Settle total amount in single time");
      return;
    }

    const data = { amount: settleAmount, remark: remarks };

    try {
      if (payoutType === "vendor") {
        await settleVendorWallet(data, selectedVendor._id);
      } else {
        await settleDriverWallet(
          { ...data, type: "wallet" },
          selectedVendor._id
        );
      }
      message.success("Settlement done successfully");
      setIsSettleModalVisible(false);
      onSettleSuccess?.(payoutType, tabType);
    } catch (error) {
      console.error("Something went wrong:", error);
      message.error("Failed to settle the wallet");
    }
  }, [
    settleAmount,
    selectedVendor,
    remarks,
    payoutType,
    onSettleSuccess,
    tabType,
  ]);

  const handleView = useCallback((record) => setView(record), []);
  const handleHistory = useCallback(
    (record) => openHistoryModal(record),
    [openHistoryModal]
  );
  const handleSettleClick = useCallback(
    (record) => openSettleModal(record),
    [openSettleModal]
  );

  // Memoized table columns
  const columns = useMemo(
    () => [
      {
        title: "Sr No",
        key: "sr",
        align: "center",
        render: (_, _r, i) => i + 1,
      },
      {
        title: "Avatar",
        key: "avatar",
        align: "center",
        render: (_, record) => (
          <VendorAvatar profileImg={record.profileImg} name={record.name} />
        ),
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
        align: "center",
        render: (name, record) => (
          <Button
            type="link"
            className="p-0"
            onClick={() => nav(`/admin/${payoutType}/${record._id}`)}
          >
            {name}
          </Button>
        ),
      },
      {
        title: "Contacts",
        dataIndex: "contact",
        key: "contact",
        align: "center",
        render: (_, record) => (
          <>
            <p>{record.mobile}</p>
            <p>{record.email}</p>
          </>
        ),
      },
      {
        title: "Bank Details",
        key: "bankDetails",
        align: "center",
        render: (_, record) => <BankDetailsDisplay record={record} />,
      },
      {
        title: "Wallet Balance",
        dataIndex: "wallet_balance",
        key: "wallet",
        align: "center",
        render: (balance, record) => (
          <WalletBalanceDisplay
            balance={balance}
            record={record}
            onSettleClick={handleSettleClick}
          />
        ),
      },
      {
        title: "Commission",
        dataIndex: "commission",
        key: "commission",
        align: "center",
        render: (commission) => (
          <Badge color="blue" count={`${commission || 0}%`} />
        ),
      },
      {
        title: "Action",
        key: "act",
        align: "center",
        render: (_, record) => (
          <ActionButtons
            record={record}
            onView={handleView}
            onHistory={handleHistory}
          />
        ),
      },
    ],
    [nav, payoutType, handleSettleClick, handleView, handleHistory]
  );

  // Memoized filtered data
  const filteredData = useMemo(() => {
    return data.filter((d) => {
      const matchesSearch =
        d.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        d.userId?.toLowerCase().includes(searchText.toLowerCase()) ||
        d.mobile?.includes(searchText) ||
        d.email?.toLowerCase().includes(searchText.toLowerCase());

      const matchesWalletFilter =
        walletFilter === "all" ||
        (walletFilter === "balance_gt_0" && (d.wallet_balance || 0) > 0);

      return matchesSearch && matchesWalletFilter;
    });
  }, [data, searchText, walletFilter]);

  return (
    <>
      {/* Wallet Balance Filter */}
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Select
          value={walletFilter}
          onChange={setWalletFilter}
          style={{ width: 200 }}
          placeholder="Filter by wallet balance"
        >
          {WALLET_FILTER_OPTIONS.map((option) => (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          ))}
        </Select>
      </div>

      <Table
        rowKey="_id"
        loading={loading}
        bordered
        size="small"
        scroll={{ x: true }}
        dataSource={filteredData}
        columns={columns}
        pagination={TABLE_PAGINATION_CONFIG}
      />

      {/* Modals */}
      <VendorDetailsModal
        visible={!!view}
        vendor={view}
        onClose={closeViewModal}
      />

      <SettlementModal
        visible={isSettleModalVisible}
        vendor={selectedVendor}
        settleAmount={settleAmount}
        remarks={remarks}
        onSettle={handleSettle}
        onCancel={() => setIsSettleModalVisible(false)}
        onAmountChange={setSettleAmount}
        onRemarksChange={(e) => setRemarks(e.target.value)}
      />

      <SettlementHistoryModal
        visible={isHistoryModalVisible}
        vendor={selectedVendor}
        history={settlementHistory}
        loading={historyLoading}
        onClose={() => setIsHistoryModalVisible(false)}
      />
    </>
  );
}
