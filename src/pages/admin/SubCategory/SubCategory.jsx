import React, { useEffect, useState } from 'react';
import { Breadcrumb, Button, Input, message, Modal, Spin } from 'antd';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router';
import SubCategoryTable from './components/SubCategoryTable';
import AddSubCategoryModel from './components/AddSubCategoryModel';
import EditSubCategoryModel from './components/EditSubCategoryModel';
import { deleteCategory, getAllSubCategory } from '../../../services/apiCategory';
import { usePermissions } from '../../../hooks/usePermissions';

function SubCategory() {
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { hasPermission } = usePermissions();

    const fetchSubcategories = async () => {
        setLoading(true);
        try {
            const data = await getAllSubCategory();
            setSubcategories(data);
        } catch {
            message.error('Failed to load subcategories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchSubcategories(); }, []);

    const openModal = (category = null) => {
        setSelectedCategory(category);
        setEditMode(!!category);
        setIsModalOpen(true);
    };

    const closeModal = (updated = false) => {
        setIsModalOpen(false);
        setSelectedCategory(null);
        if (updated) fetchSubcategories();
    };

    const handleDelete = (category) => {
        Modal.confirm({
            title: 'Delete Sub-Category',
            content: `Are you sure you want to delete "${category.name}"?`,
            okType: 'danger',
            onOk: async () => {
                try {
                    await deleteCategory(category._id);
                    message.success('Subcategory deleted successfully!');
                    fetchSubcategories();
                } catch {
                    message.error('Failed to delete subcategory.');
                }
            }
        });
    };

    // if (loading) return <Spin size="large" fullscreen />;

    return (
        <>
            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between'>
                <Input.Search
                    placeholder="Search here ..."
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ maxWidth: 300, borderRadius: '6px' }}
                    size="large"
                />
                {hasPermission(['CREATE_SUBCATEGORY']) && (
                    <Button
                        type="primary"
                        icon={<FaPlus />}
                        size="large"
                        onClick={() => openModal()}
                    >
                        Add Sub Category
                    </Button>
                )}
            </div>

            <SubCategoryTable
                loading={loading}
                searchText={searchText}
                data={subcategories}
                onEdit={openModal}
                onDelete={handleDelete}
                hasPermission={hasPermission}
            />

            {editMode ? (
                <EditSubCategoryModel
                    isModalOpen={isModalOpen}
                    handleOk={() => closeModal(true)}
                    handleCancel={() => closeModal(false)}
                    categoryData={selectedCategory}
                />
            ) : (
                <AddSubCategoryModel
                    isModalOpen={isModalOpen}
                    handleOk={() => closeModal(true)}
                    handleCancel={() => closeModal(false)}
                />
            )}
        </>
    );
}

export default SubCategory;
