import React from 'react'
import { Avatar, Button, Space, Switch, Table, Tooltip } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { updateProductStatus } from '@services/apiProduct';
const BASE_URL = import.meta.env.VITE_BASE_URL;

function Store199Table({ searchText, data,onDelete, loading }) {

    const navigate = useNavigate()

    const columns = [
        {
            title: 'Image',
            key: 'avatar',
            align: "center",
            render: (_, { primary_image }) => (
                <img
                    src={`${BASE_URL}/${primary_image}` || '?'}
                    alt="Product"
                    style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 50 }}
                    loading='lazy'
                />
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
            render: (_, record) => (<>{record.categoryId.name}</>)
        },
        {
            title: 'Sub Category',
            dataIndex: 'subcategory',
            key: 'subcategory',
            align: "center",
            render: (_, record) => (<>{record.subCategoryId.name}</>)
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
            render: (_, record) => (<>{`₹ ${record.vendorSellingPrice}`} <del>{record.mrp}</del></>)
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
                    {/* <Tooltip title="Details"><Button type="primary" icon={<EyeOutlined />} onClick={() => navigate(`/admin/products/${record.name}-${record._id}`)} /></Tooltip> */}
                    {/* <Tooltip title="Edit"><Button type="primary" icon={<FaEdit />} onClick={() => console.log("edit")}></Button></Tooltip> */}
                    <Tooltip title="Delete"><Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record._id)}></Button></Tooltip>
                </Space>
            )
        }
    ];

    return (
        <>
            <Table
                dataSource={data.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))}
                columns={columns}
                rowKey={"_id"}
                scroll={{ x: true }}
                bordered={false}
                size='small'
                loading={loading}
            />
        </>
    )
}

export default Store199Table
