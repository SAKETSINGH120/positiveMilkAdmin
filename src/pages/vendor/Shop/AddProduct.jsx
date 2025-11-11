import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Modal, InputNumber, Spin, message, Input, Breadcrumb, Form } from 'antd';
import { getAllProducts } from '@services/vendor/apiProduct';
import { Link, useNavigate, useParams } from 'react-router';
import { assignBulkProduct } from '../../../services/vendor/apiProduct';
const BASE_URL = import.meta.env.VITE_BASE_URL;

function AddProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');

    const { shopId } = useParams()

    const navigate = useNavigate();

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const productList = await getAllProducts();
            setProducts(productList);
        } catch {
            message.error('Error fetching product list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const columns = [
        {
            title: '#',
            key: 'avatar',
            align: "center",
            render: (_, { primary_image, name }) => (
                <div className='flex items-center gap-3'>
                    <img
                        src={`${BASE_URL}/${primary_image}` || '?'}
                        alt="Product"
                        style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 50 }}
                        loading='lazy'
                    />
                    <b>{name}</b>
                </div>
            )
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            align: "center",
            render: (_, record) => (<>{record.categoryId?.name}</>)
        },
        {
            title: 'Sub Category',
            dataIndex: 'subcategory',
            key: 'subcategory',
            align: "center",
            render: (_, record) => (<>{record.subCategoryId?.name}</>)
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            align: "center",
            render: (_, record) => (<>{record.type}</>)
        },
        {
            title: 'Price',
            dataIndex: 'original_price',
            key: 'original_price',
            align: "center",
            render: (_, record) => (<>{`₹ ${record.mrp}`}</>)
        },
    ];

    // Row Selection for bulk assign
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys, selectedRows) => {
            setSelectedRowKeys(selectedKeys);
            // add vendorSellingPrice field default empty
            const updatedSelectedProducts = selectedRows.map(product => ({
                ...product,
                vendorSellingPrice: product.mrp
            }));
            setSelectedProducts(updatedSelectedProducts);
        }
    };

    const handleBulkAssignClick = () => {
        if (selectedProducts.length === 0) {
            message.warning("Please select at least one product");
            return;
        }
        setIsModalOpen(true);
    };

    const handlePriceChange = (value, productId) => {
        const updated = selectedProducts.map(product => {
            if (product._id === productId) {
                return { ...product, vendorSellingPrice: value };
            }
            return product;
        });
        setSelectedProducts(updated);
    };

    const handleSaveAll = async () => {
        const requestData = {
            shopId,
            selectedProducts: selectedProducts.map(product => ({
                productId: product._id,
                vendorSellingPrice: product.vendorSellingPrice
            }))
        };

        try {
            setLoading(true)
            const res = await assignBulkProduct(requestData)
            message.success(res.message);
        } catch (error) {
            // console.log(error.message)
            message.error("Error assigning products");
        } finally {
            setLoading(false)
        }

        setIsModalOpen(false);
        setSelectedRowKeys([]);
        setSelectedProducts([]);
    };

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
                    <Button type="primary" onClick={handleBulkAssignClick}>Assign Selected Products</Button>
                </div>
                <Table
                    columns={columns}
                    // dataSource={products}
                    dataSource={products.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))}
                    rowKey="_id"
                    rowSelection={rowSelection}
                    pagination={products?.length > 10 ? { pageSize: 10 } : false}
                />
            </Card>

            {/* Bulk Assign Modal */}
            <Modal
                title="Assign Products to Vendor"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleSaveAll}
                okText="Save All"
                width={800}
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200 text-gray-700 text-sm">
                                <th className="border px-4 py-2 text-left">Product</th>
                                <th className="border px-4 py-2 text-left">Category</th>
                                <th className="border px-4 py-2 text-left">MRP</th>
                                <th className="border px-4 py-2 text-left">Your Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-100 text-sm">
                                    <td className="border px-4 py-2">{product.name}</td>
                                    <td className="border px-4 py-2">{product.categoryId?.name}</td>
                                    <td className="border px-4 py-2">₹ {product.mrp}</td>
                                    <td className="border px-4 py-2">
                                        <InputNumber
                                            min={1}
                                            placeholder="Enter Selling Price"
                                            value={product.vendorSellingPrice}
                                            onChange={(value) => handlePriceChange(value, product._id)}
                                            className="w-full"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Modal>
        </>
    )
}

export default AddProduct;
