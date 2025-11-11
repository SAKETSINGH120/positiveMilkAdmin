import React, { useEffect, useState } from "react";
import { Table, Card, Spin, Tag, Pagination, message } from "antd";
import { getAllFarmers } from "@services/admin/apiFarmers";

const FarmersListing = () => {
  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });

  const fetchFarmers = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      const response = await getAllFarmers(page, limit);

      if (response.status) {
        setFarmers(response.data.farmers);
        setPagination({
          current: response.data.page,
          pageSize: response.data.limit,
          total: response.data.total,
        });
      }
    } catch (error) {
      message.error("Failed to load farmers data");
      console.error("Error fetching farmers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const handlePageChange = (page, pageSize) => {
    setPagination({ ...pagination, current: page, pageSize });
    fetchFarmers(page, pageSize);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: "Mobile No",
      dataIndex: "mobileNo",
      key: "mobileNo",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <small className="text-gray-500">
            {record.city}, {record.state} - {record.pincode}
          </small>
        </div>
      ),
    },
    // {
    //   title: "Driver ID",
    //   dataIndex: "driverId",
    //   key: "driverId",
    //   render: (text) => (
    //     <Tag color="blue" className="text-xs">
    //       {text?.slice(-8)}
    //     </Tag>
    //   ),
    // },
    {
      title: "Location",
      key: "location",
      render: (_, record) => (
        <div className="text-xs">
          <div>Lat: {record.lat}</div>
          <div>Long: {record.long}</div>
        </div>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="p-4">
      <div className="lg:px-10 px-5 my-8">
        <Card title="Farmers Listing">
          <Table
            columns={columns}
            dataSource={farmers}
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
              of {pagination.total} farmers
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

export default FarmersListing;
