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
  Col,
} from 'antd';
import moment from 'moment';
import { updateCoupon } from '../../../../services/vendor/apiCoupon';

const { Option } = Select;

function EditCouponModel({ isModalOpen, handleOk, handleCancel, couponData, shops }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (couponData) {
      form.setFieldsValue({
        code: couponData.code,
        discountType: couponData.discountType,
        shopId: couponData.shopId,
        discountValue: couponData.discountValue,
        minOrderAmount: couponData.minOrderAmount,
        usageLimit: couponData.usageLimit,
        singlePersonUsageLimit: couponData.singlePersonUsageLimit,
        startDate: couponData.startDate ? moment(couponData.startDate) : null,
        expiryDate: couponData.expiryDate ? moment(couponData.expiryDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [couponData, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const payload = {
        code: values.code,
        discountType: values.discountType,
        shopId: values.shopId,
        discountValue: values.discountValue,
        minOrderAmount: values.minOrderAmount,
        usageLimit: values.usageLimit,
        singlePersonUsageLimit: values.singlePersonUsageLimit,
        startDate: values.startDate?.toISOString(),
        expiryDate: values.expiryDate?.toISOString(),
      };

      await updateCoupon(couponData._id, payload);
      message.success('Coupon updated successfully!');
      handleOk();
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || 'Failed to update coupon.';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Coupon"
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={() => form.submit()}
      confirmLoading={loading}
      okText="Update Coupon"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
          label="Choose Shop"
          name="shopId"
          rules={[{ required: true, message: 'Please select a shop' }]}
        >
          <Select placeholder="Select shop">
            {shops?.map((shop) => (
              <Option key={shop._id} value={shop._id}>
                {shop.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Discount Value"
              name="discountValue"
              rules={[{ required: true, message: 'Please enter the discount value' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 80" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Minimum Order Amount"
              name="minOrderAmount"
              rules={[{ required: true, message: 'Please enter minimum order amount' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} placeholder="e.g. 5000" />
            </Form.Item>
          </Col>
        </Row>

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

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: 'Please select a start date' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Expiry Date"
              name="expiryDate"
              rules={[{ required: true, message: 'Please select an expiry date' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default EditCouponModel;
