import React, { useEffect } from 'react'
import { Button, Form, Input, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useWatch } from 'antd/es/form/Form';

function Account({ form }) {
    const ifsc = useWatch('ifsc', form);

    useEffect(() => {
        const fetchIFSCDetails = async () => {
            if (ifsc && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
                try {
                    const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
                    const data = await res.json();
                    if (data.BANK && data.BRANCH) {
                        form.setFieldsValue({
                            bankName: data.BANK,
                            branchName: data.BRANCH,
                        });
                    } else {
                        throw new Error();
                    }
                } catch {
                    message.error('Invalid IFSC code');
                    form.setFieldsValue({
                        bankName: '',
                        branchName: '',
                    });
                }
            }
        };

        fetchIFSCDetails();
    }, [ifsc, form]);

    return (
        <>
            <Form.Item name="ifsc" label="IFSC Code" rules={[{ pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Please enter a valid IFSC code' }]}>
                <Input onChange={(e) => { form.setFieldsValue({ ifsc: e.target.value.toUpperCase() }); }} />
            </Form.Item>
            <Form.Item name="bankName" label="Bank Name">
                <Input readOnly variant="filled" />
            </Form.Item>
            <Form.Item name="branchName" label="Branch Name">
                <Input readOnly variant="filled" />
            </Form.Item>
            <Form.Item name="accountNo" label="Account No" rules={[{ pattern: /^[0-9]{9,18}$/, message: "Enter a valid account number" },]}>
                <Input type='number' maxLength={18} />
            </Form.Item>
            <Form.Item name="benificiaryName" label="Benificiary Name">
                <Input />
            </Form.Item>
            {/* <Form.Item name="passbook" label="Passbook/Statement/Cheque" valuePropName="fileList" getValueFromEvent={e => e.fileList} >
                <Upload beforeUpload={() => false} listType="picture">
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Form.Item> */}
            <Form.Item
                name="passbook"
                label="Passbook/Statement/Cheque"
                valuePropName="fileList"
                getValueFromEvent={e => Array.isArray(e) ? e : e?.fileList}
            >
                <Upload
                    beforeUpload={() => false}
                    listType="picture"
                    onPreview={file => {
                        const src = file.url || URL.createObjectURL(file.originFileObj);
                        const imgWindow = window.open(src);
                        imgWindow?.document.write(`<img src="${src}" />`);
                    }}
                >
                    <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Form.Item>

        </>
    )
}

export default Account
