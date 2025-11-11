import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, Upload, Button, Radio } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

// Mock data - Replace with actual API calls (same as Add modal)
const categories = [{ id: 'catG1', name: 'Produce' }, { id: 'catG2', name: 'Dairy & Eggs' }, { id: 'catG3', name: 'Pantry' }];
const subCategories = {
    catG1: [{ id: 'subG1', name: 'Fruits' }, { id: 'subG2', name: 'Vegetables' }],
    catG2: [{ id: 'subG3', name: 'Milk' }, { id: 'subG4', name: 'Cheese' }, { id: 'subG5', name: 'Eggs' }],
    catG3: [{ id: 'subG6', name: 'Canned Goods' }, { id: 'subG7', name: 'Pasta & Grains' }],
};
const vendors = [{ id: 'venG1', name: 'SuperMart' }, { id: 'venG2', name: 'Local Grocer' }];


function EditGroceryProductModal({ isModalOpen, handleOk, handleCancel, productData }) {
    const [form] = Form.useForm();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (productData && isModalOpen) {
            // Pre-fill form
            // Assuming productData has a similar structure, adjust keys if necessary
            form.setFieldsValue({
                name: productData.product_name, // Use product_name based on likely data structure
                description: productData.description,
                vendor: productData.vendor_id, // Assuming vendor ID is stored like this
                category: productData.category_id, // Assuming category ID
                subCategory: productData.subcategory_id, // Assuming subcategory ID
                price: productData.original_price, // Use original_price
                offerPrice: productData.offer_price, // Use offer_price
                stock: productData.stock_quantity, // Use stock_quantity
                // No dietary preference here
            });
            setSelectedCategory(productData.category_id);

            // Handle existing images
            // Adapt based on how images are actually stored in your data.json
            const existingImages = productData.image?.map((imgUrl, index) => ({
                uid: `existing-${index}-${productData.id}`, // Create a unique ID
                name: `image-${index}.png`, // Placeholder name
                status: 'done',
                url: imgUrl, // Assuming image is just a URL string in an array
            })) || [];
            setFileList(existingImages);

        } else if (!isModalOpen) {
            form.resetFields();
            setFileList([]);
            setSelectedCategory(null);
        }
    }, [productData, isModalOpen, form]);

    const onFinish = (values) => {
        // Structure the updated data for potential API call
        const updatedProductData = {
            ...productData,
            product_name: values.name,
            description: values.description,
            vendor_id: values.vendor,
            category_id: values.category,
            subcategory_id: values.subCategory,
            original_price: values.price,
            offer_price: values.offerPrice,
            stock_quantity: values.stock,
            images: fileList // Handle image updates (new uploads vs existing)
            // Add logic here to differentiate between new files in fileList and existing ones
        };
        // console.log('Updated grocery product data: ', updatedProductData);
        // API call to update the grocery product would go here
        handleOk();
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        form.setFieldsValue({ subCategory: undefined });
    };

    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        setFileList(e?.fileList);
        return e?.fileList;
    };

    const handleRemove = file => {
        // console.log("Removing file:", file);
        // Add API call logic here if removing an already uploaded file (e.g., check if file.url exists)
        setFileList(prevFileList => prevFileList.filter(item => item.uid !== file.uid));
        return true;
    };

    return (
        <Modal
            title={`Edit Grocery Product: ${productData?.product_name || ''}`} // Updated title
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Save Changes"
            cancelText="Cancel"
            width={800}
        >
            <Form
                form={form}
                layout="vertical"
                name="edit_grocery_product_form" // Updated form name
                onFinish={onFinish}
            >
                {/* Form items similar to Add modal, pre-filled */}
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

                {/* Dietary preference removed */}

                <Form.Item
                    name="images"
                    label="Product Images"
                    valuePropName="fileList"
                    getValueFromEvent={normFile}
                >
                    <Upload
                        action="/upload.do" // Replace with actual upload endpoint
                        listType="picture"
                        fileList={fileList}
                        onRemove={handleRemove}
                        beforeUpload={() => false} // Handle upload manually
                        multiple
                    >
                        <Button icon={<UploadOutlined />}>Upload New / Replace</Button>
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default EditGroceryProductModal; 