import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Upload, Button, message, Tabs, Avatar, Space, Tag } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { vendorUpdate } from '../../../../services/apiVendor';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditVendorModal = ({ isModalOpen, handleCancel, vendorData, fetchVendorDetails }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('1');
    const [panPreview, setPanPreview] = useState(null);
    const [gstPreview, setGstPreview] = useState(null);
    const [foodPreview, setFoodPreview] = useState(null);
    const [passbookPreview, setPassbookPreview] = useState(null);

    // Set initial form values when modal opens
    useEffect(() => {
        if (isModalOpen && vendorData) {
            const { vendor } = vendorData;
            form.setFieldsValue({
                name: vendor?.name || '',
                mobile: vendor?.mobile || '',
                alternate_phoneNo: vendor?.alternate_phoneNo || '',
                email: vendor?.email || '',
                address: vendor?.address || '',
                panNo: vendor?.panNo === 'undefined' ? '' : (vendor?.panNo || ''),
                gstNo: vendor?.gstNo === 'undefined' ? '' : (vendor?.gstNo || ''),
                foodLicense: vendor?.foodLicense === 'undefined' ? '' : (vendor?.foodLicense || ''),
                bankName: vendor?.bankName === 'undefined' ? '' : (vendor?.bankName || ''),
                ifsc: vendor?.ifsc === 'undefined' ? '' : (vendor?.ifsc || ''),
                branchName: vendor?.branchName === 'undefined' ? '' : (vendor?.branchName || ''),
                accountNo: vendor?.accountNo === 'undefined' ? '' : (vendor?.accountNo || ''),
                benificiaryName: vendor?.benificiaryName === 'undefined' ? '' : (vendor?.benificiaryName || ''),
            });

            // Set image previews
            if (vendor?.panImage) setPanPreview(`${BASE_URL}/${vendor.panImage}`);
            if (vendor?.gstImage) setGstPreview(`${BASE_URL}/${vendor.gstImage}`);
            if (vendor?.foodImage) setFoodPreview(`${BASE_URL}/${vendor.foodImage}`);
            if (vendor?.passbook) setPassbookPreview(`${BASE_URL}/${vendor.passbook}`);
        }
    }, [isModalOpen, vendorData, form]);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const formData = new FormData();
            const { vendor } = vendorData;
            
            // Only append changed values
            if (values.name !== vendor?.name) {
                formData.append("name", values.name);
            }
            if (values.mobile !== vendor?.mobile) {
                formData.append("mobile", values.mobile);
            }
            if (values.alternate_phoneNo !== vendor?.alternate_phoneNo) {
                formData.append("alternate_phoneNo", values.alternate_phoneNo);
            }
            if (values.email !== vendor?.email) {
                formData.append("email", values.email);
            }
            if (values.address !== vendor?.address) {
                formData.append("address", values.address);
            }
            
            // Document info - only if changed and not empty
            if (values.panNo && values.panNo !== vendor?.panNo && values.panNo !== 'undefined') {
                formData.append("panNo", values.panNo);
            }
            if (values.gstNo && values.gstNo !== vendor?.gstNo && values.gstNo !== 'undefined') {
                formData.append("gstNo", values.gstNo);
            }
            if (values.foodLicense && values.foodLicense !== vendor?.foodLicense && values.foodLicense !== 'undefined') {
                formData.append("foodLicense", values.foodLicense);
            }
            
            // Bank info - only if changed and not empty
            if (values.bankName && values.bankName !== vendor?.bankName && values.bankName !== 'undefined') {
                formData.append("bankName", values.bankName);
            }
            if (values.ifsc && values.ifsc !== vendor?.ifsc && values.ifsc !== 'undefined') {
                formData.append("ifsc", values.ifsc);
            }
            if (values.branchName && values.branchName !== vendor?.branchName && values.branchName !== 'undefined') {
                formData.append("branchName", values.branchName);
            }
            if (values.accountNo && values.accountNo !== vendor?.accountNo && values.accountNo !== 'undefined') {
                formData.append("accountNo", values.accountNo);
            }
            if (values.benificiaryName && values.benificiaryName !== vendor?.benificiaryName && values.benificiaryName !== 'undefined') {
                formData.append("benificiaryName", values.benificiaryName);
            }
            
            // Append files if uploaded
            if (values.panImage?.length) {
                formData.append("panImage", values.panImage[0].originFileObj);
            }
            if (values.gstImage?.length) {
                formData.append("gstImage", values.gstImage[0].originFileObj);
            }
            if (values.foodImage?.length) {
                formData.append("foodImage", values.foodImage[0].originFileObj);
            }
            if (values.passbook?.length) {
                formData.append("passbook", values.passbook[0].originFileObj);
            }

            // Only proceed if there are changes
            if (formData.entries().next().done) {
                message.info('No changes detected');
                return;
            }

            await vendorUpdate(vendorData.vendor._id, formData);
            message.success('Vendor information updated successfully!');
            fetchVendorDetails(); // Refresh the vendor details
            handleCancel();
        } catch {
            message.error('Failed to update vendor information');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelModal = () => {
        form.resetFields();
        setPanPreview(null);
        setGstPreview(null);
        setFoodPreview(null);
        setPassbookPreview(null);
        setActiveTab('1');
        handleCancel();
    };

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

    const tabItems = [
        {
            key: '1',
            label: 'Profile Info',
            children: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Name" name="name" rules={[{ required: true, message: "Name is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Mobile Number" name="mobile" rules={[{ required: true, message: "Mobile is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Alternate Phone" name="alternate_phoneNo">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email" rules={[{ required: true, message: "Email is required" }, { type: 'email', message: "Please enter a valid email" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Address" name="address" className="md:col-span-2">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </div>
            )
        },
        {
            key: '2',
            label: 'Bank Details',
            children: (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Bank Name" name="bankName" rules={[{ required: true, message: "Bank Name is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="IFSC Code"
                        name="ifsc"
                        rules={[
                            { required: true, message: "IFSC code is required" },
                            { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Please enter a valid IFSC code' }
                        ]}
                    >
                        <Input onChange={(e) => form.setFieldsValue({ ifsc: e.target.value.toUpperCase() })} />
                    </Form.Item>
                    <Form.Item label="Branch Name" name="branchName" rules={[{ required: true, message: "Branch Name is required" }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Account Number"
                        name="accountNo"
                        rules={[
                            { required: true, message: "Account no is required" },
                            { pattern: /^[0-9]{9,18}$/, message: 'Enter a valid account number' }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="Benificiary Name" name="benificiaryName" rules={[{ required: true, message: "Benificiary Name is required" }]}>
                        <Input />
                    </Form.Item>
                    {makeUploadItem("Passbook Image", "passbook", passbookPreview, setPassbookPreview)}
                </div>
            )
        },
        {
            key: '3',
            label: 'Documents',
            children: (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Form.Item 
                            label="PAN Number" 
                            name="panNo" 
                            rules={[
                                { required: true, message: "Business PAN Number is required" },
                                { pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, message: "Enter a valid PAN" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            label="GST Number" 
                            name="gstNo" 
                            rules={[
                                { pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: "Enter a valid GST Number" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item 
                            label="Food License" 
                            name="foodLicense" 
                            rules={[
                                { pattern: /^[0-9]{14}$/, message: "Enter valid Food License Number" }
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {makeUploadItem("PAN Image", "panImage", panPreview, setPanPreview)}
                        {makeUploadItem("GST Image", "gstImage", gstPreview, setGstPreview)}
                        {makeUploadItem("Food Image", "foodImage", foodPreview, setFoodPreview)}
                    </div>
                </div>
            )
        }
    ];

    return (
        <Modal
            title="Edit Vendor Information"
            open={isModalOpen}
            onCancel={handleCancelModal}
            footer={null}
            width={800}
            destroyOnClose
        >
            {vendorData && (
                <div>
                    {/* Vendor Info Display */}
                    <div style={{ 
                        padding: '16px', 
                        border: '1px solid #d9d9d9', 
                        borderRadius: '6px',
                        backgroundColor: '#fafafa',
                        marginBottom: '16px'
                    }}>
                        <Space align="start">
                            <Avatar size={60} src={`${BASE_URL}/${vendorData.vendor?.profileImg}`} />
                            <div>
                                <h4 style={{ margin: '0 0 8px 0' }}>{vendorData.vendor?.name}</h4>
                                <div style={{ marginBottom: '4px' }}>
                                    <strong>User ID:</strong> {vendorData.vendor?.userId}
                                </div>
                                <div style={{ marginBottom: '4px' }}>
                                    <strong>Status:</strong>
                                    <Tag color={vendorData.vendor?.isApproved ? "green" : "red"} style={{ marginLeft: 8 }}>
                                        {vendorData.vendor?.isApproved ? "Approved" : "Not Approved"}
                                    </Tag>
                                    <Tag color={vendorData.vendor?.isBlock ? "red" : "green"} style={{ marginLeft: 8 }}>
                                        {vendorData.vendor?.isBlock ? "Blocked" : "Active"}
                                    </Tag>
                                </div>
                            </div>
                        </Space>
                    </div>

                    {/* Edit Form */}
                    <Form form={form} layout="vertical" onFinish={handleSubmit}>
                        <Tabs 
                            activeKey={activeTab} 
                            onChange={setActiveTab} 
                            items={tabItems}
                            style={{ marginBottom: '16px' }}
                        />
                        
                        <div style={{ textAlign: 'right' }}>
                            <Space>
                                <Button onClick={handleCancelModal}>
                                    Cancel
                                </Button>
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Update Vendor
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </div>
            )}
        </Modal>
    );
};

export default EditVendorModal; 