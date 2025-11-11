import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';

const AccountInfo = ({ vendor, form, updateBankAccountDetails, BASE_URL, loading }) => {
    const [previewPassbook, setPreviewPassbook] = useState(null);

    useEffect(() => {
        // Set initial values from vendor if available
        if (vendor) {
            form.setFieldsValue({
                bankName: vendor.bankName || '',
                ifsc: vendor.ifsc || '',
                branchName: vendor.branchName || '',
                accountNo: vendor.accountNo || '',
                benificiaryName: vendor.benificiaryName || '',
            });

            if (vendor.passbook && vendor.passbook !== 'undefined') {
                setPreviewPassbook(`${BASE_URL}/${vendor.passbook}`);
            }
        }
    }, [vendor, form, BASE_URL]);

    return (
        <Form form={form} layout="vertical" onFinish={updateBankAccountDetails}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Bank Name" name="bankName" rules={[{ required: true, message: "Bank Name is required" }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="IFSC Code"
                    name="ifsc"
                    rules={[{ required: true, message: "IFSC code is required" }, { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Please enter a valid IFSC code', }]}
                >
                    <Input
                        onChange={(e) =>
                            form.setFieldsValue({ ifsc: e.target.value.toUpperCase() })
                        }
                    />
                </Form.Item>

                <Form.Item label="Branch Name" name="branchName" rules={[{ required: true, message: "Branch Name is required" }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Account Number"
                    name="accountNo"
                    rules={[{ required: true, message: "Account no is required" },
                    {
                        pattern: /^[0-9]{9,18}$/,
                        message: 'Enter a valid account number',
                    },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Benificiary Name"
                    name="benificiaryName"
                    rules={[{ required: true, message: "Benificiary Name is required" }]}
                >
                    <Input />
                </Form.Item>
            </div>

            {/* Show Upload button or uploaded image preview */}
            {previewPassbook ? (
                <div className="mt-4">
                    <label className="block mb-2 font-medium">Passbook Image</label>
                    <img
                        src={previewPassbook}
                        alt="Passbook"
                        className="rounded shadow max-h-40 object-contain mb-2"
                    />
                </div>
            ) : (
                <Form.Item
                    label="Passbook Image"
                    name="passbook"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => {
                        if (Array.isArray(e)) return e;
                        return e?.fileList || [];
                    }}
                >
                    <Upload maxCount={1} beforeUpload={() => false} listType="picture">
                        <Button icon={<UploadOutlined />}>Upload Passbook</Button>
                    </Upload>
                </Form.Item>
            )}

            <Button type="primary" htmlType="submit" loading={loading} className="mt-4">
                Update Bank Details
            </Button>
        </Form>
    );
};

export default AccountInfo;
