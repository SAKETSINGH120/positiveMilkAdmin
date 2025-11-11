import React, { useEffect, useState } from 'react';
import { Table, Card, Button, Input, Breadcrumb, Switch, Space, Tooltip, Badge, Avatar, Tag } from 'antd';
import { useNavigate, Link, useParams } from 'react-router';
import { ArrowLeftOutlined, EyeOutlined } from '@ant-design/icons';
import { getVendorShop } from '../../../../services/apiVendor';
import { FaUserTie } from 'react-icons/fa';

const BASE_URL = import.meta.env.VITE_BASE_URL || '';


const VendorProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // const [products, setProducts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchAllShop(id);
    }, [])

    const fetchAllShop = async (id) => {
        setLoading(true)
        try {
            const res = await getVendorShop(id)
            setShops(res)
        } catch (error) {
            message.error("Something went wrong!")
        } finally {
            setLoading(false)
        }
    }

    const filteredShops = shops.filter(shop =>
        shop.name.toLowerCase().includes(searchText.toLowerCase())
    );

    const columns = [
        {
            title: 'Shop Name',
            dataIndex: 'name',
            key: 'name',
            render: (_, { shopImage, name }) => (
                <>
                    <div>
                        <Avatar size={40}>
                            {shopImage ? <img src={`${BASE_URL}/${shopImage}`} alt={name} /> : <FaUserTie />}
                        </Avatar> &nbsp;
                        {name}
                    </div>
                </>
            )
        },
        {
            title: 'Service',
            dataIndex: 'service',
            key: 'service',
            render: (_, record) => (record.serviceId.name)
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (_, record) => (record.shopType)
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            render: (_, record) => (<Tooltip title="All Products" className='hover:cursor-pointer'><Badge count={record.productCount} showZero color="#52c41a" overflowCount={999} /></Tooltip>)
        },
        {
            title: 'Wallet',
            dataIndex: 'wallet',
            key: 'wallet',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Tag>₹{record.wallet_balance || 0}</Tag>
                </Space>
            )
        },
    ];

    return (
        <div className="p-4">

            <div className='lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between'>
                <Input.Search
                    placeholder="Search by name"
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{ maxWidth: 300, borderRadius: '6px' }}
                    size="large"
                />
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Back to Vendors
                </Button>
            </div>

            <Card title={`Shop list`}>
                <Table loading={loading}
                    dataSource={filteredShops}
                    columns={columns}
                    rowKey="_id"
                    pagination={{ pageSize: 10 }}
                />
            </Card>
        </div>
    );
};

export default VendorProducts;
