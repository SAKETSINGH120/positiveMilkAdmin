import React, { useEffect, useState } from "react";
import { Table, Card, Spin, Tag, Pagination, message } from "antd";
import { getAllFarmerCollections } from "@services/admin/apiFarmerCollections";

const FarmerCollectionsListing = () => {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchFarmerCollections = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await getAllFarmerCollections(page, limit);

      if (response.status) {
        setCollections(response.data.collections);
        setPagination({
          current: response.data.page,
          pageSize: response.data.limit,
          total: response.data.total,
        });
      }
    } catch (error) {
      message.error("Failed to load farmer collections data");
      console.error("Error fetching farmer collections:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerCollections();
  }, []);

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
    fetchFarmerCollections(page, pageSize);
  };

  const columns = [
    // {
    //   title: "Farmer Name",
    //   dataIndex: "farmerName",
    //   key: "farmerName",
    //   render: (text, record) => (
    //     <div>
    //       <span className="font-medium">{text || "N/A"}</span>
    //       {record.farmerId && (
    //         <div className="text-xs text-gray-500">
    //           ID: {record.farmerId._id?.slice(-8)}
    //         </div>
    //       )}
    //     </div>
    //   ),
    // },
    {
      title: "Driver",
      dataIndex: "driverId",
      key: "driverId",
      render: (driver) => (
        <div>
          <div className="font-medium">{driver?.name || "N/A"}</div>
          {/* <div className="text-xs text-gray-500">
            ID: {driver?._id?.slice(-8)}
          </div> */}
        </div>
      ),
    },
    {
      title: "Milk Type",
      dataIndex: "type",
      key: "type",
      render: (type) => (
        <Tag
          color={
            type === "cow" ? "green" : type === "buffalo" ? "blue" : "default"
          }
        >
          {type?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Fat Percent",
      dataIndex: "fatPercent",
      key: "fatPercent",
      render: (fatPercent) => (
        <span className="font-medium">
          {fatPercent ? `${fatPercent}%` : "N/A"}
        </span>
      ),
    },
    {
      title: "Quantity (Liters)",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => <span className="font-medium">{quantity} L</span>,
    },
    {
      title: "Per Liter Cost",
      dataIndex: "perLtrCost",
      key: "perLtrCost",
      render: (cost) => <span className="font-medium">₹{cost}</span>,
    },
    {
      title: "Total Amount",
      key: "totalAmount",
      render: (_, record) => (
        <span className="font-bold text-green-600">
          ₹{(record.quantity * record.perLtrCost).toFixed(2)}
        </span>
      ),
    },
    {
      title: "Collection Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => (
        <div>
          <div>{new Date(date).toLocaleDateString()}</div>
          <div className="text-xs text-gray-500">
            {new Date(date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="lg:px-10 px-5 my-8">
        <Card title="Farmer Collections Listing">
          <Table
            columns={columns}
            dataSource={collections}
            rowKey="_id"
            loading={loading}
            pagination={false}
            scroll={{ x: 1000 }}
            className=""
          />

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {(pagination.current - 1) * pagination.pageSize + 1} to{" "}
              {Math.min(
                pagination.current * pagination.pageSize,
                pagination.total
              )}{" "}
              of {pagination.total} collections
            </div>
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={handlePageChange}
              showSizeChanger
              showQuickJumper
              pageSizeOptions={["10", "20", "50", "100"]}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FarmerCollectionsListing;
