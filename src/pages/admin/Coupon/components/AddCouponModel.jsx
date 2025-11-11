import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  DatePicker,
  Row,
  Col
} from 'antd';
import dayjs from 'dayjs';
import { addCoupon } from '../../../../services/admin/apiCoupon';
import { getAllShop } from '../../../../services/vendor/apiShop';

const { Option } = Select;

function AddCouponModal({ isModalOpen, handleOk, handleCancel }) {
  const [form] = Form.useForm();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);



  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      startDate: values.startDate?.toISOString(),
      expiryDate: values.expiryDate?.toISOString(),
    };

    // console.log("Submitting coupon:", payload);

    try {
      setLoading(true);
      const res = await addCoupon(payload);

      if (res?.data?.status) {
        message.success(res.data.message || 'Coupon created successfully.');
        form.resetFields();
        handleOk();
      } else {
        message.error(res?.data?.message || 'Something went wrong.');
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to add coupon.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add Coupon"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Add Coupon"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Coupon Code"
          name="code"
          rules={[{ required: true, message: 'Please enter the coupon code' }]}
        >
          <Input placeholder="e.g. SUMMER501" />
        </Form.Item>

        <Form.Item
          label="Discount Type"
          name="discountType"
          rules={[{ required: true, message: 'Please select a discount type' }]}
        >
          <Select placeholder="Select discount type">
            <Option value="percentage">Percentage</Option>
            <Option value="fixed">Flat</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Discount Value"
          name="discountValue"
          rules={[{ required: true, message: 'Please enter the discount value' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 80" />
        </Form.Item>

        <Form.Item
          label="Minimum Order Amount"
          name="minOrderAmount"
          rules={[{ required: true, message: 'Please enter minimum order amount' }]}
        >
          <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 5000" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Usage Limit"
              name="usageLimit"
              rules={[{ required: true, message: 'Please enter the usage limit' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 10" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Max Usage Per User"
              name="singlePersonUsageLimit"
              rules={[{ required: true, message: 'Please enter the max usage per user' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 10" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Start Date"
          name="startDate"
          rules={[{ required: true, message: 'Please select a start date' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          label="Expiry Date"
          name="expiryDate"
          rules={[{ required: true, message: 'Please select an expiry date' }]}
        >
          <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddCouponModal;
