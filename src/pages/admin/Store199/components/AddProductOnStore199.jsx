import React, { useEffect, useState } from 'react';
import { Modal, Table, Checkbox, Button, message, Spin, Avatar } from 'antd';
import { bulkProductAddInStore199, getAllProductOfStore199ForAssign } from '../../../../services/admin/apiStore199';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddProductOnStore199 = ({ isOpen, onClose, onSuccess }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            const res = await getAllProductOfStore199ForAssign();
            setAllProducts(res.data || []);
        } catch (err) {
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) fetchAllProducts();
    }, [isOpen]);

    const handleAddToStore = async () => {
        if (selectedRowKeys.length === 0) {
            return message.warning('Please select at least one product');
        }
        setLoading(true);
        try {
            await bulkProductAddInStore199({ productIds: selectedRowKeys });
            message.success('Products added to 199 Store');
            setSelectedRowKeys([])
            onClose();
            onSuccess();
        } catch (err) {
            message.error('Failed to add products');
        } finally {
            setLoading(false);
        }
    };

    const columns = [
        {
            title: 'Image',
            key: 'avatar',
            align: "center",
            render: (_, { primary_image }) => (
                <Avatar size={60} style={{ backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
                    {primary_image ? <img src={`${BASE_URL}/${primary_image}`} /> : "?"}
                </Avatar>
            )
        },
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'vendorSellingPrice',
            key: 'vendorSellingPrice',
            render: (_, record) => <>₹{record.price} <del>{record.mrp}</del></>
        },
    ];

    return (
        <Modal
            title="Add Products to Store 199"
            open={isOpen}
            onCancel={onClose}
            width={800}
            footer={null}
        >
            <Spin spinning={loading}>
                <Table
                    rowKey="_id"
                    rowSelection={{
                        selectedRowKeys,
                        onChange: setSelectedRowKeys,
                    }}
                    columns={columns}
                    dataSource={allProducts}
                    pagination={{ pageSize: 10 }}
                />

                <div className="text-right mt-4">
                    <Button type="primary" onClick={handleAddToStore} loading={loading}>
                        Add to 199 Store
                    </Button>
                </div>
            </Spin>
        </Modal>
    );
};

export default AddProductOnStore199;
