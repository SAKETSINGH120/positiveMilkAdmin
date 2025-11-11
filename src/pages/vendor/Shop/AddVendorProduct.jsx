import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, Row, Col, Avatar, message, Spin } from 'antd';
import { UploadOutlined, PlusOutlined } from '@ant-design/icons';
import { addProduct } from '../../../services/vendor/apiProduct';
import { getAllCategory, getAllSubCategory } from '../../../services/vendor/apiCategory';
import { useParams } from 'react-router';

const { Option } = Select;

const AddVendorProduct = () => {
    const [form] = Form.useForm();
    const { shopId } = useParams();

    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [primaryImageList, setPrimaryImageList] = useState([]);
    const [galleryImageList, setGalleryImageList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, subRes] = await Promise.all([getAllCategory(), getAllSubCategory()]);
                setCategories(catRes || []);
                setSubCategories(subRes || []);
            } catch {
                message.error('Failed to fetch category data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePriceChange = () => {
        const { mrp, sellingPrice } = form.getFieldsValue();
        if (mrp && sellingPrice) {
            const discount = Math.max(0, Math.round(((mrp - sellingPrice) / mrp) * 100));
            form.setFieldsValue({ discount });
        }
    };

    const handleImageListChange = (setter) => (e) => {
        const files = Array.isArray(e) ? e : e?.fileList || [];
        setter(files);
        return files;
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        const filtered = subCategories.filter(sub => sub.cat_id === value || sub.cat_id?._id === value);
        setFilteredSubCategories(filtered);
        form.setFieldsValue({ subCategory: undefined });
    };

    const onFinish = async (values) => {
        const formData = new FormData();
        const fields = {
            name: values.name,
            shopId,
            mrp: values.mrp,
            sellingPrice: values.sellingPrice,
            discount: values.discount || 0,
            unitOfMeasurement: values.unitOfMeasurement,
            sellingUnit: values.sellingUnit,
            serviceId: "67ecc79120a93fc0b92a8b19", // Always Food
            type: values.type,
            categoryId: values.category,
            subCategoryId: values.subCategory || '',
            shortDescription: values.shortDescription,
            longDescription: values.longDescription,
        };

        Object.entries(fields).forEach(([key, value]) => formData.append(key, value));

        if (primaryImageList.length > 0) {
            formData.append('primary_image', primaryImageList[0].originFileObj);
        }
        galleryImageList.forEach(file => {
            formData.append('gallery_image', file.originFileObj);
        });

        try {
            await addProduct(formData);
            message.success("Product added successfully!");
            form.resetFields();
            setPrimaryImageList([]);
            setGalleryImageList([]);
            setFilteredSubCategories([]);
        } catch (err) {
            console.error(err);
            message.error("Failed to add product.");
        }
    };

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <div className="lg:px-10 px-5 py-6">
            <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
            <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item name="mrp" label="MRP (₹)" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} onChange={handlePriceChange} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="sellingPrice" label="Selling Price (₹)" rules={[{ required: true }]}>
                            <InputNumber min={0} style={{ width: '100%' }} onChange={handlePriceChange} />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item name="discount" label="Discount (%)">
                            <InputNumber min={0} max={100} style={{ width: '100%' }} readOnly />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="unitOfMeasurement" label="Unit of Measurement" rules={[{ required: true }]}>
                            <Input placeholder="e.g., grams" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="sellingUnit" label="Selling Unit" rules={[{ required: true }]}>
                            <Input placeholder="e.g., 1 pack" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={6}>
                        <Form.Item name="serviceId" label="Service Type" rules={[{ required: true }]}>
                            <Select
                                placeholder="Select service"
                            >
                                <Option value="67ecc79120a93fc0b92a8b19">Food</Option>
                                {/* <Option value="67ecc79a20a93fc0b92a8b1b">Grocery</Option> */}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                            <Select placeholder="Select type">
                                <Option value="veg">Veg</Option>
                                <Option value="nonveg">Non-Veg</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                            <Select placeholder="Select category" onChange={handleCategoryChange}>
                                {categories.map(cat => (
                                    <Option key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="subCategory" label="Sub-Category">
                            <Select placeholder="Select sub-category" disabled={!selectedCategory}>
                                {filteredSubCategories.map(sub => (
                                    <Option key={sub._id} value={sub._id}>
                                        {sub.name}
                                    </Option>
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
                        <Form.Item
                            name="primary_image"
                            label="Primary Image"
                            valuePropName="fileList"
                            getValueFromEvent={handleImageListChange(setPrimaryImageList)}
                            rules={[{ required: true }]}
                        >
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
                        <Form.Item
                            name="gallery_image"
                            label="Gallery Images"
                            valuePropName="fileList"
                            getValueFromEvent={handleImageListChange(setGalleryImageList)}
                        >
                            <Upload.Dragger
                                listType="picture"
                                beforeUpload={() => false}
                                multiple
                                onRemove={file => {
                                    setGalleryImageList(prev => prev.filter(item => item.uid !== file.uid));
                                    return true;
                                }}
                            >
                                <p className="ant-upload-drag-icon"><UploadOutlined /></p>
                                <p className="ant-upload-text">Click or drag to upload</p>
                                <p className="ant-upload-hint">Supports multiple uploads.</p>
                            </Upload.Dragger>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit">Add Product</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddVendorProduct;
