import { Avatar, Button, Space, Switch, Table, Tag, Input } from "antd";
import { FaTrash, FaUser, FaHistory } from "react-icons/fa";
import { IoMdEye, IoMdWallet } from "react-icons/io";
import { useNavigate } from "react-router";
import { useState, useMemo } from "react";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const UserTable = ({
  data,
  onToggleBlock,
  loading,
  onShowHistory = () => { },
  onWalletClick = () => { },
}) => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const handleBlockToggle = (checked, record) => {
    onToggleBlock(record._id, checked);
  };

  const getStatusTag = (user) => {
    if (user.isBlocked) {
      return <Tag color="red">Blocked</Tag>;
    }

    if (user.isNewUser) {
      return <Tag color="blue">New</Tag>;
    }

    if (user.isVerified) {
      return <Tag color="green">Verified</Tag>;
    }

    return <Tag color="orange">Unverified</Tag>;
  };

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (!searchText) return data;

    return data.filter(
      (user) =>
        (user.name &&
          user.name.toLowerCase().includes(searchText.toLowerCase())) ||
        (user.mobileNo && user.mobileNo.includes(searchText))
    );
  }, [data, searchText]);

  const columns = [
    {
      title: "Avatar",
      key: "avatar",
      align: "center",
      render: (_, { profileImage }) => {
        const src = profileImage ? `${BASE_URL}/${profileImage}` : undefined;
        return (
          <Avatar
            size={40}
            src={src}
            icon={!src && <FaUser />}
            style={{ backgroundColor: "#f56a00" }}
          />
        );
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Mobile no",
      dataIndex: "mobileNo",
      key: "mobileNo",
      align: "center",
    }, {
      title: "Wallet",
      dataIndex: "wallet",
      key: "wallet",
      align: "center",
    },
    // {
    //   title: "Go Coin",
    //   key: "wallet",
    //   align: "center",
    //   render: (_, record) => <Tag color="default">{record.wallet}</Tag>,
    // },
    {
      title: "Total Bottles",
      key: "totalBottleQuantity",
      align: "center",
      render: (_, record) => (
        <Tag color="blue">{record.totalBottleQuantity || 0}</Tag>
      ),
    },
    {
      title: "Received Bottles",
      key: "totalReceivedBottles",
      align: "center",
      render: (_, record) => (
        <Tag color="green">{record.totalReceivedBottles || 0}</Tag>
      ),
    },
    {
      title: "Remaining Bottles",
      key: "remainingBottles",
      align: "center",
      render: (_, record) => (
        <Tag color="orange">{record.remainingBottles || 0}</Tag>
      ),
    },
    // {
    //   title: "Driver Cash Collection",
    //   key: "DriverCashCollectionStatus",
    //   align: "center",
    //   render: (_, record) => {
    //     const status = record.DriverCashCollectionStatus || "none";
    //     const color = status === "received" ? "green" : status === "pending" ? "orange" : status === "cancelled" ? "red" : "default";
    //     return (
    //       <Tag color={color}>
    //         {status === "none" ? "No Collection" : status.toUpperCase()}
    //       </Tag>
    //     );
    //   },
    // },
    {
      title: "Status",
      key: "status",
      align: "center",
      render: (_, record) => getStatusTag(record),
    },
    {
      title: "Block/Unblock",
      key: "block",
      align: "center",
      render: (_, record) => (
        <Switch
          checked={record.isBlocked}
          onChange={(checked) => handleBlockToggle(checked, record)}
          checkedChildren="Blocked"
          unCheckedChildren="Active"
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<IoMdEye />}
            onClick={() => navigate(`${record._id}`)}
          ></Button>
          <Button
            type="default"
            icon={<IoMdWallet className="text-blue-500" />}
            onClick={() => onWalletClick(record)}
            title="Update Wallet"
          ></Button>
          {/* <Button
            type="default"
            icon={<FaHistory />}
            onClick={() => onShowHistory && onShowHistory(record)}
            title="Show History"
          ></Button> */}
          {/* <Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record)}></Button> */}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4">
        <Input.Search
          placeholder="Search by name or mobile number..."
          allowClear
          enterButton
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 400 }}
        />
      </div>
      <Table
        dataSource={filteredData}
        columns={columns}
        rowKey={(record) => record._id || record.id || record.mobileNo}
        scroll={{ x: true }}
        bordered={false}
        size="small"
        loading={loading}
      />
    </>
  );
};

export default UserTable;
