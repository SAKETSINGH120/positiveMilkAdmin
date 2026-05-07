import { Table, Tag, Card, Typography, Spin } from "antd";
import { WarningOutlined, UserOutlined } from "@ant-design/icons";
import { getFailedOrders } from "../../../services/admin/apiOrder";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

const FailedOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFailedOrders();
  }, []);

  const fetchFailedOrders = async () => {
    setLoading(true);
    try {
      const response = await getFailedOrders();
      if (response?.success && Array.isArray(response?.orders)) {
        setOrders(response.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => (
        <Text strong style={{ color: "#1890ff" }}>
          {index + 1}
        </Text>
      ),
    },
    {
      title: "Customer Name",
      key: "customerName",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <UserOutlined style={{ color: "#1890ff" }} />
          <Text strong>{record?.userId?.name || "N/A"}</Text>
        </div>
      ),
    },
    {
      title: "Mobile No.",
      key: "mobileNo",
      render: (_, record) => <Text>{record?.userId?.mobileNo || "N/A"}</Text>,
    },
    {
      title: "Razorpay Order ID",
      dataIndex: "razorpayOrderId",
      key: "razorpayOrderId",
      render: (id) => (
        <Text code style={{ fontSize: "12px" }}>
          {id || "N/A"}
        </Text>
      ),
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products) =>
        Array.isArray(products) && products.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {products.map((p, i) => (
              <Tag key={i} color="blue">
                {p.name} × {p.qty}
              </Tag>
            ))}
          </div>
        ) : (
          <Text type="secondary">No products</Text>
        ),
    },
    {
      title: "Status",
      key: "status",
      render: () => (
        <Tag color="red" icon={<WarningOutlined />}>
          Failed
        </Tag>
      ),
    },
    {
      title: "Error Logs.",
      key: "errLog",
      render: (_, record) => <Text>{record?.errLog || "N/A"}</Text>,
    },
  ];

  return (
    <div className="p-4">
      <Card
        className="shadow-sm"
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <WarningOutlined style={{ color: "#ff4d4f", fontSize: "20px" }} />
            <div>
              <Title level={5} style={{ margin: 0, color: "#ff4d4f" }}>
                Failed Orders
              </Title>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                Orders that failed during payment processing
              </Text>
            </div>
          </div>
        }
        extra={
          <Tag color="red" style={{ fontSize: "13px", padding: "4px 12px" }}>
            Total: {orders.length}
          </Tag>
        }
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Spin size="large" />
            <div style={{ marginTop: "16px" }}>
              <Text type="secondary">Loading failed orders...</Text>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <WarningOutlined
              style={{
                fontSize: "48px",
                color: "#d9d9d9",
                marginBottom: "16px",
              }}
            />
            <div>
              <Text type="secondary" style={{ fontSize: "16px" }}>
                No failed orders found
              </Text>
            </div>
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} orders`,
            }}
            size="small"
            scroll={{ x: true }}
          />
        )}
      </Card>
    </div>
  );
};

export default FailedOrders;
