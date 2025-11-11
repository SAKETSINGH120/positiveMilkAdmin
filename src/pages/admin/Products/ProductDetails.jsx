import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Breadcrumb, Card, Spin, Image, Descriptions, Tag, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { getProductDetail } from '@services/apiProduct';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductDetails = () => {
    const { produtSlug } = useParams();
    let slugLength = produtSlug.split("-").length;
    let shopName;
    let productName;
    let id;
    if (slugLength == 2) {
        productName = produtSlug.split("-")[0]
        id = produtSlug.split("-")[1]
    } else {
        shopName = produtSlug.split("-")[0]
        productName = produtSlug.split("-")[1]
        id = produtSlug.split("-")[2]
    }

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await getProductDetail(id);
                setProduct(res);
            } catch (error) {
                message.error('Failed to load product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

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

                <Card title={`${productName} Details`}>
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
                                <Descriptions.Item label="Status">
                                    <Tag color={product?.status === 'active' ? 'green' : 'red'}>
                                        {product?.status}
                                    </Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="MRP">₹{product?.mrp}</Descriptions.Item>
                                <Descriptions.Item label="Selling Price">₹{product?.sellingPrice}</Descriptions.Item>
                                <Descriptions.Item label="Discount">{product?.discount}%</Descriptions.Item>
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