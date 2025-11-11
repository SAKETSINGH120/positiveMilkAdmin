import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Breadcrumb, Card, Spin, Image, Descriptions, Tag, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { getProductDetail } from '@services/vendor/apiProduct';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductDetails = () => {
    const { shopId, productId } = useParams();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await getProductDetail(productId);
                setProduct(res);
            } catch (error) {
                message.error('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [productId]);

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <div className="p-4">

            <div className="lg:px-10 px-5 my-8">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                    className="mb-4"
                >
                    Back
                </Button>

                <Card title={`${name} Details`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <Image
                                src={`${BASE_URL}/${product?.primary_image}` || 'https://via.placeholder.com/400'}
                                alt="Product"
                                className="rounded-lg"
                                loading='lazy'
                            />
                            <div className="mt-4 grid grid-cols-3 gap-4">
                                {product?.gallery_image?.map((image, index) => (
                                    <Image
                                        key={index}
                                        src={`${BASE_URL}/${image}`}
                                        alt={`Gallery ${index + 1}`}
                                        className="rounded-lg"
                                        loading='lazy'
                                    />
                                ))}
                            </div>
                        </div>

                        <div>
                            <Descriptions bordered column={1}>
                                <Descriptions.Item label="Name">{product?.name}</Descriptions.Item>
                                <Descriptions.Item label="SKU">{product?.sku}</Descriptions.Item>
                                <Descriptions.Item label="Status">
                                    <Tag color={product?.status === 'active' ? 'green' : 'red'}>
                                        {product?.status}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="MRP">₹{product?.mrp}</Descriptions.Item>
                                <Descriptions.Item label="Your Selling Price">₹{product?.vendorSellingPrice}</Descriptions.Item>
                                <Descriptions.Item label="Unit of Measurement">{product?.unitOfMeasurement}</Descriptions.Item>
                                <Descriptions.Item label="Selling Unit">{product?.sellingUnit}</Descriptions.Item>
                                <Descriptions.Item label="Short Description">{product?.shortDescription}</Descriptions.Item>
                                <Descriptions.Item label="Long Description">{product?.longDescription}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProductDetails;
