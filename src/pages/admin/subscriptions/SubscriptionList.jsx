import React, { useEffect, useState } from "react";
import { Table, Button, Input, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { getAllSubscription } from "../../../services/admin/apiSubscription";

function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  console.log("subscription", subscriptions);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const data = await getAllSubscription();
      console.log("data", data);
      setSubscriptions(data.subscriptionList);
    } catch {
      message.error("Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const filteredData = subscriptions.filter(
    (sub) =>
      sub.userId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      sub.productId?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "User",
      dataIndex: ["userId", "name"],
      key: "user",
      render: (_, record) => record.userId?.name || "-",
    },
    {
      title: "Product",
      dataIndex: ["productId", "name"],
      key: "product",
      render: (_, record) => record.productId?.name || "-",
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (date) => (date ? new Date(date).toLocaleDateString() : "-"),
    },
    {
      title: "Frequency",
      dataIndex: ["frequency", "type"],
      key: "frequency",
      render: (_, record) => record.frequency?.type || "-",
    },
    {
    title: "Pause Period",
    key: "pausePeriod",
    render: (_, record) => {
      const { pauseStartDate, pauseEndDate } = record;
      if (pauseStartDate && pauseEndDate) {
        return `${new Date(pauseStartDate).toLocaleDateString()} - ${new Date(pauseEndDate).toLocaleDateString()}`;
      }
      return "--";
    },
  },
  {
    title: "Modification Details",
    key: "modificationDetails",
    render: (_, record) => {
      const { modifyStartDate, modifyEndDate, modifyQuantity } = record;
      if (modifyStartDate || modifyEndDate || modifyQuantity) {
        const startDate = modifyStartDate ? new Date(modifyStartDate).toLocaleDateString() : "--";
        const endDate = modifyEndDate ? new Date(modifyEndDate).toLocaleDateString() : "--";
        const quantity = modifyQuantity ?? "--";
        return `Start: ${startDate}, End: ${endDate}, Quantity: ${quantity}`;
      }
      return "--";
    },
  },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => status?.charAt(0).toUpperCase() + status?.slice(1),
    },
    {
      title: "Cancel Reason",
      dataIndex: "cancelReason",
      key: "cancelReason",
      render: (_, record) => record.cancelReason || "N/A",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/subscription/${record._id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between">
        <Input.Search
          placeholder="Search by user or product"
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

export default SubscriptionList;
