import { Avatar, Button, Space, Spin, Switch, Table } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";
import { updateStatus } from "@services/apiCategory";
import { FaShop } from "react-icons/fa6";
import { useNavigate } from "react-router";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CategoryTable = ({
  searchText,
  data,
  onEdit,
  onDelete,
  loading,
  hasPermission,
}) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: "Image",
      key: "avatar",
      align: "center",
      render: (_, { image }) => (
        <Avatar
          size={60}
          style={{
            backgroundColor: "#fff",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          {image ? (
            <img src={`${BASE_URL}/${image}`} />
          ) : (
            <img src="/go-rabit-logo.png" />
          )}
        </Avatar>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "GST (%)",
      dataIndex: "gst",
      key: "gst",
      align: "center",
      render: (gst) => `${gst || 0}%`,
    },
    // {
    //     title: 'Type',
    //     dataIndex: 'type',
    //     key: 'name',
    //     align: "center"
    // },
    {
      title: "Service",
      dataIndex: "serviceId",
      key: "name",
      align: "center",
      render: (_, record) => <>{record.serviceId.name}</>,
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      align: "center",
      render: (_, record) => <>{record.priority || "no-priority"}</>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (_, record) => (
        <Switch
          defaultChecked={record?.status === "active"}
          onChange={(checked) => updateStatus(record._id, checked)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "right",
      render: (_, record) => (
        <Space size="small">
          {
            hasPermission(["SET_TOP_SHOP_IN_CATEGORY"])
            // (
            //     <Button type="primary" icon={<FaShop />} onClick={() => navigate(`top-shops/${record._id}`)}>....</Button>)
          }
          {hasPermission(["UPDATE_CATEGORY"]) && (
            <Button
              type="primary"
              icon={<FaEdit />}
              onClick={() => onEdit(record)}
            >
              Edit
            </Button>
          )}
          {hasPermission(["DELETE_CATEGORY"]) && (
            <Button
              type="primary"
              danger
              icon={<FaTrash />}
              onClick={() => onDelete(record)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const filtredData = data.filter((item) =>
    item?.name?.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Table
      // dataSource={dataSource.filter(item => item.categoryName.toLowerCase().includes(searchText.toLowerCase()))}
      dataSource={filtredData}
      columns={columns}
      rowKey={"_id"}
      scroll={{ x: true }}
      bordered={false}
      size="small"
      loading={loading}
    />
  );
};

export default CategoryTable;
