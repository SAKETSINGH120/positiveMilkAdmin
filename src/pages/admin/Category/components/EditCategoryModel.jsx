import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  message,
  Upload,
  Row,
  Col,
  Select,
  InputNumber,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { updateCategory } from "../../../../services/apiCategory";
import dataURLtoFile from "../../../../utils/fileConverter";
import ImgCrop from "antd-img-crop";

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function EditCategoryModel({
  isModalOpen,
  handleOk,
  handleCancel,
  categoryData,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    if (categoryData) {
      form.setFieldsValue({
        categoryName: categoryData.name,
        gst: categoryData.gst,
        type: categoryData.type,
        serviceId: categoryData.serviceId._id,
        priority: categoryData.priority || "no-priority",
      });
      setImageUrl(categoryData.image);
    }
  }, [categoryData, form]);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return Upload.LIST_IGNORE;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must be smaller than 10MB!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
      form.setFieldsValue({ image: file });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("name", values.categoryName);
    formData.append("gst", values.gst);
    // formData.append("type", values.type);
    formData.append("serviceId", values.serviceId);
    formData.append("priority", values.priority);

    if (
      imageUrl &&
      imageUrl !== categoryData.image &&
      imageUrl.startsWith("data:")
    ) {
      const file = dataURLtoFile(imageUrl, "category.png");
      formData.append("image", file);
    }

    setLoading(true);
    try {
      await updateCategory(categoryData._id, formData);
      message.success("Category updated successfully!");
      form.resetFields();
      handleOk();
    } catch (error) {
      message.error("Error updating category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Edit Category"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Update Category"
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxWidth: 600 }}
        onFinish={handleSubmit}
      >
        <Form.Item
          label="Category Name"
          name="categoryName"
          rules={[{ required: true, message: "Please enter category name!" }]}
        >
          <Input placeholder="Enter Category Name" />
        </Form.Item>

        <Form.Item
          label="GST (%)"
          name="gst"
          rules={[
            { required: true, message: "Please enter GST percentage!" },
            {
              type: "number",
              min: 0,
              max: 100,
              message: "GST must be between 0 and 100!",
            },
          ]}
        >
          <InputNumber
            placeholder="Enter GST percentage"
            min={0}
            max={100}
            step={0.01}
            style={{ width: "100%" }}
            controls={false}
            onChange={(value) => {
              // Only allow numeric values
              if (value !== null && value !== undefined) {
                form.setFieldValue("gst", value);
              }
            }}
            onKeyPress={(e) => {
              // Prevent non-numeric characters
              const char = String.fromCharCode(e.which);
              if (!/[0-9.]/.test(char)) {
                e.preventDefault();
              }
            }}
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="serviceId"
              label="Service"
              // label="Milk or Grocery"
              rules={[{ required: true, message: "Please select a service" }]}
            >
              <Select placeholder="Select service">
                <Option value="67ecc79120a93fc0b92a8b19">Milk</Option>
                {/* <Option value="67ecc79a20a93fc0b92a8b1b">Grocery</Option> */}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Priority"
              name="priority"
              rules={[{ required: true, message: "Please select a priority!" }]}
            >
              <Select placeholder="Select Priority">
                <Option value="no-priority">No Priority</Option>
                {[...Array(10)].map((_, i) => (
                  <Option key={i + 1} value={i + 1}>
                    {i + 1}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Category Image" name="image">
          <ImgCrop
            rotationSlider
            aspect={1}
            quality={1}
            modalTitle="Crop your category image"
          >
            <Upload
              name="image"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={({ onSuccess }) =>
                setTimeout(() => onSuccess("ok"), 0)
              }
              onChange={handleChange}
            >
              {imageUrl ? (
                <img
                  src={
                    imageUrl.startsWith("data:")
                      ? imageUrl
                      : `${BASE_URL}/${imageUrl}`
                  }
                  alt="Preview"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                uploadButton
              )}
            </Upload>
          </ImgCrop>
          <div style={{ fontSize: "12px", color: "#888" }}>
            Recommended Size: <strong>150 x 150 px</strong>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditCategoryModel;
