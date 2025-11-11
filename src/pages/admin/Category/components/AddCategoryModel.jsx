import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Upload,
  Row,
  Col,
  Select,
} from "antd";
import ImgCrop from "antd-img-crop";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { addCategory, getAllCategory } from "@services/apiCategory";
import dataURLtoFile from "@utils/fileConverter";

const { Option } = Select;

function AddCategoryModel({ isModalOpen, handleOk, handleCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

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

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(fileList[0].originFileObj);
    } else {
      setImageUrl(null);
    }
  };

  const handleSubmit = async (values) => {
    if (!imageUrl) {
      return message.error("Please upload a category image.");
    }

    const file = dataURLtoFile(imageUrl, "category.png");
    const formData = new FormData();
    formData.append("name", values.categoryName);
    formData.append("gst", values.gst);
    // formData.append("type", values.type);
    formData.append("serviceId", values.serviceId);
    formData.append("image", file);

    try {
      setLoading(true);
      await addCategory(formData);
      message.success("Category added successfully!");
      form.resetFields();
      setImageUrl(null);
      setFileList([]);
      handleOk();
      getAllCategory();
    } catch (error) {
      message.error("Failed to add category.");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setImageUrl(null);
    setFileList([]);
    handleCancel();
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title="Add Category"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={onCancel}
      confirmLoading={loading}
      okText="Add Category"
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
          <Input placeholder="Enter New Category Name" />
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
          {/* <Col span={12}>
                        <Form.Item name="type" label="Veg or Non-Veg" rules={[{ required: true, message: 'Please select type!' }]}>
                            <Select placeholder="Select type">
                                <Option value="veg">Veg</Option>
                                <Option value="nonveg">Non Veg</Option>
                            </Select>
                        </Form.Item>
                    </Col> */}
          <Col span={12}>
            <Form.Item
              name="serviceId"
              // label="Milk or Grocery"
              label="Service"
              rules={[{ required: true, message: "Please select service!" }]}
            >
              <Select placeholder="Select service">
                <Option value="67ecc79120a93fc0b92a8b19">Milk</Option>
                {/* <Option value="67ecc79a20a93fc0b92a8b1b">Grocery</Option> */}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Category Image" required>
          <ImgCrop
            rotationSlider
            aspect={1}
            quality={1}
            modalTitle="Crop your category image"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              beforeUpload={beforeUpload}
              customRequest={({ onSuccess }) =>
                setTimeout(() => onSuccess("ok"), 0)
              }
              showUploadList={false}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
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

export default AddCategoryModel;
