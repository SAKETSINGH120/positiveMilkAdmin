import { Modal, Row, Col, Typography, Divider, Card, Image } from 'antd';
import { convertDate } from '../../../../utils/formatDate';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const { Title, Text } = Typography;

const OrderDetailsModal = ({ selectedOrder, isModalVisible, handleModalClose }) => {
    if (!selectedOrder) return null;

    return (
        <Modal
            title={<span className="text-xl font-semibold text-gray-800">Order Details - {selectedOrder.booking_id}</span>}
            open={isModalVisible}
            onCancel={handleModalClose}
            footer={null}
            width={900}
            className="rounded-lg"
        >
            <div className="space-y-6">
                {/* Shop & Vendor Section */}
                <Card className="rounded-lg shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <Title level={5} className="text-base font-semibold text-gray-700">Shop & Vendor Information</Title>
                        <Divider className="my-3" />
                    </div>
                    <Row gutter={16}>
                        <Col span={12} className="mb-3">
                            <div className="flex items-center space-x-2">
                                <Text strong className="text-gray-600">Shop:</Text>
                                <Text className="text-gray-800">{selectedOrder.shopId?.name}</Text>
                            </div>
                        </Col>
                        <Col span={12} className="mb-3">
                            <div className="flex items-center space-x-2">
                                <Text strong className="text-gray-600">Vendor:</Text>
                                <Text className="text-gray-800">{selectedOrder.vendorId?.name}</Text>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Product Details with Image */}
                <Card className="rounded-lg shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <Title level={5} className="text-base font-semibold text-gray-700">Product Details</Title>
                        <Divider className="my-3" />
                    </div>
                    {selectedOrder.productData.map((product, index) => (
                        <Row gutter={24} key={index} className="mb-4">
                            <Col span={8}>
                                <Image
                                    src={`${BASE_URL}/${product.productId?.primary_image}`}
                                    alt="Product"
                                    className="rounded-lg border border-gray-200"
                                    preview={false}
                                />
                            </Col>
                            <Col span={16}>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <Text strong className="text-gray-600">Product Name:</Text>
                                        <Text className="text-gray-800">{product.productId?.name}</Text>
                                    </div>
                                    <div className="flex justify-between">
                                        <Text strong className="text-gray-600">Quantity:</Text>
                                        <Text className="text-gray-800">{product.quantity}</Text>
                                    </div>
                                    <div className="flex justify-between">
                                        <Text strong className="text-gray-600">Unit Price:</Text>
                                        <Text className="text-gray-800">₹ {product.price}</Text>
                                    </div>
                                    <div className="flex justify-between">
                                        <Text strong className="text-gray-600">Final Price:</Text>
                                        <Text className="text-blue-600 font-semibold">₹ {product.finalPrice}</Text>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    ))}
                </Card>

                {/* Pricing Summary */}
                <Card className="rounded-lg shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <Title level={5} className="text-base font-semibold text-gray-700">Pricing Summary</Title>
                        <Divider className="my-3" />
                    </div>
                    <Row gutter={16} className="mb-4">
                        <Col span={12} className="mb-3">
                            <div className="flex justify-between">
                                <Text className="text-gray-600">Item Total:</Text>
                                <Text className="text-gray-800">₹ {selectedOrder.itemTotal}</Text>
                            </div>
                        </Col>
                        <Col span={12} className="mb-3">
                            <div className="flex justify-between">
                                <Text className="text-gray-600">Coupon ({selectedOrder.couponCode || 'N/A'}):</Text>
                                <Text className="text-red-500">- ₹ {selectedOrder.couponAmount}</Text>
                            </div>
                        </Col>
                        <Col span={12} className="mb-3">
                            <div className="flex justify-between">
                                <Text className="text-gray-600">Delivery Charge:</Text>
                                <Text className="text-gray-800">₹ {selectedOrder.deliveryCharge}</Text>
                            </div>
                        </Col>
                        <Col span={12} className="mb-3">
                            <div className="flex justify-between">
                                <Text className="text-gray-600">Packing Charge:</Text>
                                <Text className="text-gray-800">₹ {selectedOrder.packingCharge}</Text>
                            </div>
                        </Col>
                        <Col span={24}>
                            <Divider className="my-2" />
                            <div className="flex justify-between">
                                <Text strong className="text-gray-700">Total Payable:</Text>
                                <Text strong className="text-green-600 text-lg">₹ {selectedOrder.finalTotalPrice}</Text>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Delivery & Payment Info */}
                <Card className="rounded-lg shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <Title level={5} className="text-base font-semibold text-gray-700">Delivery & Payment Information</Title>
                        <Divider className="my-3" />
                    </div>
                    <Row gutter={16}>
                        <Col span={12} className="mb-3">
                            <div className="flex space-x-2">
                                <Text strong className="text-gray-600">Delivery Date:</Text>
                                <Text className="text-gray-800">{convertDate(selectedOrder.deliveryDate)}</Text>
                            </div>
                        </Col>
                        <Col span={12} className="mb-3">
                            <div className="flex space-x-2">
                                <Text strong className="text-gray-600">Delivery Time:</Text>
                                <Text className="text-gray-800">{selectedOrder.deliveryTime}</Text>
                            </div>
                        </Col>
                        <Col span={12} className="mb-3">
                            <div className="flex space-x-2">
                                <Text strong className="text-gray-600">Payment Mode:</Text>
                                <Text className="text-gray-800 capitalize">{selectedOrder.paymentMode}</Text>
                            </div>
                        </Col>
                        <Col span={12} className="mb-3">
                            <div className="flex space-x-2">
                                <Text strong className="text-gray-600">Payment Status:</Text>
                                <Text className={`font-semibold ${selectedOrder.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                                    {selectedOrder.paymentStatus}
                                </Text>
                            </div>
                        </Col>
                    </Row>
                </Card>

                {/* Delivery Address */}
                <Card className="rounded-lg shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <Title level={5} className="text-base font-semibold text-gray-700">Delivery Address</Title>
                        <Divider className="my-3" />
                    </div>
                    <div className="text-gray-800 leading-relaxed">
                        {selectedOrder.addressId?.address1},<br />
                        {selectedOrder.addressId?.address2 && `${selectedOrder.addressId.address2},<br />`}
                        {selectedOrder.addressId?.city}, {selectedOrder.addressId?.state}<br />
                        PIN: {selectedOrder.addressId?.pincode}
                    </div>
                </Card>
            </div>
        </Modal>
    );
};

export default OrderDetailsModal;
