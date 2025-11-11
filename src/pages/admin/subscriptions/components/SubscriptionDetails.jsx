import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  Card,
  Spin,
  message,
  Tag,
  Row,
  Col,
  Divider,
  Avatar,
  Descriptions,
  Table,
} from "antd";
import { getSubscriptionsDetails } from "../../../../services/admin/apiSubscription";
import { convertDate } from "../../../../utils/formatDate";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function SubscriptionDetails() {
  const { id } = useParams();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await getSubscriptionsDetails(id);
        setSubscription(res?.subscriptionData);
      } catch {
        message.error("Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  console.log("subscription", subscription);

  if (loading) return <Spin size="large" />;

  if (!subscription) return null;

  return (
    <div className="lg:px-10 px-5 my-8">
      <Card
        title={
          <span>
            Subscription for <b>{subscription.userId?.name || "-"}</b>
          </span>
        }
        bordered={false}
        style={{
          boxShadow: "0 2px 8px #f0f1f2",
        }}
      >
        <Row gutter={24} align="middle">
          <Col span={6} style={{ textAlign: "center" }}>
            <Avatar
              shape="square"
              size={90}
              src={`${BASE_URL}/${subscription.productId?.primary_image}`}
              style={{ background: "#f5f5f5", marginBottom: 8 }}
            >
              {subscription.productId?.name?.charAt(0)}
            </Avatar>
            <div style={{ fontWeight: 500 }}>
              {subscription.productId?.name || "-"}
            </div>
            <div style={{ color: "#888", fontSize: 13 }}>
              {subscription.productId?.unitOfMeasurement || "-"}
            </div>
          </Col>
          <Col span={18}>
            <Descriptions
              column={1}
              size="middle"
              labelStyle={{ fontWeight: 500 }}
            >
              <Descriptions.Item label="User">
                {subscription.userId?.name || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Quantity">
                {subscription.quantity}
              </Descriptions.Item>
              <Descriptions.Item label="Start Date">
                {subscription.startDate
                  ? new Date(subscription.startDate).toLocaleDateString()
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Frequency">
                {subscription.frequency?.type || "-"}
                {subscription.frequency?.type === "monthly" &&
                  subscription.frequency?.daysOfMonth && (
                    <>
                      {" "}
                      (Days: {subscription.frequency.daysOfMonth.join(", ")})
                    </>
                  )}
                {subscription.frequency?.type === "weekly" &&
                  subscription.frequency?.daysOfWeek && (
                    <> (Days: {subscription.frequency.daysOfWeek.join(", ")})</>
                  )}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                <Tag color={subscription.status === "active" ? "green" : "red"}>
                  {subscription.status?.charAt(0).toUpperCase() +
                    subscription.status?.slice(1)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Product Price">
                ₹
                {subscription.productId?.sellingPrice ||
                  subscription.productId?.mrp ||
                  "-"}
              </Descriptions.Item>
              {/* <Descriptions.Item label="Purchesd At">
                {subscription.createdAt ? new Date(subscription.createdAt).toLocaleString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Updated At">
                {subscription.updatedAt ? new Date(subscription.updatedAt).toLocaleString() : '-'}
              </Descriptions.Item> */}
            </Descriptions>
          </Col>
        </Row>
        <Divider />
        <div>
          <b>Description:</b> {subscription.productId?.description || "N/A"}
        </div>

        {/* Subscription Orders Table */}
        {subscription.orders && subscription.orders.length > 0 ? (
          <>
            <Divider />
            <div style={{ marginTop: 20 }}>
              <h3>Subscription Orders</h3>
              <Table
                dataSource={subscription.orders}
                rowKey="_id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
                style={{ width: "100%" }}
                size="middle"
                columns={[
                  {
                    title: "Booking ID",
                    dataIndex: "booking_id",
                    key: "booking_id",
                    width: 150,
                    render: (text) => (
                      <span style={{ fontWeight: 500 }}>{text}</span>
                    ),
                  },
                  {
                    title: "Delivery Date",
                    dataIndex: "deliveryDate",
                    key: "deliveryDate",
                    width: 120,
                    render: (date) => {
                      // Parse the date and format it to show the intended date (not affected by timezone)
                      const dateObj = new Date(date);
                      return dateObj.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        timeZone: "UTC",
                      });
                    },
                  },
                  {
                    title: "Delivery Time",
                    dataIndex: "deliveryTime",
                    key: "deliveryTime",
                    width: 120,
                  },
                  {
                    title: "Products",
                    dataIndex: "productData",
                    key: "productData",
                    width: 250,
                    render: (products) => (
                      <div>
                        {products.map((product, index) => (
                          <div key={index} style={{ marginBottom: 4 }}>
                            Qty: {product.quantity} × ₹{product.price}
                            {product.toppings &&
                              product.toppings.length > 0 && (
                                <div style={{ fontSize: 12, color: "#666" }}>
                                  Toppings: {product.toppings.join(", ")}
                                </div>
                              )}
                            {product.cookingInstruction && (
                              <div style={{ fontSize: 12, color: "#666" }}>
                                Instructions: {product.cookingInstruction}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: "Delivery Charge",
                    dataIndex: "deliveryCharge",
                    key: "deliveryCharge",
                    width: 130,
                    render: (charge) => `₹${charge}`,
                  },
                  {
                    title: "Packing Charge",
                    dataIndex: "packingCharge",
                    key: "packingCharge",
                    width: 130,
                    render: (charge) => `₹${charge}`,
                  },
                  {
                    title: "Total Price",
                    dataIndex: "finalTotalPrice",
                    key: "finalTotalPrice",
                    width: 120,
                    render: (price) => (
                      <span style={{ fontWeight: 500 }}>₹{price}</span>
                    ),
                  },
                  {
                    title: "Status",
                    dataIndex: "orderStatus",
                    key: "orderStatus",
                    width: 120,
                    render: (status) => {
                      const getStatusColor = (status) => {
                        switch (status?.toLowerCase()) {
                          case "accepted":
                            return "green";
                          case "pending":
                            return "orange";
                          case "delivered":
                            return "blue";
                          case "cancelled":
                            return "red";
                          case "preparing":
                            return "purple";
                          case "out_for_delivery":
                            return "cyan";
                          default:
                            return "default";
                        }
                      };
                      return (
                        <Tag color={getStatusColor(status)}>
                          {status?.charAt(0).toUpperCase() + status?.slice(1)}
                        </Tag>
                      );
                    },
                  },
                ]}
              />
            </div>
          </>
        ) : (
          <div
            style={{
              marginTop: 20,
              padding: "20px",
              textAlign: "center",
              backgroundColor: "#fafafa",
              borderRadius: "4px",
            }}
          >
            <p>No subscription orders found.</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default SubscriptionDetails;
