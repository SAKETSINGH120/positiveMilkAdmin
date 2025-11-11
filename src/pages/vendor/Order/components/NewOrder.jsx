
import { Button, InputNumber, message, Tag, Card, Space, Divider, Row, Col, Skeleton, Modal, } from 'antd';
import { IoMdEye } from 'react-icons/io';
import { convertDate } from '../../../../utils/formatDate';
import { useState, useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const CountdownTimer = ({ startedAt, time, onTimeUp }) => {
    const [remaining, setRemaining] = useState('');

    useEffect(() => {
        const endTime = new Date(startedAt).getTime() + time * 60 * 1000;

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const diff = endTime - now;

            if (diff <= 0) {
                clearInterval(interval);
                setRemaining('Time up!');
                onTimeUp();
            } else {
                const mins = Math.floor(diff / 1000 / 60);
                const secs = Math.floor((diff / 1000) % 60);
                setRemaining(`${mins}m ${secs}s`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [startedAt, time, onTimeUp]);
    return <Tag color="orange">{remaining}</Tag>;
};

const NewOrder = ({ data = [], handleStatusChange, onViewDetails, loading }) => {
    const [prepTime, setPrepTime] = useState({});
    const [delayInput, setDelayInput] = useState({});

    const updatePrepTime = (id, value) => {
        setPrepTime((prev) => ({ ...prev, [id]: value }));
    };

    const updateDelayInput = (id, value) => {
        setDelayInput((prev) => ({ ...prev, [id]: value }));
    };

    const showCancelConfirm = (orderId) => {
        Modal.confirm({
            title: 'Are you sure you want to cancel this order?',
            content: 'This action cannot be undone.',
            okText: 'Yes, Cancel',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                handleStatusChange('cancelled', orderId);
            }
        });
    };

    const currentOrders = data.filter(order =>
        ['pending', 'accepted', 'preparing'].includes(order.orderStatus)
    );

    const renderStatusUI = (record) => {
        const { orderStatus, _id, preparationTime, preparationStartedAt } = record;

        switch (orderStatus) {
            case 'pending':
                return (
                    <div className='flex gap-2 justify-end'>
                        <Button type="primary" danger onClick={() => showCancelConfirm(_id)}>Cancel</Button>
                        <Button type="primary" onClick={() => handleStatusChange('accepted', _id)}>Accept</Button>
                    </div>
                );

            case 'accepted':
                return (
                    <Space>
                        <InputNumber
                            min={1}
                            placeholder="Prep time"
                            addonAfter="min"
                            value={prepTime[_id]}
                            onChange={(val) => updatePrepTime(_id, val)}
                        />
                        <Button
                            type="primary"
                            onClick={() => {
                                if (!prepTime[_id]) {
                                    message.warning('Enter preparation time');
                                    return;
                                }
                                handleStatusChange('preparing', _id, prepTime[_id]);
                            }}
                        >
                            Start Prep
                        </Button>
                    </Space>
                );

            case 'preparing':
                return (
                    <Space direction="vertical">
                        <Space>
                            <CountdownTimer
                                startedAt={preparationStartedAt}
                                time={preparationTime}
                                onTimeUp={() => handleStatusChange('ready', _id)}
                            />
                            <Button type="primary" onClick={() => handleStatusChange('ready', _id)}>
                                Mark Ready
                            </Button>
                        </Space>

                        <Space>
                            <InputNumber
                                min={1}
                                placeholder="Add time"
                                value={delayInput[_id]}
                                onChange={(val) => updateDelayInput(_id, val)}
                            />
                            <Button
                                onClick={() => {
                                    const extra = delayInput[_id];
                                    if (!extra) {
                                        message.warning('Enter delay time');
                                        return;
                                    }

                                    handleStatusChange('delay', _id, extra);
                                    setDelayInput((prev) => ({ ...prev, [_id]: null }));
                                }}
                            >
                                Delay
                            </Button>
                        </Space>
                    </Space>
                );

            case 'ready':
                return <Tag color="blue">Waiting for delivery</Tag>;

            default:
                return <Tag>{orderStatus}</Tag>;
        }
    };

    const renderCurrentOrderCard = (order) => (
        <Card
            key={order._id}
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Order #{order.booking_id}</span>
                    <Tag color="purple" style={{ textTransform: 'capitalize', fontSize: '12px' }}>
                        {order.orderStatus}
                    </Tag>
                </div>
            }
            extra={
                <Button
                    type="primary"
                    icon={<IoMdEye />}
                    onClick={() => onViewDetails(order._id)}
                    style={{ borderRadius: '5px' }}
                >
                    View
                </Button>
            }
            style={{
                margin: '10px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                border: '1px solid #f0f0f0',
                // width: 'calc(100% - 20px)'
                width: '100%'
            }}
            bodyStyle={{ padding: '10px' }}
        >
            <Row gutter={8} style={{ marginBottom: '8px' }}>
                <Col span={12} style={{ fontSize: '12px' }}>
                    <p><b>Delivery Date:</b> {convertDate(order.deliveryDate)}</p>
                </Col>
                <Col span={12} style={{ fontSize: '12px' }}>
                    <p><b>Time Slot:</b> {order.deliveryTime}</p>
                </Col>
            </Row>

            <Divider style={{ margin: '6px 0' }} />

            <div style={{ marginBottom: '8px' }}>
                <b style={{ fontSize: '14px' }}>Items:</b>
                {order.productData?.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
                        <img
                            src={`${BASE_URL}/${item.productId?.primary_image}`}
                            alt={item.productName}
                            width={40}
                            height={40}
                            style={{ borderRadius: '4px', objectFit: 'cover', border: '1px solid #eee' }}
                        />
                        <div style={{ flex: 1, fontSize: '12px' }}>
                            <div><b>{item.productName}</b></div>
                            <div>{item.quantity} × ₹{item.price} = ₹{item.price * item.quantity}</div>
                        </div>
                    </div>
                ))}
            </div>

            <Divider style={{ margin: '6px 0' }} />

            <Row gutter={8} style={{ marginBottom: '6px', fontSize: '12px' }}>
                <Col span={8}><b>Item Total:</b> ₹{order.itemTotal}</Col>
                <Col span={8}><b>Packing:</b> ₹{order.packingCharge}</Col>
                <Col span={8}><b>Delivery:</b> ₹{order.deliveryCharge}</Col>
            </Row>

            <Row gutter={8} style={{ fontSize: '12px' }}>
                <Col span={8}><b>Coupon:</b> ₹{order.couponAmount}</Col>
                <Col span={8}><b>After Discount:</b> ₹{order.afterCouponAmount}</Col>
                <Col span={8}><b><u>Total:</u></b> ₹{order.finalTotalPrice}</Col>
            </Row>

            <Divider style={{ margin: '6px 0' }} />

            <Row gutter={8} style={{ fontSize: '12px' }}>
                <Col span={12}>
                    <b>Payment Mode:</b> {order.paymentMode.toUpperCase()}
                </Col>
                <Col span={12}>
                    <b>Payment Status:</b>{' '}
                    <Tag color={order.paymentStatus === 'Paid' ? 'green' : 'orange'}>
                        {order.paymentStatus.toUpperCase()}
                    </Tag>
                </Col>
            </Row>

            <Divider style={{ margin: '6px 0' }} />

            <div style={{ textAlign: 'right' }}>{renderStatusUI(order)}</div>
        </Card>
    );

    return (
        <Row gutter={16}>
            {loading ? (
                [...Array(2)].map((_, index) => (
                    <Col xs={24} sm={24} md={24} lg={12} key={index}>
                        <Card className="max-w-xl mx-auto rounded-lg shadow-md mb-4">
                            <Row justify="space-between" align="middle">
                                <Skeleton.Input active size="small" style={{ width: 160 }} />
                                <div className="flex gap-2">
                                    <Skeleton.Button active size="small" shape="round" />
                                    <Skeleton.Button active size="small" shape="round" />
                                </div>
                            </Row>

                            <Row gutter={16} className="mt-4 mb-2">
                                <Col span={12}>
                                    <Skeleton.Input active size="small" style={{ width: '100%' }} />
                                </Col>
                                <Col span={12}>
                                    <Skeleton.Input active size="small" style={{ width: '100%' }} />
                                </Col>
                            </Row>

                            <div className="my-3">
                                <Skeleton paragraph={{ rows: 1 }} title={false} active />
                                <div className="flex items-center gap-3 mt-2">
                                    <Skeleton.Avatar active shape="square" size={48} />
                                    <Skeleton.Input active size="small" style={{ width: 120 }} />
                                </div>
                            </div>

                            <Row gutter={16} className="mt-4 mb-2">
                                <Col span={8}><Skeleton.Input active size="small" style={{ width: '100%' }} /></Col>
                                <Col span={8}><Skeleton.Input active size="small" style={{ width: '100%' }} /></Col>
                                <Col span={8}><Skeleton.Input active size="small" style={{ width: '100%' }} /></Col>
                            </Row>

                            <Row gutter={16} className="mb-2">
                                <Col span={8}><Skeleton.Input active size="small" style={{ width: '100%' }} /></Col>
                                <Col span={8}><Skeleton.Input active size="small" style={{ width: '100%' }} /></Col>
                                <Col span={8}><Skeleton.Input active size="small" style={{ width: '100%' }} /></Col>
                            </Row>

                            <Row justify="space-between" align="middle" className="mt-4">
                                <Col><Skeleton.Input active size="small" style={{ width: 150 }} /></Col>
                                <Col><Skeleton.Button active size="small" shape="round" /></Col>
                            </Row>
                        </Card>
                    </Col>
                ))
            ) : currentOrders.length ? (
                currentOrders.map(order => (
                    <Col key={order._id} xs={24} sm={24} md={24} lg={12}>
                        {renderCurrentOrderCard(order)}
                    </Col>
                ))
            ) : (
                <p>No current orders</p>
            )
            }
        </Row >
    );
};

export default NewOrder;
