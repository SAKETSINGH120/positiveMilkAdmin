import React, { useState, useEffect } from 'react';
import {
    Modal, Form, Input, InputNumber, Select, Upload,
    Button, Row, Col, Avatar,
    message
} from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { addProduct } from '@services/apiProduct';

const { Option } = Select;

function AddVendorProductModal({ isModalOpen, data, handleOk, handleCancel }) {
    const { categories} = data;
    console.log(data)
    const [form] = Form.useForm();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [primaryImageList, setPrimaryImageList] = useState([]);
    const [galleryImageList, setGalleryImageList] = useState([]);

    const [selectedService, setSelectedService] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);

    useEffect(() => {
        if (isModalOpen) {
            form.resetFields();
            setSelectedCategory(null);
            setPrimaryImageList([]);
            setGalleryImageList([]);
        }
    }, [isModalOpen]);

    const handlePriceChange = () => {
        const { mrp, sellingPrice } = form.getFieldsValue();
        if (mrp && sellingPrice) {
            const discount = Math.max(0, Math.round(((mrp - sellingPrice) / mrp) * 100));
            form.setFieldsValue({ discount });
        }
    };

    const onFinish = async (values) => {
        try {
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("sku", values.sku);
            formData.append("mrp", values.mrp);
            formData.append("sellingPrice", values.sellingPrice);
            formData.append("discount", values.discount || 0);
            formData.append("unitOfMeasurement", values.unitOfMeasurement);
            formData.append("sellingUnit", values.sellingUnit);
            // formData.append("brandId", values.brandId);
            formData.append("serviceId", values.serviceId);
            formData.append("type", values.type);
            // formData.append("vendorId", values.vendor);
            formData.append("categoryId", values.category);
            formData.append("subCategoryId", values.subCategory);
            formData.append("shortDescription", values.shortDescription);
            formData.append("longDescription", values.longDescription);

            if (primaryImageList.length > 0) {
                formData.append("primary_image", primaryImageList[0].originFileObj);
            }

            galleryImageList.forEach(file => {
                formData.append("gallery_image", file.originFileObj);
            });

            await addProduct(formData);
            message.success("Product added successfully!");
            form.resetFields();
            setPrimaryImageList([]);
            setGalleryImageList([]);
            handleOk();
        } catch (error) {
            console.error(error);
            message.error("Failed to add product.");
        }
    };


    const getFileList = setter => e => {
        const files = Array.isArray(e) ? e : e?.fileList || [];
        setter(files);
        return files;
    };

    return (
        <Modal
            title="Add New Food Product"
            open={isModalOpen}
            onOk={() => form.submit()}
            onCancel={handleCancel}
            okText="Add Product"
            width={800}
        >
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={24} >
                        <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                            <Input placeholder='Enter Product name' />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {[
                        { name: 'mrp', label: 'MRP (₹)' },
                        { name: 'sellingPrice', label: 'Selling Price (₹)' }
                    ].map(({ name, label }) => (
                        <Col span={8} key={name}>
                            <Form.Item name={name} label={label} rules={[{ required: true }]}>
                                <InputNumber min={0} style={{ width: '100%' }} onChange={handlePriceChange} />
                            </Form.Item>
                        </Col>
                    ))}
                    <Col span={8}>
                        <Form.Item name="discount" label="Discount (%)">
                            <InputNumber min={0} max={100} style={{ width: '100%' }} readOnly />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    {[
                        { name: 'unitOfMeasurement', label: 'Unit of Measurement', placeholder: 'e.g., grams' },
                        { name: 'sellingUnit', label: 'Selling Unit', placeholder: 'e.g., 1 pack' }
                    ].map(({ name, label, placeholder }) => (
                        <Col span={12} key={name}>
                            <Form.Item name={name} label={label} rules={[{ required: true }]}>
                                <Input placeholder={placeholder} />
                            </Form.Item>
                        </Col>
                    ))}
                </Row>

                {/* <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="brandId" label="Brand" rules={[{ required: true }]}>
                            <Select placeholder="Select brand">{brand.map(b => (
                                <Option key={b._id} value={b._id}>{b.name}</Option>
                            ))}</Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="serviceId" label="Service Type" rules={[{ required: true }]}>
                            <Select placeholder="Select service">
                                <Option value="67ecc79120a93fc0b92a8b19">Food</Option>
                                <Option value="67ecc79a20a93fc0b92a8b1b">Grocery</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row> */}

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="serviceId" label="Service Type" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select service"
                                onChange={value => {
                                    setSelectedService(value);
                                    setSelectedType(null);
                                    setFilteredCategories([]);
                                    form.setFieldsValue({ type: undefined, category: undefined, subCategory: undefined });
                                }}
                            >
                                <Option value="67ecc79120a93fc0b92a8b19">Food</Option>
                                <Option value="67ecc79a20a93fc0b92a8b1b">Grocery</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select type"
                                onChange={value => {
                                    setSelectedType(value);
                                    const categoryList = categories.filter(cat =>
                                        cat.serviceId?._id === selectedService && cat.type === value
                                    );
                                    setFilteredCategories(categoryList);
                                    setFilteredSubCategories([]);
                                    form.setFieldsValue({ category: undefined, subCategory: undefined });
                                }}
                                disabled={!selectedService}
                            >
                                <Option value="veg">Veg</Option>
                                <Option value="nonveg">Non-Veg</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select category"
                                onChange={value => {
                                    setSelectedCategory(value);
                                    const subCats = data.subCategories.filter(sub => sub.cat_id._id === value);
                                    setFilteredSubCategories(subCats);
                                    form.setFieldsValue({ subCategory: undefined });
                                }}
                                disabled={!selectedType}
                            >
                                {filteredCategories.map(cat => (
                                    <Option key={cat._id} value={cat._id}>
                                        {cat.name} --- {cat.type}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="subCategory" label="Sub-Category" rules={[{ required: true }]}>
                            <Select placeholder="Select sub-category" disabled={!selectedCategory}>
                                {filteredSubCategories.map(sub => (
                                    <Option key={sub._id} value={sub._id}>{sub.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="shortDescription" label="Short Description" rules={[{ required: true }]}>
                    <Input.TextArea rows={2} />
                </Form.Item>

                <Form.Item name="longDescription" label="Long Description" rules={[{ required: true }]}>
                    <Input.TextArea rows={4} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="primary_image" label="Primary Image" valuePropName="fileList" getValueFromEvent={getFileList(setPrimaryImageList)} rules={[{ required: true }]}>
                            <Upload listType="picture-card" beforeUpload={() => false} maxCount={1} showUploadList={false}>
                                {primaryImageList.length > 0 ? (
                                    <Avatar src={URL.createObjectURL(primaryImageList[0].originFileObj)} size={100} shape="square" />
                                ) : (
                                    <div><PlusOutlined /><div style={{ marginTop: 8 }}>Upload</div></div>
                                )}
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={16}>
                        <Form.Item name="gallery_image" label="Gallery Images" valuePropName="fileList" getValueFromEvent={getFileList(setGalleryImageList)}>
                            <Upload.Dragger listType="picture" beforeUpload={() => false} multiple onRemove={file => {
                                setGalleryImageList(list => list.filter(item => item.uid !== file.uid));
                                return true;
                            }}>
                                <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                                <p className="ant-upload-text">Click or drag to upload</p>
                                <p className="ant-upload-hint">Supports multiple uploads.</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    );
}

export default AddVendorProductModal;
