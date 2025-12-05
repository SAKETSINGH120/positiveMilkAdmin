import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dataURLtoFile from "../../../../utils/fileConverter";
import { addBanner } from "../../../../services/admin/apiBanner";

const AddBannerModel = ({ isModalOpen, handleOk, handleCancel }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [imageUrl, setImageUrl] = useState(null);

  const serviceTypeValue = Form.useWatch("serviceType", form);

  const foodSections = [
    { value: "section1", label: "Home (Milk)" },
    { value: "section2", label: "Offer (Milk)" },
    // { value: 'b1g1Milk', label: 'Buy 1 Get 1 Free (Food)' },
    // { value: 'nightCafeFood', label: 'Night Cafe (Food)' },
  ];
  const grocerySections = [
    { value: "homeGrocery", label: "Home (Grocery)" },
    { value: "store199Grocery", label: "199 Store (Grocery)" },
    { value: "everydayGrocery", label: "Everyday (Grocery)" },
    { value: "offerGrocery", label: "Offer (Grocery)" },
  ];

  const sectionOptions =
    serviceTypeValue === "67ecc79120a93fc0b92a8b19"
      ? foodSections
      : serviceTypeValue === "67ecc79a20a93fc0b92a8b1b"
      ? grocerySections
      : [];

  useEffect(() => {
    form.setFieldsValue({ chooeseSection: undefined });
  }, [serviceTypeValue, form]);

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

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const imgWindow = window.open(src);
    if (imgWindow) {
      const image = new Image();
      image.src = src;
      imgWindow.document.write(image.outerHTML);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFinish = async (values) => {
    if (!imageUrl) {
      return message.error("Please upload a banner image.");
    }

    const file = dataURLtoFile(imageUrl, "banner.png");
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("section", values.chooeseSection);
    formData.append("serviceId", values.serviceType);
    formData.append("image", file);

    try {
      setLoading(true);
      await addBanner(formData);
      message.success("Banner added successfully!");
      form.resetFields();
      setImageUrl(null);
      setFileList([]);
      handleOk();
    } catch (error) {
      message.error("Failed to add banner.");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    form.resetFields();
    setFileList([]);
    setImageUrl(null);
    handleCancel();
  };

  return (
    <Modal
      title="Add New Banner"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={form.submit}
          loading={loading}
        >
          Add Banner
        </Button>,
      ]}
    >
      <Form form={form} name="addBanner" onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Banner Title"
          name="title"
          rules={[
            { required: true, message: "Please input the banner title!" },
          ]}
        >
          <Input placeholder="Enter banner title" />
        </Form.Item>

        <Form.Item
          label="Service Type"
          name="serviceType"
          rules={[{ required: true, message: "Please select a service type!" }]}
        >
          <Select
            placeholder="Service Type"
            options={[
              { value: "67ecc79120a93fc0b92a8b19", label: "Milk" },
              // { value: '67ecc79a20a93fc0b92a8b1b', label: 'Grocery' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Choose Section"
          name="chooeseSection"
          rules={[{ required: true, message: "Please select a section!" }]}
        >
          <Select
            placeholder={
              serviceTypeValue ? "Select section" : "Choose service type first"
            }
            disabled={!serviceTypeValue}
            options={sectionOptions}
          />
        </Form.Item>

        <Form.Item label="Banner Image" required>
          <ImgCrop
            rotationSlider
            aspect={320 / 150}
            quality={1}
            modalTitle="Crop your banner"
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              onPreview={onPreview}
              beforeUpload={beforeUpload}
              customRequest={({ onSuccess }) =>
                setTimeout(() => onSuccess("ok"), 0)
              }
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </ImgCrop>
          <div style={{ fontSize: "12px", color: "#888" }}>
            Recommended Size: <strong>320 x 150 px</strong>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddBannerModel;
