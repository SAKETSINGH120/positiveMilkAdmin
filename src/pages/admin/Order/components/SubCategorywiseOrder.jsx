import { Table, Tag, message, Card, Typography, Spin } from "antd";
import { ShoppingCartOutlined, CalendarOutlined } from "@ant-design/icons";
import { getSubCategorywiseOrderDetails } from "../../../../services/admin/apiOrder";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

const SubCategorywiseOrders = ({ searchText = "" }) => {
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    fetchSubCategoryData();
  }, []);

  const fetchSubCategoryData = async () => {
    setLoading(true);
    try {
      const response = await getSubCategorywiseOrderDetails();

      if (response?.success && Array.isArray(response?.data)) {
        setSubCategoryData(response.data);
        setDateRange(response.dateRange || null);
      } else {
        console.warn("Invalid response structure:", response);
        setSubCategoryData([]);
        setDateRange(null);
      }
    } catch (error) {
      console.error("Error fetching subcategory data:", error);
      message.error("Error fetching subcategory order details");
      setSubCategoryData([]);
      setDateRange(null);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getSubCategoryName = (record) =>
    record?.subCategoryName ||
    record?.subcategoryName ||
    record?.subCategory ||
    record?.subcategory ||
    record?.name ||
    "Unknown Subcategory";

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
      title: "Subcategory Name",
      key: "subcategoryName",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <ShoppingCartOutlined style={{ color: "#52c41a" }} />
          <Text strong style={{ fontSize: "14px" }}>
            {getSubCategoryName(record)}
          </Text>
        </div>
      ),
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      key: "totalQuantity",
      align: "center",
      render: (quantity) => (
        <Tag
          color={quantity > 10 ? "green" : quantity > 5 ? "orange" : "red"}
          style={{ fontSize: "12px", fontWeight: "bold", padding: "4px 12px" }}
        >
          {quantity} Orders
        </Tag>
      ),
    },
    {
      title: "Progress",
      key: "progress",
      render: (_, record) => {
        const quantities = subCategoryData.map((item) => item?.totalQuantity || 0);
        const maxQuantity = quantities.length > 0 ? Math.max(...quantities) : 1;
        const currentQuantity = record?.totalQuantity || 0;
        const percentage =
          maxQuantity > 0 ? (currentQuantity / maxQuantity) * 100 : 0;

        return (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "120px",
                height: "10px",
                backgroundColor: "#f0f0f0",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percentage}%`,
                  height: "100%",
                  backgroundColor:
                    percentage > 70
                      ? "#52c41a"
                      : percentage > 40
                      ? "#faad14"
                      : "#ff4d4f",
                  borderRadius: "5px",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
            <Text style={{ fontSize: "12px", color: "#666", minWidth: "45px" }}>
              {percentage.toFixed(1)}%
            </Text>
          </div>
        );
      },
    },
  ];

  const filteredData = subCategoryData.filter((item) => {
    const subCategoryName = getSubCategoryName(item);
    const search = (searchText || "").toLowerCase();
    return subCategoryName.toLowerCase().includes(search);
  });

  const totalOrders = subCategoryData.reduce(
    (sum, item) => sum + (item?.totalQuantity || 0),
    0
  );

  return (
    <Card
      className="shadow-sm"
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ShoppingCartOutlined
            style={{ color: "#1890ff", fontSize: "20px" }}
          />
          <div>
            <Title level={5} style={{ margin: 0, color: "#1890ff" }}>
              Subcategory-wise Order Details
            </Title>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Order distribution by product subcategories
            </Text>
          </div>
        </div>
      }
      extra={
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "4px",
            }}
          >
            <CalendarOutlined style={{ color: "#666" }} />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              {dateRange && (
                <>
                  {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
                </>
              )}
            </Text>
          </div>
          <Text strong style={{ color: "#52c41a", fontSize: "14px" }}>
            Total: {totalOrders} orders
          </Text>
        </div>
      }
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <div style={{ marginTop: "16px" }}>
            <Text type="secondary">Loading subcategory data...</Text>
          </div>
        </div>
      ) : filteredData.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <ShoppingCartOutlined
            style={{ fontSize: "48px", color: "#d9d9d9", marginBottom: "16px" }}
          />
          <div>
            <Text type="secondary" style={{ fontSize: "16px" }}>
              {searchText
                ? "No subcategories found matching your search"
                : "No subcategory data available"}
            </Text>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: "16px" }}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Showing {filteredData.length} of {subCategoryData.length} subcategories
            </Text>
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} subcategories`,
            }}
            size="small"
            scroll={{ x: true }}
            className="category-order-table"
            rowClassName={(record, index) =>
              index % 2 === 0 ? "table-row-light" : "table-row-dark"
            }
          />
        </>
      )}
    </Card>
  );
};

export default SubCategorywiseOrders;