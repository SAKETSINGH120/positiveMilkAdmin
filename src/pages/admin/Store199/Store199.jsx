import React, { useEffect, useState } from 'react';
import { Tabs, Input, Button, message, Modal } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { getAllProducts } from '@services/apiProduct';
import Store199Table from './components/Store199Table';
import { deleteProductOfStore199, getAllProductOfStore199 } from '../../../services/admin/apiStore199';
import AddProductOnStore199 from './components/AddProductOnStore199';

const { TabPane } = Tabs;

const Store199 = () => {
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const productList = await getAllProductOfStore199();
            setProducts(productList.data || []);
        } catch {
            message.error('Error fetching product list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const handleDelete = async (productId) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            okText: 'Yes, Delete',
            cancelText: 'Cancel',
            onOk: async () => {
                setLoading(true)
                try {
                    await deleteProductOfStore199(productId);
                    fetchProduct();
                } catch {
                    message.error('Failed to delete product');
                } finally {
                    setLoading(false)
                }
            },
        });
    };

    return (
        <>
            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between'>
                <Input.Search
                    placeholder={`Search by product name`}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ maxWidth: 300, borderRadius: '6px' }}
                    size="large"
                />
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    size="large"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Product
                </Button>
            </div>

            <Store199Table
                searchText={searchText}
                data={products}
                onDelete={handleDelete}
                loading={loading}
            />

            <AddProductOnStore199
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchProduct(); 
                }}
            />
        </>
    );
};

export default Store199;
