import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Descriptions,
  message,
} from "antd";
import { MdRemoveCircle } from "react-icons/md";

const WalletDeductModal = ({ visible, user, onDeduct, onClose, loading }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = async (values) => {
    setSubmitting(true);
    try {
      await onDeduct(user._id, {
        amount: values.amount,
        reason: values.reason || "Admin deduction",
      });
      form.resetFields();
    } catch (error) {
      console.error("Wallet deduct failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <MdRemoveCircle className="text-red-500 text-xl" />
          <span>Deduct User Balance</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {user && (
        <div className="py-4">
          <Descriptions bordered column={1} size="small" className="mb-6">
            <Descriptions.Item label="User Name">{user.name}</Descriptions.Item>
            <Descriptions.Item label="Mobile Number">
              {user.mobileNo}
            </Descriptions.Item>
            <Descriptions.Item label="Current Balance">
              <span className="text-green-600 font-bold text-lg">
                ₹{user.wallet || 0}
              </span>
            </Descriptions.Item>
          </Descriptions>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ amount: 0 }}
          >
            <Form.Item
              name="amount"
              label="Deduct Amount (₹)"
              rules={[
                { required: true, message: "Please enter an amount" },
                {
                  type: "number",
                  min: 1,
                  message: "Amount must be at least 1",
                },
                {
                  validator: (_, value) => {
                    if (value > (user.wallet || 0)) {
                      return Promise.reject(
                        new Error("Cannot deduct more than current balance"),
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <InputNumber
                className="w-full"
                size="large"
                min={1}
                max={user.wallet || 0}
                precision={0}
                placeholder="Enter amount to deduct"
                formatter={(value) =>
                  `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value) => value.replace(/\₹\s?|(,*)/g, "")}
              />
            </Form.Item>

            <Form.Item
              name="reason"
              label="Reason (Optional)"
              rules={[
                { max: 200, message: "Reason cannot exceed 200 characters" },
              ]}
            >
              <Input.TextArea
                rows={3}
                placeholder="Enter reason for deduction"
                maxLength={200}
                showCount
              />
            </Form.Item>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={onClose}>Cancel</Button>
              <Button
                type="primary"
                danger
                htmlType="submit"
                loading={submitting || loading}
              >
                Deduct Balance
              </Button>
            </div>
          </Form>
        </div>
      )}
    </Modal>
  );
};

export default WalletDeductModal;
