import React, { useEffect, useState } from "react";
import { Table, Button, Input, message } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router";
import { getAllSupportQuery } from "../../../services/admin/apiSupport";

function SupportQueryList() {
  const [supportQueries, setSupportQueries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const fetchSupportQueries = async () => {
    setLoading(true);
    try {
      const data = await getAllSupportQuery();
      console.log("support queries data", data);
      setSupportQueries(data.data || []);
    } catch {
      message.error("Failed to load support queries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportQueries();
  }, []);

  const filteredData = supportQueries.filter(
    (query) =>
      query.userId?.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      query.categoryTitlte?.toLowerCase().includes(searchText.toLowerCase()) ||
      query.queryData?.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    {
      title: "User",
      dataIndex: ["userId", "name"],
      key: "user",
      render: (_, record) => record.userId?.name || "-",
    },
    {
      title: "Mobile",
      dataIndex: ["userId", "mobileNo"],
      key: "mobileNo",
      render: (_, record) => record.userId?.mobileNo || "-",
    },
    {
      title: "Category/Title",
      dataIndex: "categoryTitlte",
      key: "categoryTitlte",
      render: (title) => title || "-",
    },
    {
      title: "Query",
      dataIndex: "queryData",
      key: "queryData",
      render: (queryData) =>
        queryData?.length > 80
          ? `${queryData.substring(0, 80)}...`
          : queryData || "-",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) =>
        date
          ? new Date(date).toLocaleString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "-",
    },
    // {
    //   title: "Actions",
    //   key: "actions",
    //   render: (_, record) => (
    //     <Button
    //       icon={<EyeOutlined />}
    //       onClick={() => navigate(`/admin/support/${record._id}`)}
    //     >
    //       View
    //     </Button>
    //   ),
    // },
  ];

  return (
    <>
      <div className="lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between">
        <Input.Search
          placeholder="Search by user, category, or query"
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

export default SupportQueryList;
