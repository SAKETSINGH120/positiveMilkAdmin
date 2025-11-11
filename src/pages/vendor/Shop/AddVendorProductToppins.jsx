import React, { useEffect, useState } from 'react';
import {
    Form, Input, InputNumber, Button, message, Table, Switch, Popconfirm
} from 'antd';
import { useParams } from 'react-router';
import {
    addToppins, deleteToppins, getAllToppins, updateToppins
} from '../../../services/vendor/apiToppins';
import { Space, Tooltip } from 'antd';
import { FaCross, FaEdit, FaSave, FaTimes, FaTrash } from 'react-icons/fa';

const AddVendorProductToppings = () => {
    const [addForm] = Form.useForm();
    const [editForm] = Form.useForm();
    const { productId } = useParams();
    const [toppings, setToppings] = useState([]);
    const [editingKey, setEditingKey] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchToppings = async () => {
        try {
            setLoading(true);
            const res = await getAllToppins(productId);
            setToppings(res);
        } catch (error) {
            message.error('Failed to load toppings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (productId) fetchToppings();
    }, [productId]);

    const onFinishAdd = async (values) => {
        try {
            await addToppins({ ...values, productId });
            message.success('Topping added successfully');
            addForm.resetFields();
            fetchToppings();
        } catch (error) {
            message.error('Failed to add topping');
        }
    };

    const isEditing = (record) => record._id === editingKey;

    const edit = (record) => {
        editForm.setFieldsValue({ name: '', price: '', ...record });
        setEditingKey(record._id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (id) => {
        try {
            const row = await editForm.validateFields();
            await updateToppins(id, row);
            message.success('Topping updated');
            setEditingKey('');
            fetchToppings();
        } catch (errInfo) {
            message.error('Update failed');
        }
    };

    const handleDelete = async (toppingId) => {
        try {
            await deleteToppins(toppingId);
            message.success('Topping deleted');
            fetchToppings();
        } catch (error) {
            message.error('Failed to delete topping');
        }
    };

    const handleStatusToggle = async (toppingId, checked) => {
        try {
            await updateToppins(toppingId, {
                status: checked ? "active" : "inactive"
            });
            fetchToppings();
        } catch (error) {
            message.error('Failed to update status');
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            render: (text, record) => {
                return isEditing(record) ? (
                    <Form.Item name="name" style={{ margin: 0 }} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                ) : (
                    text
                );
            }
        },
        {
            title: 'Price (₹)',
            dataIndex: 'price',
            render: (text, record) => {
                return isEditing(record) ? (
                    <Form.Item name="price" style={{ margin: 0 }} rules={[{ required: true }]}>
                        <InputNumber min={0} />
                    </Form.Item>
                ) : (
                    text
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (text, record) => (
                <Switch
                    checked={record.status === 'active'}
                    onChange={(checked) => handleStatusToggle(record._id, checked)}
                    disabled={isEditing(record)}
                />
            )
        },
        {
            title: 'Action',
            key: 'action',
            align: "right",
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <Space size="small">
                        <Button
                            type="primary"
                            icon={<FaSave />}
                            onClick={() => save(record._id)}
                        />
                        <Button
                            type="primary"
                            danger
                            icon={<FaTimes />}
                            onClick={cancel}
                        />
                    </Space>
                ) : (
                    <Space size="small">
                        <Button
                            type="primary"
                            icon={<FaEdit />}
                            onClick={() => edit(record)}
                        />
                        <Popconfirm
                            title="Delete this topping?"
                            onConfirm={() => handleDelete(record._id)}
                        >
                            <Button type="primary" danger icon={<FaTrash />} />
                        </Popconfirm>
                    </Space>
                );
            }
        }

    ];

    return (
        <div className="lg:px-10 px-5 py-6">
            <h2 className="text-xl font-semibold mb-4">Add Topping</h2>

            <Form form={addForm} layout="inline" onFinish={onFinishAdd}>
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Topping name is required' }]}
                >
                    <Input placeholder="Topping Name" />
                </Form.Item>

                <Form.Item
                    name="price"
                    rules={[{ required: true, message: 'Price is required' }]}
                >
                    <InputNumber placeholder="Price (₹)" min={0} />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Topping
                    </Button>
                </Form.Item>
            </Form>

            <h3 className="text-lg font-medium mt-8 mb-4">Existing Toppings</h3>

            <Form form={editForm} component={false}>
                <Table
                    columns={columns}
                    dataSource={toppings}
                    rowKey="_id"
                    loading={loading}
                    pagination={false}
                />
            </Form>
        </div>
    );
};

export default AddVendorProductToppings;
