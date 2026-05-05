import React, { useState, useEffect } from 'react';
import { Card, Button, Input, message } from 'antd';
import { FaPlus } from 'react-icons/fa';
import CollectionTable from './components/CollectionTable';
import AddCollectionModal from './components/AddCollectionModal';
import EditCollectionModal from './components/EditCollectionModal';
import { getAllCollections, addCollection, updateCollection, deleteCollection } from '../../../services/admin/apiDriverCollection';

const DriverCollection = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCollection, setSelectedCollection] = useState(null);

    const fetchCollections = async () => {
        setLoading(true);
        try {
            const res = await getAllCollections();
            setCollections(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollections();
    }, []);

    const handleAdd = async (values) => {
        try {
            await addCollection(values);
            message.success('Collection added and user wallet updated');
            setIsAddModalOpen(false);
            fetchCollections();
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (values) => {
        try {
            await updateCollection(selectedCollection._id, values);
            message.success('Collection updated');
            setIsEditModalOpen(false);
            fetchCollections();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteCollection(id);
            fetchCollections();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="lg:px-10 px-5 my-8">
            <div className="md:flex items-center justify-between gap-4 mb-6">
                <Input.Search
                    placeholder="Search by driver or user"
                    className="max-w-xs"
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large"
                />
                <Button
                    type="primary"
                    icon={<FaPlus />}
                    onClick={() => setIsAddModalOpen(true)}
                    size="large"
                >
                    Add Collection
                </Button>
            </div>

            <CollectionTable
                data={collections}
                loading={loading}
                searchText={searchText}
                onEdit={(record) => {
                    setSelectedCollection(record);
                    setIsEditModalOpen(true);
                }}
                onDelete={handleDelete}
            />

            <AddCollectionModal
                visible={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                onOk={handleAdd}
            />

            <EditCollectionModal
                visible={isEditModalOpen}
                initialValues={selectedCollection}
                onCancel={() => setIsEditModalOpen(false)}
                onOk={handleUpdate}
            />
        </div>
    );
};

export default DriverCollection;
