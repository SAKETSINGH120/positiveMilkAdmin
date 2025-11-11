import { Avatar, Button, message, Space, Table, Tag, Tooltip } from 'antd';
import { IoMdEye } from 'react-icons/io';
import { useNavigate, useParams } from 'react-router';
import { FaEdit, FaStore, FaTrash, FaPlus } from 'react-icons/fa';
import { getTopShop, deleteTopShop } from '../../../../services/admin/apiShop';
import { useEffect, useState } from 'react';
import AddTopShopModal from './AddTopShopModal';
import EditTopShopModal from './EditTopShopModal';
import { IoPencil } from 'react-icons/io5';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const TopShopTable = () => {

    const { categoryId } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedShop, setSelectedShop] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchTopShop(categoryId)
    }, [])

    const fetchTopShop = async () => {
        try {
            setLoading(true);
            const res = await getTopShop(categoryId);
            setData(res);
        } catch {
            message.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleEditTopShop = (record) => {
        setSelectedShop(record);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedShop(null);
    };

    const handleDeleteTopShop = async (record) => {
        try {
            await deleteTopShop({
                shopId: record._id,
                categoryId: categoryId
            });
            message.success('Shop removed from top shops successfully!');
            fetchTopShop();
        } catch {
            message.error('Failed to remove shop from top shops');
        }
    };

    const columns = [
        {
            title: 'Image',
            key: 'image',
            align: 'center',
            render: (_, record) => (
                <Avatar
                    shape="square"
                    size={50}
                    src={`${BASE_URL}/${record.shopImage.replace(/\\/g, '/')}`}
                    alt={record.name}
                />
            )
        },
        {
            title: 'Shop Name',
            dataIndex: 'name',
            key: 'name',
            align: 'center'
        },
        {
            title: 'veg / nonveg',
            dataIndex: 'shopType',
            key: 'shopType',
            align: 'center',
            render: type => (
                <Tag color={type === 'veg' ? 'green' : 'red'}>{type?.toUpperCase()}</Tag>
            )
        },
        // {
        //     title: 'Service',
        //     key: 'service',
        //     align: 'center',
        //     render: (_, record) => record.serviceId?.name || 'N/A'
        // },
        {
            title: 'Vendor',
            dataIndex: 'vendorName',
            key: 'vendorName',
            align: 'center',
            render: (_, record) => record.vendorName || 'N/A'
        },
        {
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
            align: 'center'
        },
        {
            title: 'Priority',
            dataIndex: 'priority',
            key: 'priority',
            align: 'center',
            render: (priority) => (
                <Tag color="blue">{priority || 1}</Tag>
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Tooltip title="Details"> <Button type="primary" icon={<IoMdEye />} onClick={() => navigate(`/admin/shop/${record._id}`)} /></Tooltip>
                    <Tooltip title="Edit Priority"> <Button type="primary" icon={<FaEdit />} onClick={() => handleEditTopShop(record)} /></Tooltip>
                    <Tooltip title="Remove from Top"> <Button type="primary" danger icon={<FaTrash />} onClick={() => handleDeleteTopShop(record)} /></Tooltip>
                </Space>
            )
        }
    ];

    return (
        <>
            <div style={{ marginBottom: 16, textAlign: 'right' }}>
                <Button 
                    type="primary" 
                    icon={<FaPlus />} 
                    onClick={handleOpenModal}
                >
                    Add Top Shop
                </Button>
            </div>
            
            <Table
                dataSource={data}
                columns={columns}
                rowKey="_id"
                scroll={{ x: true }}
                bordered={false}
                size="small"
                loading={loading}
            />

            <AddTopShopModal
                isModalOpen={isModalOpen}
                handleCancel={handleCloseModal}
                categoryId={categoryId}
                fetchTopShop={fetchTopShop}
            />

            <EditTopShopModal
                isModalOpen={isEditModalOpen}
                handleCancel={handleCloseEditModal}
                shopData={selectedShop}
                categoryId={categoryId}
                fetchTopShop={fetchTopShop}
            />
        </>
    );
};

export default TopShopTable;
