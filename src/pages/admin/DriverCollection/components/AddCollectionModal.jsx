import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, Descriptions, Spin } from "antd";
import { getUserByMobile } from "../../../../services/admin/apiUser";
import { getAllDrivers } from "../../../../services/admin/apiDrivers";

const AddCollectionModal = ({ visible, onCancel, onOk }) => {
    const [form] = Form.useForm();
    const [user, setUser] = useState(null);
    const [userLoading, setUserLoading] = useState(false);
    const [drivers, setDrivers] = useState([]);
    const [driversLoading, setDriversLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchDrivers();
            form.resetFields();
            setUser(null);
        }
    }, [visible]);

    const fetchDrivers = async () => {
        setDriversLoading(true);
        try {
            const res = await getAllDrivers();
            setDrivers(res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setDriversLoading(false);
        }
    };

    const handleMobileChange = async (e) => {
        const mobile = e.target.value;
        if (mobile.length === 10) {
            setUserLoading(true);
            try {
                const res = await getUserByMobile(mobile);
                if (res.data && res.data.length > 0) {
                    setUser(res.data[0]);
                    form.setFieldsValue({ userId: res.data[0]._id });
                } else {
                    setUser(null);
                    form.setFieldsValue({ userId: undefined });
                }
            } catch (error) {
                console.error(error);
            } finally {
                setUserLoading(false);
            }
        } else {
            setUser(null);
            form.setFieldsValue({ userId: undefined });
        }
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onOk(values);
        });
    };

    return (
        <Modal
            title="Add Driver Collection"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText="Add"
            width={600}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="User Mobile Number"
                    name="mobileNo"
                    rules={[{ required: true, message: "Please enter user mobile number" }]}
                >
                    <Input placeholder="Enter 10-digit mobile number" onChange={handleMobileChange} maxLength={10} />
                </Form.Item>

                {userLoading ? (
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                        <Spin size="small" /> Searching user...
                    </div>
                ) : (
                    user && (
                        <div style={{ marginBottom: 20, padding: 10, backgroundColor: "#f5f5f5", borderRadius: 4 }}>
                            <Descriptions size="small" column={1}>
                                <Descriptions.Item label="User Name">{user.name}</Descriptions.Item>
                                <Descriptions.Item label="Current Wallet">₹{user.wallet || 0}</Descriptions.Item>
                            </Descriptions>
                        </div>
                    )
                )}

                {/* Hidden field for userId */}
                <Form.Item name="userId" hidden rules={[{ required: true, message: "Valid user required" }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Select Driver"
                    name="driverId"
                    rules={[{ required: true, message: "Please select a driver" }]}
                >
                    <Select
                        placeholder="Search driver by name"
                        showSearch
                        loading={driversLoading}
                        optionFilterProp="children"
                        options={drivers.map((d) => ({
                            value: d._id,
                            label: `${d.name} (${d.mobileNo})`,
                        }))}
                    />
                </Form.Item>

                <Form.Item
                    label="Amount Collected"
                    name="amount"
                    rules={[{ required: true, message: "Please enter amount" }]}
                >
                    <InputNumber
                        style={{ width: "100%" }}
                        placeholder="Enter amount"
                        min={1}
                        formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
                    />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea placeholder="Optional notes" rows={2} />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AddCollectionModal;
