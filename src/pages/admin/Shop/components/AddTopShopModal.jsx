import React, { useState, useEffect } from 'react';
import { Modal, List, Avatar, Button, message, Input, Tag, InputNumber, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getShopViaCategory, addTopShop } from '../../../../services/admin/apiShop';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const AddTopShopModal = ({ isModalOpen, handleCancel, categoryId, fetchTopShop }) => {
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingShop, setAddingShop] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [shopPriorities, setShopPriorities] = useState({});

    useEffect(() => {
        if (isModalOpen && categoryId) {
            fetchShops();
        }
    }, [isModalOpen, categoryId]);

    const fetchShops = async () => {
        try {
            setLoading(true);
            const res = await getShopViaCategory(categoryId);
            setShops(res);
        } catch {
            message.error('Error fetching shop list');
        } finally {
            setLoading(false);
        }
    };

    const handleAddTopShop = async (shop) => {
        const priority = shopPriorities[shop._id] || 1;
        try {
            setAddingShop(shop._id);
            const payload = {
                shopId: shop._id,
                categoryId: categoryId,
                priority: priority
            };

            await addTopShop(payload);
            message.success(`${shop.name} added to top shops successfully!`);
            fetchTopShop(); // Refresh the top shops list
        } catch {
            message.error('Failed to add shop to top shops');
        } finally {
            setAddingShop(null);
        }
    };

    const handlePriorityChange = (shopId, value) => {
        setShopPriorities(prev => ({
            ...prev,
            [shopId]: value
        }));
    };

    const filteredShops = shops.filter(shop =>
        shop.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        shop.vendorId?.name?.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <Modal
            title="Add Top Shop"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            width={800}
        >
            <div className="space-y-4">
                <Input
                    placeholder="Search shops..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ marginBottom: 16 }}
                />

                <List
                    loading={loading}
                    dataSource={filteredShops}
                    renderItem={(shop) => (
                        <List.Item
                            actions={[
                                <Space key="actions">
                                    <InputNumber
                                        min={1}
                                        max={100}
                                        placeholder="Priority"
                                        value={shopPriorities[shop._id] || 1}
                                        onChange={(value) => handlePriorityChange(shop._id, value)}
                                        style={{ width: 80 }}
                                    />
                                    <Button
                                        type="primary"
                                        icon={<PlusOutlined />}
                                        loading={addingShop === shop._id}
                                        onClick={() => handleAddTopShop(shop)}
                                    >
                                        Add to Top
                                    </Button>
                                </Space>
                            ]}
                        >
                            <List.Item.Meta
                                avatar={
                                    <Avatar
                                        shape="square"
                                        size={50}
                                        src={`${BASE_URL}/${shop.shopImage?.replace(/\\/g, '/')}`}
                                        alt={shop.name}
                                    />
                                }
                                title={shop.name}
                                description={
                                    <div className="space-y-1">
                                        <div>
                                            <strong>Vendor:</strong> {shop.vendorId?.name || 'N/A'}
                                        </div>
                                        <div>
                                            <strong>Type:</strong>
                                            <Tag color={shop.shopType === 'veg' ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                                                {shop.shopType?.toUpperCase()}
                                            </Tag>
                                        </div>
                                        <div>
                                            <strong>Service:</strong> {shop.serviceId?.name || 'N/A'}
                                        </div>
                                        <div>
                                            <strong>Products:</strong> {shop.productCount || 0}
                                        </div>
                                    </div>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>
        </Modal>
    );
};

export default AddTopShopModal; 