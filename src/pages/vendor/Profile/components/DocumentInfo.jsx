// components/DocumentInfo.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const DocumentInfo = ({ vendor, form, updateDocument, BASE_URL, loading }) => {
    const [panPreview, setPanPreview] = useState(null);
    const [gstPreview, setGstPreview] = useState(null);
    const [foodPreview, setFoodPreview] = useState(null);

    useEffect(() => {
        if (vendor) {
            if (vendor.panImage) setPanPreview(`${BASE_URL}/${vendor.panImage}`);
            if (vendor.gstImage) setGstPreview(`${BASE_URL}/${vendor.gstImage}`);
            if (vendor.foodImage) setFoodPreview(`${BASE_URL}/${vendor.foodImage}`);
        }
    }, [vendor, form, BASE_URL]);

    const makeUploadItem = (label, name, preview, setPreview) => (
        preview ? (
            <div className="mt-4">
                <label className="block mb-2 font-medium">{label}</label>
                <img src={preview} alt={label} className="rounded shadow max-h-40 object-contain mb-2" />
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => {
                        setPreview(null);
                        form.setFieldsValue({ [name]: [] });
                    }}
                >
                    Remove Image
                </Button>
            </div>
        ) : (
            <Form.Item
                label={label}
                name={name}
                valuePropName="fileList"
                getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList || []}
            >
                <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload {label}</Button>
                </Upload>
            </Form.Item>
        )
    );

    return (
        <Form form={form} layout="vertical" onFinish={updateDocument}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="PAN Number" name="panNo" rules={[{ required: true, message: "Business PAN Number is required" }, { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Enter a valid PAN" }]}>
                    <Input variant='filled' />
                </Form.Item>
                <Form.Item label="GST Number" name="gstNo" rules={[{ pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: "Enter a valid GST Number" }]}>
                    <Input variant='filled' />
                </Form.Item>
                <Form.Item label="Food License" name="foodLicense" rules={[{ pattern: /^[0-9]{14}$/, message: "Enter valid Food License Number" }]}>
                    <Input variant='filled' />
                </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {makeUploadItem("PAN Image", "panImage", panPreview, setPanPreview)}
                {makeUploadItem("GST Image", "gstImage", gstPreview, setGstPreview)}
                {makeUploadItem("Food Image", "foodImage", foodPreview, setFoodPreview)}
            </div>

            <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="mt-4"
            >
                Update Documents
            </Button>
        </Form>
    );
};

export default DocumentInfo;
