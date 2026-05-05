import { useState, useEffect } from 'react'
import { Button, Form, Input, message, Modal, Select, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons'
import ImgCrop from "antd-img-crop";
import dataURLtoFile from "../../../../utils/fileConverter";
import { updateBanner } from "../../../../services/admin/apiBanner";
import { getAllSubCategory } from "@services/apiCategory";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const EditBannerModel = ({ isModalOpen, handleOk, handleCancel, bannerData }) => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState()
  const [categories, setCategories] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const data = await getAllSubCategory();
        setCategories(data || []);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };
    fetchSubCategories();
  }, []);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG files!')
      return false
    }
    const isLt10M = file.size / 1024 / 1024 < 10
    if (!isLt10M) {
      message.error('Image must be smaller than 10MB!')
      return false
    }
    return false
  }

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(fileList[0].originFileObj);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  )

  useEffect(() => {
    if (bannerData) {
      form.setFieldsValue({
        title: bannerData.title,
        serviceType: bannerData.serviceId?._id || bannerData.serviceId,
        chooeseSection: bannerData.section,
        categoryId: bannerData.categoryId?._id || bannerData.categoryId,
        link: bannerData.link,
        status: bannerData.status,
      })
      if (bannerData.image) {
        const fullImageUrl = `${BASE_URL}/${bannerData.image}`;
        setImageUrl(fullImageUrl);
        setFileList([{
          uid: '-1',
          name: 'banner.png',
          status: 'done',
          url: fullImageUrl,
        }]);
      } else {
        setImageUrl(null);
        setFileList([]);
      }
    }
  }, [bannerData, form])

  const serviceTypeValue = Form.useWatch("serviceType", form);

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("section", values.chooeseSection);
    formData.append("serviceId", values.serviceType);
    if (values.categoryId) {
      formData.append("categoryId", values.categoryId);
    }
    if (values.link) {
      formData.append("link", values.link);
    }

    if (imageUrl && imageUrl.startsWith('data:')) {
      const file = dataURLtoFile(imageUrl, "banner.png");
      formData.append("image", file);
    }

    try {
      setLoading(true);
      await updateBanner(bannerData._id, formData);
      message.success("Banner updated successfully!");
      handleOk();
    } catch (error) {
      message.error("Failed to update banner.");
    } finally {
      setLoading(false);
    }
  }

  const onFinishFailed = (errorInfo) => {
    // console.log('Failed:', errorInfo);
  }

  return (
    <Modal
      title="Edit Banner"
      open={isModalOpen}
      onOk={form.submit}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={form.submit}
          loading={loading}
        >
          Update Banner
        </Button>,
      ]}
    >
      <Form
        form={form}
        name="editBanner"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item
          label="Banner Title"
          name="title"
          rules={[{ required: true, message: 'Please input the banner title!' }]}
        >
          <Input placeholder="Enter banner title" />
        </Form.Item>
        <Form.Item
          label="Service Type"
          name="serviceType"
          rules={[{ required: true, message: 'Please select a category!' }]}
        >
          <Select
            showSearch
            placeholder="Service Type"
            optionFilterProp="label"
            options={[
              { value: "67ecc79120a93fc0b92a8b19", label: "Milk" },
              // { value: '67ecc79a20a93fc0b92a8b1b', label: 'Grocery' },
            ]}
          />
        </Form.Item>
        <Form.Item
          label="Choose Section"
          name="chooeseSection"
          rules={[{ required: true, message: 'Please select a section!' }]}
        >
          <Select
            showSearch
            placeholder="Choose Section"
            optionFilterProp="label"
            options={[
              { value: 'section1', label: 'Home (Milk)' },
              { value: 'section2', label: 'Offer (Milk)' },
              { value: 'homeGrocery', label: 'Home (Grocery)' },
              { value: 'store199Grocery', label: '199 Store (Grocery)' },
              { value: 'everydayGrocery', label: 'Everyday (Grocery)' },
              { value: 'offerGrocery', label: 'Offer (Grocery)' },
            ]}
          />
        </Form.Item>

        <Form.Item label="Category" name="categoryId">
          <Select
            placeholder="Select category (e.g., Cow Milk)"
            allowClear
            showSearch
            optionFilterProp="label"
            options={categories
              .filter(cat => {
                const parentServiceId = cat.cat_id?.serviceId?._id || cat.cat_id?.serviceId;
                const subServiceId = cat.serviceId?._id || cat.serviceId;
                const finalServiceId = parentServiceId || subServiceId;
                return (!serviceTypeValue || finalServiceId === serviceTypeValue) &&
                  !cat.name?.toLowerCase().includes("ghee");
              })
              .map((cat) => ({
                value: cat._id,
                label: cat.name?.replace(/^A2\s+/i, ""),
              }))}
          />
        </Form.Item>

        <Form.Item label="Back Link" name="link">
          <Input placeholder="Enter back link (optional)" />
        </Form.Item>

        <Form.Item label="Banner Image">
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
              beforeUpload={() => false}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
          </ImgCrop>
          <div style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
            Recommended Size: <strong>320 x 150 px</strong>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditBannerModel
