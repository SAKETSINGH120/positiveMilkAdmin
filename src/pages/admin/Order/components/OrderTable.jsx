import { Button, Space, Table, Tag, Modal, Select, message } from "antd";
import { FaTrash } from "react-icons/fa";
import { IoMdEye } from "react-icons/io";
import { useNavigate } from "react-router";
import {
  getAllOrder,
  AssignDriver,
  getAllDrivers,
} from "../../../../services/admin/apiOrder";
import { useEffect, useState } from "react";
import { convertDate } from "../../../../utils/formatDate";
import RefundModal from "./RefundModal";

const { Option } = Select;

const OrderTable = ({ searchText, type, service, onCountsUpdate }) => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);

  useEffect(() => {
    fetchOrderList(type);
  }, [type, service]);

  const fetchOrderList = async (type) => {
    setLoading(true);
    try {
      const res = await getAllOrder(service, type);
      console.log(res.orders[0], "ressssssssssssssss");
      setOrders(res.orders || []);
      if (res.counts && onCountsUpdate) {
        onCountsUpdate(res.counts);
      }
    } catch (error) {
      console.log(error);
      message.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fetchDrivers = async () => {
    try {
      const res = await getAllDrivers();
      setDrivers(res.driverList || []);
    } catch (error) {
      message.error("Error fetching driver list");
    }
  };

  const handleViewDetails = (record) => {
    navigate(`/admin/order/${service}/${record._id}`);
  };

  const handleRefund = (record) => {
    setSelectedOrder(record);
    setRefundModalVisible(true);
  };

  const handleRefundSuccess = () => {
    fetchOrderList(type);
  };

  const handleRefundCancel = () => {
    setRefundModalVisible(false);
    setSelectedOrder(null);
  };

  const handleAssignModal = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Please select at least one order");
      return;
    }
    fetchDrivers();
    setAssignModalVisible(true);
  };

  const handleAssignDriver = async () => {
    if (!selectedDriver) {
      message.warning("Please select a driver");
      return;
    }

    const payload = {
      orderIds: selectedRowKeys,
      driverId: selectedDriver,
    };
    console.log(payload, "fjjjjjjjjjjjjjjjjjj");
    try {
      await AssignDriver(payload);

      message.success("Orders assigned successfully");
      setAssignModalVisible(false);
      setSelectedRowKeys([]);
      setSelectedDriver(null);
      fetchOrderList(type);
    } catch (error) {
      message.error("Error assigning orders");
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "booking_id",
      key: "booking_id",
      align: "center",
    },
    {
      title: "Phone Number",
      key: "mobileNo",
      align: "center",
      render: (record) => record.userId?.mobileNo,
    },
    {
      title: "Delivery Date",
      dataIndex: "deliveryDate",
      key: "deliveryDate",
      align: "center",
      render: (deliveryDate) => `${convertDate(deliveryDate)}`,
    },
    {
      title: "Delivery Time",
      dataIndex: "deliveryTime",
      key: "deliveryTime",
      align: "center",
    },
    {
      title: "Pincode",
      dataIndex: "pincode",
      key: "pincode",
      align: "center",
      render: (pincode) => `${pincode}`,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      align: "center",
      render: (address) => `${address || "N/A"}`,
    },
    {
      title: "Total Amount",
      dataIndex: "finalTotalPrice",
      key: "finalTotalPrice",
      align: "center",
      render: (amount) => `₹${amount}`,
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      align: "center",
      render: (status) => (
        <Tag
          color={
            status === "delivered"
              ? "green"
              : status === "accepted"
              ? "blue"
              : "orange"
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      align: "center",
      render: (status) => (
        <Tag
          color={
            status == "paid" ? "green" : status == "pending" ? "orange" : "red"
          }
        >
          {status?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Payment Mode",
      dataIndex: "paymentMode",
      key: "paymentMode",
      align: "center",
    },
    {
      title: "Assigned To",
      dataIndex: "assignedDriver",
      key: "assignedDriver",
      align: "center",
      render: (assignedDriver) =>
        assignedDriver ? (
          <Tag color="green">{assignedDriver}</Tag>
        ) : (
          <Tag color="red">Not Assigned</Tag>
        ),
    },
    {
      title: "Order Type",
      dataIndex: "isSubscription",
      key: "isSubscription",
      align: "center",
      render: (isSubscription) =>
        isSubscription === "yes" ? (
          <Tag color="green">{isSubscription}</Tag>
        ) : (
          <Tag color="blue">Normal order</Tag>
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
            onClick={() => handleViewDetails(record)}
          />
          {type === "cancelled" &&
            (record.isRefunded ? (
              <Tag color="green">Refunded Done</Tag>
            ) : (
              <Button
                type="primary"
                style={{ backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
                onClick={() => handleRefund(record)}
              >
                Refund
              </Button>
            ))}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        rowSelection={type === "pending" ? rowSelection : null}
        dataSource={orders.filter((item) =>
          item.booking_id.toLowerCase().includes(searchText.toLowerCase())
        )}
        columns={columns}
        rowKey="_id"
        scroll={{ x: true }}
        bordered
        size="small"
        loading={loading}
      />

      {type === "pending" && (
        <Button
          type="primary"
          onClick={handleAssignModal}
          style={{ marginTop: 16 }}
          disabled={selectedRowKeys.length === 0}
        >
          Assign Order
        </Button>
      )}

      <RefundModal
        visible={refundModalVisible}
        onCancel={handleRefundCancel}
        orderData={selectedOrder}
        onSuccess={handleRefundSuccess}
      />

      <Modal
        title="Assign Driver"
        visible={assignModalVisible}
        onOk={handleAssignDriver}
        onCancel={() => {
          setAssignModalVisible(false);
          setSelectedDriver(null);
        }}
        okText="Assign"
        cancelText="Cancel"
      >
        <Select
          style={{ width: "100%" }}
          placeholder="Select a driver"
          onChange={(value) => setSelectedDriver(value)}
          value={selectedDriver}
        >
          {drivers.map((driver) => (
            <Option key={driver._id} value={driver._id}>
              {driver.name || driver._id}
            </Option>
          ))}
        </Select>
      </Modal>
    </>
  );
};

export default OrderTable;
