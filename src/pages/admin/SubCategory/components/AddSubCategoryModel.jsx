import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, message, Upload, Select, Avatar } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { addCategory, getAllCategory } from '@services/apiCategory';
import ImgCrop from 'antd-img-crop';

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function AddSubCategoryModel({ isModalOpen, handleOk, handleCancel }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState(null);
    const [croppedFile, setCroppedFile] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getAllCategory();
                setCategories(res);
            } catch (error) {
                message.error("Failed to load categories.");
            }
        };
        fetchCategories();
    }, []);

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG files!');
            return Upload.LIST_IGNORE;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must be smaller than 10MB!');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    const handleChange = (info) => {
        const file = info.file.originFileObj;
        if (file) {
            setCroppedFile(file); // store cropped file
            const reader = new FileReader();
            reader.onload = () => {
                setImageUrl(reader.result); // for preview
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const handleSubmit = async (values) => {
        if (!croppedFile) {
            return message.error("Please upload and crop a subcategory image.");
        }

        const formData = new FormData();
        formData.append("name", values.subcategoryName);
        formData.append("cat_id", values.categoryName);
        formData.append("image", croppedFile);

        try {
            setLoading(true);
            await addCategory(formData);
            message.success('Subcategory added successfully!');
            form.resetFields();
            setImageUrl(null);
            setCroppedFile(null);
            handleOk();
        } catch (error) {
            message.error('Failed to add sub category');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Add Sub Category"
            open={isModalOpen}
            onOk={form.submit}
            onCancel={() => {
                handleCancel();
                form.resetFields();
                setImageUrl(null);
                setCroppedFile(null);
            }}
            confirmLoading={loading}
            okText="Add Sub Category"
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    label="Category Name"
                    name="categoryName"
                    rules={[{ required: true, message: 'Please select a category!' }]}
                >
                    <Select
                        showSearch
                        placeholder="Select a category"
                        optionFilterProp="label"
                        filterOption={(input, option) =>
                            option?.label?.toLowerCase().includes(input.toLowerCase())
                        }
                    >
                        {categories.map(cat => (
                            <Option key={cat._id} value={cat._id} label={cat.name}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Avatar size="small" src={`${BASE_URL}/${cat.image}`} />
                                    <span>{cat.name} - {cat.serviceId?.name}</span>
                                </div>
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Sub Category Name"
                    name="subcategoryName"
                    rules={[{ required: true, message: 'Please enter sub category name!' }]}
                >
                    <Input placeholder="Enter Sub Category Name" />
                </Form.Item>

                <Form.Item label="Sub Category Image" name="image">
                    <ImgCrop
                        rotationSlider
                        aspect={1}
                        quality={1}
                        modalTitle="Crop your sub category image"
                    >
                        <Upload
                            name="image"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                            onChange={handleChange}
                        >
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Preview"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                uploadButton
                            )}
                        </Upload>
                    </ImgCrop>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                        Recommended size: <strong>150x150 px</strong>
                    </div>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default AddSubCategoryModel;
