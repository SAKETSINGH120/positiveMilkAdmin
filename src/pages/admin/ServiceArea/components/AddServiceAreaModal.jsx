import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Switch,
  Button,
  Select,
  Spin,
} from "antd";
import { addServiceArea } from "../../../../services/admin/apiServiceArea";
import axios from "axios";

function AddServiceAreaModal({ isModalOpen, handleOk, handleCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);

  const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const handleSubmit = async (values) => {
    console.log("values", values);
    try {
      setLoading(true);
      await addServiceArea(values);
      message.success("Service area added successfully!");
      form.resetFields();
      handleOk();
    } catch (error) {
      message.error("Failed to add service area.");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    form.resetFields();
    handleCancel();
  };

  // Autofill city and state based on pincode
  const handlePincodeBlur = async () => {
    const pincode = form.getFieldValue("pincode");
    if (/^\d{6}$/.test(pincode)) {
      setPincodeLoading(true);
      try {
        const res = await axios.get(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = res.data?.[0]?.PostOffice?.[0];
        if (data) {
          form.setFieldsValue({
            city: data.District || "",
            state: data.State || "",
          });
        }
      } catch {
        // Optionally show error or ignore
      } finally {
        setPincodeLoading(false);
      }
    }
  };

  return (
    <Modal
      title="Add Service Area"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Add Service Area"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Pincode"
          name="pincode"
          rules={[
            { required: true, message: "Please enter pincode!" },
            {
              pattern: /^\d{6}$/,
              message: "Pincode must be a 6-digit number!",
            },
          ]}
        >
          <Input
            placeholder="Enter Pincode"
            onBlur={handlePincodeBlur}
            maxLength={6}
            suffix={pincodeLoading ? <Spin size="small" /> : null}
          />
        </Form.Item>
        <Form.Item
          label="City"
          name="city"
          rules={[{ required: true, message: "Please enter city!" }]}
        >
          <Input placeholder="Enter City" disabled={pincodeLoading} />
        </Form.Item>
        <Form.Item
          label="State"
          name="state"
          rules={[{ required: true, message: "Please select state!" }]}
        >
          <Select placeholder="Select State" disabled={pincodeLoading}>
            {INDIAN_STATES.map((state) => (
              <Select.Option key={state} value={state}>
                {state}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="isFoodAvailable" initialValue={true} hidden>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="isGroceryAvailable" initialValue={true} hidden>
          <Input type="hidden" />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddServiceAreaModal;
    