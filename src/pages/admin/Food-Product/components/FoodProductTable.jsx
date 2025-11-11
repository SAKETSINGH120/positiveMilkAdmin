import React from 'react'
import { Avatar, Button, Space, Switch, Table, Tooltip } from 'antd'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
import { updateProductStatus } from '@services/apiProduct'
const BASE_URL = import.meta.env.VITE_BASE_URL

function FoodProductTable({ searchText, data, onEdit, onDelete, loading, hasPermission }) {
  const navigate = useNavigate()

  const columns = [
    {
      title: 'Image',
      key: 'avatar',
      align: 'center',
      render: (_, { primary_image }) => (
        <img
          src={`${BASE_URL}/${primary_image}` || '?'}
          alt="Product"
          style={{
            width: 50,
            height: 50,
            objectFit: 'cover',
            borderRadius: 50,
          }}
          loading="lazy"
        />
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      align: 'center',
      // render: (_, record) => (<>{"N/A"}</>)
      render: (_, record) => <>{record?.categoryId?.name || 'N/A'}</>,
    },

    {
      title: 'Subscribable',
      dataIndex: 'subscrible',
      key: 'subscrible',
      align: 'center',
      // render: (_, record) => (<>{"N/A"}</>)
      render: (_, record) => (
        <>
          {record?.isSubscribable ? (
            <p style={{ color: 'green', margin: 0 }}>Yes</p>
          ) : (
            <p style={{ color: 'red', margin: 0 }}>No</p>
          )}
        </>
      ),
    },
    {
      title: 'Sub Category',
      dataIndex: 'subcategory',
      key: 'subcategory',
      align: 'center',
      // render: (_, record) => (<>{"N/A"}</>)
      render: (_, record) => <>{record?.subCategoryId?.name || 'N/A'}</>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (_, record) => <>{record?.type || 'N/A'}</>,
    },
    {
      title: 'Price',
      dataIndex: 'original_price',
      key: 'original_price',
      align: 'center',
      render: (_, record) => (
        <>
          {`₹ ${record?.sellingPrice || 0}`} <del>{record?.mrp || 0}</del>
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (_, record) => (
        <Switch
          defaultChecked={record?.status === 'active'}
          onChange={(checked) => updateProductStatus(record._id, checked)}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Details">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/admin/products/${record?.name}-${record?._id}`)}
            />
          </Tooltip>
          {hasPermission(['UPDATE_PRODUCT']) && (
            <Tooltip title="Edit">
              <Button type="primary" icon={<FaEdit />} onClick={() => onEdit(record)}></Button>
            </Tooltip>
          )}
          {hasPermission(['DELETE_PRODUCT']) && (
            <Tooltip title="Delete">
              <Button
                type="primary"
                danger
                icon={<FaTrash />}
                onClick={() => onDelete(record)}
              ></Button>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <>
      <Table
        dataSource={data.filter((item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()),
        )}
        columns={columns}
        rowKey={'_id'}
        scroll={{ x: true }}
        bordered={false}
        size="small"
        loading={loading}
      />
    </>
  )
}

export default FoodProductTable
