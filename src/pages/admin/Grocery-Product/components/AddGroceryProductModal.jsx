import React, { useState } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

// Mock data - Replace with actual API calls
const categories = [{ id: 'catG1', name: 'Produce' }, { id: 'catG2', name: 'Dairy & Eggs' }, { id: 'catG3', name: 'Pantry' }];
const subCategories = {
    catG1: [{ id: 'subG1', name: 'Fruits' }, { id: 'subG2', name: 'Vegetables' }],
    catG2: [{ id: 'subG3', name: 'Milk' }, { id: 'subG4', name: 'Cheese' }, { id: 'subG5', name: 'Eggs' }],
    catG3: [{ id: 'subG6', name: 'Canned Goods' }, { id: 'subG7', name: 'Pasta & Grains' }],
};
const vendors = [{ id: 'venG1', name: 'SuperMart' }, { id: 'venG2', name: 'Local Grocer' }];


function AddGroceryProductModal({ isModalOpen, handleOk, handleCancel }) {
    const [form] = Form.useForm();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [fileList, setFileList] = useState([]);

    const onFinish = (values) => {
        // console.log('Received values of form: ', { ...values, images: fileList });
        // API call to add the grocery product would go here
        form.resetFields();
        setFileList([]);
        handleOk(); // Close modal
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        form.setFieldsValue({ subCategory: undefined });
    };

    const normFile = (e) => {
        // console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        setFileList(e?.fileList);
        return e?.fileList;
    };

    const handleRemove = file => {
        setFileList(prevFileList => prevFileList.filter(item => item.uid !== file.uid));
        return true;
    }

    return (
        <Modal
            title="Add New Grocery Product" // Updated title
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Add Product"
            cancelText="Cancel"
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                name="add_grocery_product_form" // Updated form name
                onFinish={onFinish}
                initialValues={{
                    stock: 0,
                    // Removed default dietaryPreference, can add back if needed
                }}
            >
                <Form.Item
                    name="name"
                    label="Product Name"
                    rules={[{ required: true, message: 'Please input the product name!' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Description"
                    rules={[{ required: true, message: 'Please enter a description!' }]}
                >
                    <Input.TextArea rows={4} placeholder="Product description" />
                </Form.Item>

                <Form.Item name="vendor" label="Vendor" rules={[{ required: true, message: 'Please select a vendor!' }]}>
                    <Select placeholder="Select a vendor">
                        {vendors.map(vendor => (
                            <Option key={vendor.id} value={vendor.id}>{vendor.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="category" label="Category" rules={[{ required: true, message: 'Please select a category!' }]}>
                    <Select placeholder="Select a category" onChange={handleCategoryChange}>
                        {categories.map(category => (
                            <Option key={category.id} value={category.id}>{category.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="subCategory" label="Sub-Category" rules={[{ required: true, message: 'Please select a sub-category!' }]}>
                    <Select placeholder="Select a sub-category" disabled={!selectedCategory}>
                        {selectedCategory && subCategories[selectedCategory]?.map(sub => (
                            <Option key={sub.id} value={sub.id}>{sub.name}</Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item name="price" label="Price (₹)" rules={[{ required: true, message: 'Please enter the price!' }]}>
                    <InputNumber min={0} style={{ width: '100%' }} formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/₹\s?|(,*)/g, '')} />
                </Form.Item>

                <Form.Item name="offerPrice" label="Offer Price (₹) (Optional)">
                    <InputNumber min={0} style={{ width: '100%' }} formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} parser={value => value.replace(/₹\s?|(,*)/g, '')} />
                </Form.Item>

                <Form.Item name="stock" label="Stock Quantity" rules={[{ required: true, message: 'Please enter stock quantity!' }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                 {/* Example: Removed dietary preference, can be added back if needed for groceries */}
                {/* <Form.Item name="dietaryPreference" label="Dietary Info"> ... </Form.Item> */}

                <Form.Item
                    name="images"
                    label="Product Images"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                    rules={[{ required: true, message: 'Please upload at least one image!' }]}
                >
                    <Upload
                        action="/upload.do" // Replace with actual upload endpoint
                        listType="picture"
                        fileList={fileList}
                        onRemove={handleRemove}
                        beforeUpload={() => false} // Handle upload manually
                        multiple
                    >
                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                    </Upload>
                </Form.Item>

            </Form>
        </Modal>
    );
}

export default AddGroceryProductModal; 