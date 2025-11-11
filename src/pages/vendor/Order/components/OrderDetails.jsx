import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Card, Typography, Table, Tag, Divider, Row, Col, Button, Spin, message } from 'antd';
import { getOrderDetails } from '../../../../services/vendor/apiOrder';
import { convertDate } from '../../../../utils/formatDate';
import { PrinterOutlined, CalendarOutlined, ClockCircleOutlined, ShopOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getOrderDetails(orderId);
        setOrder(res.order);
      } catch (err) {
        message.error('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handlePrint = () => {
    const downloadUrl = `${BASE_URL}/api/vendor/invoice/${orderId}`;
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.setAttribute('download', `invoice-${order.booking_id}.pdf`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center my-20">
        <Spin size="large" />
      </div>
    );
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: ['productId', 'primary_image'],
      render: (img) => (
        <img
          src={`${BASE_URL}/${img}`}
          alt="Product"
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Product Name & Toppings',
      render: (_, record) => (
        <div>
          <Text strong>{record.productId?.name}</Text>
          {record.toppings?.length > 0 && (
            <ul className="list-disc ml-5 text-sm text-gray-600 mt-1">
              {record.toppings.map((topping, index) => (
                <li key={index}>
                  {topping.name} (+₹{topping.price})
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    },
    {
      title: 'Qty',
      dataIndex: 'quantity',
      align: 'center',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'center',
      render: (val) => `₹${val}`,
    },
    {
      title: 'Total',
      align: 'center',
      render: (_, r) => `₹${r.finalPrice}`,
    },
  ];


  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <Card className="max-w-5xl mx-auto rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <Title level={3}>
            <ShopOutlined className="mr-2" />
            Order ID: {order.booking_id}
          </Title>
          <Button onClick={handlePrint} type="primary" icon={<PrinterOutlined />}>
            Print Invoice
          </Button>
        </div>

        <Row gutter={16} className="mb-4">
          <Col span={6}>
            <Text strong>
              <CalendarOutlined className="mr-2" />
              Delivery Date:
            </Text>
            {convertDate(order.deliveryDate)}
          </Col>
          <Col span={6}>
            <Text strong>
              <ClockCircleOutlined className="mr-2" />
              Time Slot:
            </Text>
            {order.deliveryTime}
          </Col>
          <Col span={6}>
            <Text strong>Order Status:</Text>
            <Tag color="blue">{order.orderStatus?.toUpperCase()}</Tag>
          </Col>
          <Col span={6}>
            <Text strong>Payment Status:</Text>
            <Tag color={order.paymentStatus === 'paid' ? 'green' : 'orange'}>
              {order.paymentStatus?.toUpperCase()}
            </Tag>
          </Col>
        </Row>

        <Divider />
        <Title level={4}>Items Ordered</Title>
        <Table columns={columns} dataSource={order.productData} rowKey={(item) => item.productId._id} pagination={false} bordered size="small" className="mb-4" />

        <Divider />
        <Row gutter={16} className="mb-4">
          <Col span={8}><Text strong>Item Total:</Text> ₹{order.itemTotal}</Col>
          <Col span={8}><Text strong>Packing Charge:</Text> ₹{order.packingCharge}</Col>
          <Col span={8}><Text strong>Delivery Charge:</Text> ₹{order.deliveryCharge}</Col>
        </Row>
        <Row gutter={16} className="mb-4">
          <Col span={8}><Text strong>Coupon Discount:</Text> ₹{order.couponAmount || 0}</Col>
          <Col span={8}><Text strong>After Discount:</Text> ₹{order.afterCouponAmount}</Col>
          <Col span={8}><Text strong>Total Payable:</Text> <Text type="danger" strong>₹{order.finalTotalPrice}</Text></Col>
        </Row>

        <Divider />
        <Row gutter={16}>
          <Col span={12}>
            <Title level={4}>Delivery Address</Title>
            <Card className="mb-4">
              <Text><UserOutlined className="mr-2" />{order.addressId?.personName}</Text><br />
              <Text><HomeOutlined className="mr-2" />{order.addressId?.personMob}</Text><br />
              <Text>{order.addressId?.address1}</Text><br />
              <Text>{order.addressId?.city}, {order.addressId?.state} - {order.addressId?.pincode}</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Title level={4}>Customer Details</Title>
            <Card className="mb-4">
              <Text><UserOutlined className="mr-2" />Name: {order.userId?.name}</Text><br />
              <Text>Phone: {order.userId?.mobileNo}</Text><br />
              <Text>Email: {order.userId?.email}</Text>
            </Card>
          </Col>
        </Row>

        <Divider />
        <Title level={4}>Vendor & Shop Details</Title>
        <Row gutter={16}>
          <Col span={12}>
            <Card>
              <Text strong>Vendor:</Text> {order.vendorId?.name} <br />
              <Text>Email:</Text> {order.vendorId?.email}
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Text strong>Shop:</Text> {order.shopId?.name} <br />
              <Text>Address:</Text> {order.shopId?.address}
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default OrderDetails;
