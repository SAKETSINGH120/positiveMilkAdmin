import React, { useState } from 'react'
import { Breadcrumb, Input, Button, Modal } from 'antd'
import { Link } from 'react-router' 
import { FaPlus } from 'react-icons/fa'
import GroceryProductTable from './components/GroceryProductTable'
import AddGroceryProductModal from './components/AddGroceryProductModal' 
import EditGroceryProductModal from './components/EditGroceryProductModal' 

function GroceryProduct() { 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showEditModal = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };

    const handleEditOk = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleEditCancel = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const handleDelete = (product) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this grocery product?', 
            content: `This will permanently delete "${product.product_name}"`, 
            okText: 'Yes, Delete',
            okType: 'danger',
            cancelText: 'No, Cancel',
            onOk() {
                // console.log('Deleting grocery product:', product);
            },
        });
    };

    return (
        <>
            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between '>
                <Input.Search
                    placeholder="Search by product name" 
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{
                        maxWidth: 300,
                        borderRadius: '6px'
                    }}
                    size="large"
                />
                <Button
                    type='primary'
                    icon={<FaPlus />}
                    size="large"
                    className="hover:opacity-90 transition-all duration-300"
                    onClick={showModal}
                >
                    Add Grocery Product 
                </Button>
            </div>
            <GroceryProductTable searchText={searchText} onEdit={showEditModal} onDelete={handleDelete} />

            {/* Add Grocery Product Modal */}
            <AddGroceryProductModal
                isModalOpen={isModalOpen}
                handleOk={handleOk}
                handleCancel={handleCancel}
            />

            {/* Edit Grocery Product Modal */}
            <EditGroceryProductModal
                isModalOpen={isEditModalOpen}
                handleOk={handleEditOk}
                handleCancel={handleEditCancel}
                productData={selectedProduct}
            />
        </>
    )
}

export default GroceryProduct // Updated export 