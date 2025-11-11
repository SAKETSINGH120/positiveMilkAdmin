import React, { useEffect, useState } from 'react';
import AddShopModel from './components/AddShopModel';
import ShopTable from './components/ShopTable';
import { Button, message, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getAllShop } from '../../../services/vendor/apiShop';
import EditShopModel from './components/EditShopModel';

function Shop() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingShop, setEditingShop] = useState(null);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);
    const handleOk = () => { setIsModalOpen(false); fetchAllShop(); };

    const handleEdit = (shop) => {
        setEditingShop(shop);
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        fetchAllShop();
    }, [])

    const fetchAllShop = async () => {
        setLoading(true)
        try {
            const res = await getAllShop()

            setShops(res)
        } catch (error) {
            // console.log(error)
            message.error("Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    // if (loading) return <Spin size="large" fullscreen />

    return (
        <div className="min-h-screen">
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800">My Shops</h2>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={showModal}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        Add New Shop
                    </Button>
                </div>

                <ShopTable shops={shops} handleEdit={handleEdit} loading={loading} fetchAllShop={fetchAllShop}/>

                <AddShopModel
                    isModalOpen={isModalOpen}
                    handleCancel={handleCancel}
                    handleOk={handleOk}
                />

                <EditShopModel
                    isModalOpen={isEditModalOpen}
                    handleOk={() => {
                        setIsEditModalOpen(false);
                        setEditingShop(null);
                        fetchAllShop();
                    }}
                    handleCancel={() => {
                        setIsEditModalOpen(false);
                        setEditingShop(null);
                    }}
                    shopData={editingShop}
                />
            </div>
        </div>
    );
}

export default Shop;
