import React from 'react'
import dataSource from "../data.json" // Pointing to the new data source
import { Avatar, Button, Space, Switch, Table } from 'antd';
import { FaEdit, FaTrash } from 'react-icons/fa';

function GroceryProductTable({ searchText, onEdit, onDelete }) { // Renamed component

    const columns = [
        {
            title: 'Image',
            key: 'avatar',
            align: "center",
            render: (_, { image }) => (
                // Assuming image structure remains similar or update as needed
                <Avatar size={40} style={{ backgroundColor: '#87d068' }}>{image ? image[0] : 'G'}</Avatar>
            )
        },
        {
            title: 'Name',
            dataIndex: 'product_name',
            key: 'product_name',
            align: "center"
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            align: "center"
        },
        {
            title: 'Sub Category',
            dataIndex: 'subcategory',
            key: 'subcategory',
            align: "center"
        },
        {
            title: 'Brand',
            dataIndex: 'brand',
            key: 'brand',
            align: "center"
        },
        {
            title: 'SKU',
            dataIndex: 'sku',
            key: 'sku',
            align: "center"
        },
        {
            title: 'Price',
            dataIndex: 'original_price',
            key: 'original_price',
            align: "center"
        },
        {
            title: 'Vendor',
            dataIndex: 'vendor_name',
            key: 'vendor_name',
            align: "center"
        },

        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: "center",
            render: (_, record) => (
                <Switch defaultChecked={record.status === 'active'} onChange={(checked) => onChange(checked, record)} />
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: "right",
            render: (_, record) => (
                <Space size="small">
                    <Button type="primary" icon={<FaEdit />} onClick={() => onEdit(record)}>Edit</Button>
                    <Button type="primary" danger icon={<FaTrash />} onClick={() => onDelete(record)}>Delete</Button>
                </Space>
            )
        }
    ];

    // Added record parameter to potentially update status via API later
    const onChange = (checked, record) => {
        // console.log(`switch to ${checked} for product:`, record);
        // Add API call here to update status if needed
    };

    // Filter logic remains the same, based on product_name
    const filteredData = dataSource.filter(item =>
        item.product_name.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <>
            <Table
                dataSource={filteredData}
                columns={columns}
                scroll={{ x: true }}
                bordered={false}
                size='small'
            />
        </>
    )
}

export default GroceryProductTable // Updated export 