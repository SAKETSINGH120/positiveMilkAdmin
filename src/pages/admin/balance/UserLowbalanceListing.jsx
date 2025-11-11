import React, { useEffect, useState } from "react";
import { Table, Input, message } from "antd";
import { getLoweBalanceUserList } from "../../../services/admin/apiLowBalance";

function UserLowBalanceList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const fetchLowBalanceUsers = async () => {
    setLoading(true);
    try {
      const res = await getLoweBalanceUserList();
      console.log("Low balance response:", res);

      setUsers(res.data?.usersWithLowWallet || []);
    } catch {
      message.error("Failed to load low balance users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowBalanceUsers();
  }, []);

  const filteredData = users.filter((item) =>
    item.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name) => name || "-",
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
      render: (mobile) => mobile || "-",
    },
    {
      title: "Wallet Balance",
      dataIndex: "wallet",
      key: "wallet",
      render: (wallet) => wallet ?? "-",
    },
    {
      title: "Subscription Cost",
      dataIndex: "totalSubscriptionCost",
      key: "totalSubscriptionCost",
      render: (v) => v ?? "-",
    },
    {
      title: "Shortage",
      dataIndex: "shortage",
      key: "shortage",
      render: (v) => v ?? "-",
    },
  ];

  return (
    <>
      <div className="lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between">
        <Input.Search
          placeholder="Search by user name"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300, borderRadius: "6px" }}
          size="large"
        />
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey="_id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        className="bg-white rounded-lg shadow"
      />
    </>
  );
}

export default UserLowBalanceList;
