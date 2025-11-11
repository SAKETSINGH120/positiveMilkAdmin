import React, { useEffect, useState } from 'react';
import {
    Table, Button, Card, Modal, InputNumber, Spin, message,
    Input, Form, Space, Tooltip, Switch
} from 'antd';
import { useNavigate, useParams } from 'react-router';
import {
    getAllProductOfShop, updateProductStatus, updateProductRecommended,
    deleteProduct, updateProduct
} from '@services/vendor/apiProduct';
import { EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { getAllVendor } from '../../../services/apiVendor';
import { getAllCategory, getAllSubCategory } from '../../../services/vendor/apiCategory';
const BASE_URL = import.meta.env.VITE_BASE_URL;

function AllProduct() {
    const [products, setProducts] = useState([]);
    const [vendorDetails, setVendorDetails] = useState();
    const [shopDetails, setShopDetails] = useState();
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [brand, setBrand] = useState([]);
    // const [vendor, setVendor] = useState([]);

    const { shopId } = useParams();
    const navigate = useNavigate();

    const fetchProduct = async (shopId) => {
        setLoading(true);
        try {
            const res = await getAllProductOfShop(shopId);
            if (res?.data?.length === 0) {
                message.error("No products found");
                setProducts([]);
            } else {
                setProducts(res.data.allProduct);
                setVendorDetails(res.data.vendorDetails);
                setShopDetails(res.data.shopDetails);
            }
        } catch (error) {
            message.error('Error fetching product list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchMetaData = async () => {
            const categoryList = await getAllCategory();
            const subCategoryList = await getAllSubCategory();
            // const brandList = await getAllBrand();
            // const vendorList = await getAllVendor();
            setCategories(categoryList);
            setSubCategories(subCategoryList);
            setBrand(brandList);
            setVendor(vendorList);
        };
        fetchMetaData();
    }, []);

    useEffect(() => {
        fetchProduct(shopId);
    }, []);

    const transformedSubCategories = subCategories.reduce((acc, subCat) => {
        const catId = subCat.cat_id._id;
        if (!acc[catId]) acc[catId] = [];
        acc[catId].push(subCat);
        return acc;
    }, {});

    const onDelete = async (id) => {
        try {
            await deleteProduct(id);
            fetchProduct(shopId);
        } catch (error) {
            message.error("Error in deleting product");
        }
    };

    const onEdit = (product) => {
        setCurrentProduct(product);
        setIsEditModalOpen(true);
    };

    const columns = [
        {
            title: '#',
            key: 'avatar',
            align: "center",
            render: (_, { primary_image }) => (
                <div className='flex items-center gap-3'>
                    <img
                        src={`${BASE_URL}/${primary_image}` || '?'}
                        alt="Product"
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 50 }}
                        loading='lazy'
                    />
                </div>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            align: "center"
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            align: "center",
            render: (_, record) => record.categoryId?.name
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            align: "center"
        },
        {
            title: 'Price',
            dataIndex: 'vendorSellingPrice',
            key: 'vendorSellingPrice',
            align: "center",
            render: (value) => `₹ ${value}`
        },
        {
            title: 'Recommended',
            dataIndex: 'isRecommended',
            key: 'isRecommended',
            align: "center",
            render: (_, record) => (
                <Switch defaultChecked={record?.isRecommended} onChange={(checked) => updateProductRecommended(record._id, checked)} />
            )
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: "center",
            render: (_, record) => (
                <Switch defaultChecked={record?.status === "active"} onChange={(checked) => updateProductStatus(record._id, checked)} />
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: "right",
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Add Toppins"><Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/vendor/shop/${shopId}/${record._id}/add-toppins`)} /></Tooltip>
                    <Tooltip title="Details"><Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/vendor/shop/${shopId}/product/${record._id}`)} /></Tooltip>
                    <Tooltip title="Images"><Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(`/vendor/shop/${shopId}/product/${record._id}/images`)} /></Tooltip>
                    <Tooltip title="Edit"><Button type="primary" icon={<FaEdit />} onClick={() => onEdit(record)}></Button></Tooltip>
                    <Tooltip title="Delete"><Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record._id)}></Button></Tooltip>
                </Space>
            )
        }
    ];

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <>
            <Card>
                <div className='flex justify-between mb-4'>
                    <Input.Search
                        placeholder="Search by product name"
                        onChange={(e) => setSearchText(e.target.value)}
                        style={{ maxWidth: 300, borderRadius: '6px' }}
                        size="large"
                    />
                    <div className="flex gap-3">
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => navigate(`/vendor/shop/add/${shopId}`)}
                        >
                            Chooese Product
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => navigate(`/vendor/shop/${shopId}/add-product`)}
                        >
                            Add Product
                        </Button>
                    </div>
                </div>
                <Table
                    columns={columns}
                    dataSource={products.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))}
                    rowKey="_id"
                    pagination={products?.length > 10 ? { pageSize: 10 } : false}
                />
            </Card>

            <Modal
                title="Edit Product"
                open={isEditModalOpen}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={async () => {
                    try {
                        await updateProduct(currentProduct._id, {
                            name: currentProduct.name,
                            vendorSellingPrice: currentProduct.vendorSellingPrice
                        });
                        message.success("Product updated successfully");
                        setIsEditModalOpen(false);
                        fetchProduct(shopId);
                    } catch {
                        message.error("Update failed");
                    }
                }}
            >
                <Form layout="vertical">
                    <Form.Item label="Name">
                        <Input
                            value={currentProduct?.name}
                            onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                        />
                    </Form.Item>
                    <Form.Item label="Vendor Selling Price">
                        <InputNumber
                            className='w-full'
                            min={0}
                            value={currentProduct?.vendorSellingPrice}
                            onChange={(value) => setCurrentProduct({ ...currentProduct, vendorSellingPrice: value })}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default AllProduct;