import React from "react";
import { Table, Switch, Button, Popconfirm } from "antd";
import { FaEdit, FaTrash } from "react-icons/fa";

function ServiceAreaTable({ loading, data, onEdit, onDelete }) {
  const columns = [
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    // {
    //     title: 'Is Food Available',
    //     dataIndex: 'isFoodAvailable',
    //     key: 'isFoodAvailable',
    //     render: (value) => (
    //         <Switch checked={value} disabled />
    //     ),
    // },
    // {
    //     title: 'Is Grocery Available',
    //     dataIndex: 'isGroceryAvailable',
    //     key: 'isGroceryAvailable',
    //     render: (value) => (
    //         <Switch checked={value} disabled />
    //     ),
    // },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<FaEdit />}
            onClick={() => onEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="primary"
            danger
            icon={<FaTrash />}
            onClick={() => onDelete(record)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="_id"
      loading={loading}
      pagination={false}
    />
  );
}

export default ServiceAreaTable;
