import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { getShopDetails } from '../../../services/admin/apiShop';
import { Card, Descriptions, Image, Spin, message, Row, Col, Divider, Tag } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, HomeOutlined, StarOutlined } from '@ant-design/icons';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function ShopDetails() {
    const { shopId } = useParams();
    const [shopData, setShopData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchShopDetails = async (id) => {
        try {
            setLoading(true);
            const res = await getShopDetails(id);
            if (res?.success) {
                setShopData(res.shop);
            } else {
                message.error(res?.message || "Failed to fetch shop details.");
            }
        } catch (error) {
            console.error("Error fetching shop details:", error);
            message.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShopDetails(shopId);
    }, [shopId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Spin size="large" />
            </div>
        );
    }

    if (!shopData) return null;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Card
                title={
                    <div className="flex items-center">
                        <img
                            src={`${BASE_URL}/${shopData.shopImage}`}
                            alt="Shop Logo"
                            className="w-12 h-12 rounded-full mr-4 shadow-md"
                        />
                        <h2 className="text-2xl font-bold">{shopData.name}</h2>
                    </div>
                }
                className="shadow-xl rounded-2xl"
                bordered={false}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <Image
                            width="100%"
                            height={300}
                            className="rounded-xl object-cover shadow-lg"
                            src={`${BASE_URL}/${shopData.shopImage}`}
                            alt="Shop"
                        />
                    </Col>
                    <Col xs={24} md={12}>
                        <Descriptions title="Shop Info" column={1} bordered size="small" className="shadow-sm">
                            <Descriptions.Item label="Type" icon={<Tag icon={<EnvironmentOutlined />} color="blue">{shopData.shopType}</Tag>}>
                                {shopData.shopType}
                            </Descriptions.Item>
                            <Descriptions.Item label="Phone" icon={<PhoneOutlined />}>
                                {shopData.phone}
                            </Descriptions.Item>
                            <Descriptions.Item label="Rating" icon={<StarOutlined />}>
                                {shopData.rating}
                            </Descriptions.Item>
                            <Descriptions.Item label="Address" icon={<HomeOutlined />}>
                                {shopData.address}
                            </Descriptions.Item>
                            <Descriptions.Item label="City">{shopData.city}</Descriptions.Item>
                            <Descriptions.Item label="State">{shopData.state}</Descriptions.Item>
                            <Descriptions.Item label="Pincode">{shopData.pincode}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                </Row>

                <Divider />

                <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                        <h3 className="text-lg font-medium mb-4">Gallery Images</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {shopData.galleryImage?.map((img, idx) => (
                                <Image
                                    key={idx}
                                    width="100%"
                                    height={150}
                                    src={`${BASE_URL}/${img}`}
                                    className="rounded-lg object-cover shadow-md"
                                />
                            ))}
                        </div>
                    </Col>
                    <Col xs={24} md={12}>
                        <h3 className="text-lg font-medium mb-4">Menu Images</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {shopData.menu?.map((img, idx) => (
                                <Image
                                    key={idx}
                                    width="100%"
                                    height={150}
                                    src={`${BASE_URL}/${img}`}
                                    className="rounded-lg object-cover shadow-md"
                                />
                            ))}
                        </div>
                    </Col>
                </Row>

                <Divider />

                <Descriptions title="Additional Info" column={2} bordered className="shadow-sm">
                    <Descriptions.Item label="Packing Charge">₹{shopData.packingCharge}</Descriptions.Item>
                    <Descriptions.Item label="Delivery Charge">₹{shopData.deliveryCharge}</Descriptions.Item>
                    <Descriptions.Item label="Status">
                        <Tag color={shopData.status === 'active' ? 'green' : 'volcano'}>
                            {shopData.status}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Night Cafe">
                        <Tag color={shopData.isNightCafe ? 'green' : 'red'}>
                            {shopData.isNightCafe ? "Yes" : "No"}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Created At">
                        {new Date(shopData.createdAt).toLocaleDateString()}
                    </Descriptions.Item>
                </Descriptions>
            </Card>
        </div>
    );
}

export default ShopDetails;
