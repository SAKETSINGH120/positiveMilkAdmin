import React, { useEffect, useState, useCallback } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Spin,
  Row,
  Col,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  getAllSettings,
  updateSettings,
} from "../../../../services/apiSettings";
import TextArea from "antd/es/input/TextArea";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Charges() {
  const [settingData, setSettingData] = useState({});
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const beforeUpload = useCallback((file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must be smaller than 10MB!");
      return false;
    }
    return false;
  }, []);

  const fetchSetting = useCallback(async () => {
    try {
      const data = await getAllSettings();
      const settings = data.data.settings[0];
      setSettingData(settings);
      setImageUrl(`${BASE_URL}/${settings.logo}`);
    } catch {
      message.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSetting();
  }, [fetchSetting]);

  const handleChange = useCallback((info) => {
    if (info.file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(info.file);
    }
  }, []);

  const onFinish = async (values) => {
    console.log("Form values:", values);
    setUpdateLoading(true);
    const formData = new FormData();

    // Append all form values to FormData
    const formFields = [
      "brandName",
      "commission",
      "gst",
      "onboardingfee",
      "plateformFee",
      "finialPlateformFee",
      "email",
      "mobile",
      "address",
      "googleMapApiKey",
      "razorpayKeyId",
      "razorpayKeySecret",
      "driverPayoutLessThan3",
      "driverPayoutMoreThan3",
      "userDeliveryChargeLessThan3",
      "userDeliveryChargeMoreThan3",
      "grocerySmallCartValue",
      "productPurchaseMaxQty",
      "mandatoryUpdateVersion",
    ];
    console.log("formFields", formFields);
    formFields.forEach((field) => {
      if (values[field] !== undefined) {
        formData.append(field, values[field]);
      }
    });

    if (values.image?.file) {
      formData.append("image", values.image.file);
    }

    console.log("formData", formData);
    try {
      await updateSettings(settingData._id, formData);
      message.success("Settings updated successfully!");
    } catch {
      message.error("Error updating settings");
    } finally {
      setUpdateLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  if (loading) return <Spin size="large" fullscreen />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Manage Settings</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          brandName: settingData.brandName,
          commission: settingData.commission,
          gst: settingData.gst,
          onboardingfee: settingData.onboardingFee,
          logo: settingData.logo,
          email: settingData.email,
          mobile: settingData.mobile,
          address: settingData.address,
          plateformFee: settingData.plateformFee,
          finialPlateformFee: settingData.finialPlateformFee,
          googleMapApiKey: settingData.googleMapApiKey,
          razorpayKeyId: settingData.razorpayKeyId,
          razorpayKeySecret: settingData.razorpayKeySecret,
          driverPayoutLessThan3: settingData.driverPayoutLessThan3,
          driverPayoutMoreThan3: settingData.driverPayoutMoreThan3,
          userDeliveryChargeLessThan3: settingData.userDeliveryChargeLessThan3,
          userDeliveryChargeMoreThan3: settingData.userDeliveryChargeMoreThan3,
          grocerySmallCartValue: settingData.grocerySmallCartValue,
          productPurchaseMaxQty: settingData.productPurchaseMaxQty,
          mandatoryUpdateVersion: settingData.mandatoryUpdateVersion,
        }}
        className="max-w-2xl"
      >
        {/* Site Details */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Site Name"
              name="brandName"
              rules={[{ required: true, message: "Please enter brand name" }]}
            >
              <Input placeholder="Enter brand name" size="large" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Site Logo" name="image">
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
                onChange={handleChange}
                fileList={imageUrl ? [{ url: imageUrl }] : []}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {/* Commission Management */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Commission (%)"
              name="commission"
              rules={[{ required: true, message: "Please enter commission" }]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                placeholder="Enter commission percentage"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="GST (%)"
              name="gst"
              rules={[
                { required: true, message: "Please enter GST percentage" },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                placeholder="Enter GST percentage"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Onboarding Fee"
              name="onboardingfee"
              rules={[
                { required: true, message: "Please enter onboarding fee" },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter Onboarding Fee"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Max Purchase Quantity */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Max Purchase Quantity"
              name="productPurchaseMaxQty"
              rules={[{ required: true, message: "Please enter Max Quantity" }]}
            >
              <InputNumber
                min={0}
                max={100}
                style={{ width: "100%" }}
                placeholder="Enter Max Quantity"
                size="large"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Platform Fee */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="plateformFee"
              label="Platform Fee"
              rules={[{ required: true, message: "Please enter platform fee" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter platform fee"
                onChange={(value) => {
                  if (value) {
                    const gst = value * 0.18;
                    form.setFieldsValue({
                      plateformFeegst: 18,
                      finialPlateformFee: Math.round(value + gst),
                    });
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name="plateformFeegst" label="GST (%)" initialValue={18}>
              <InputNumber
                variant="filled"
                readOnly
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="finialPlateformFee"
              label="Final Platform Fee"
              rules={[{ required: true }]}
            >
              <InputNumber
                variant="filled"
                readOnly
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Site Management */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Enter Email" size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Mobile No"
              name="mobile"
              rules={[
                { required: true, message: "Please enter mobile no" },
                {
                  pattern: /^[0-9]{10}$/,
                  message: "Please enter a valid 10-digit mobile number",
                },
              ]}
            >
              <Input placeholder="Enter Mobile No." size="large" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Please enter address" }]}
            >
              <TextArea rows={5} placeholder="Enter address here..." />
            </Form.Item>
          </Col>
        </Row>

        {/* Driver Payout */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Driver Payout Less Than 3 km (Only)"
              name="driverPayoutLessThan3"
              rules={[
                {
                  required: true,
                  message: "Please enter driver payout less than 3",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter Driver Payout Less Than 3"
                size="large"
                prefix="₹"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Driver Payout More Than 3 km (Per km)"
              name="driverPayoutMoreThan3"
              rules={[
                {
                  required: true,
                  message: "Please enter driver payout more than 3",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter Driver Payout More Than 3"
                size="large"
                prefix="₹"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* User payout */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="User Delivery Charge Less Than 3 km (Only)"
              name="userDeliveryChargeLessThan3"
              rules={[
                {
                  required: true,
                  message: "Please enter User delivery charge less than 3",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter User delivery charge Less Than 3"
                size="large"
                prefix="₹"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="User Delivery Charge More Than 3 km (Per km)"
              name="userDeliveryChargeMoreThan3"
              rules={[
                {
                  required: true,
                  message: "Please enter user delivery charge more than 3",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter User Delivery Charge More Than 3"
                size="large"
                prefix="₹"
              />
            </Form.Item>
          </Col>
        </Row>
        {/* User payout */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Grocery Small Cart Value"
              name="grocerySmallCartValue"
              rules={[
                {
                  required: true,
                  message: "Please enter grocery small cart value",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter grocery small cart value"
                size="large"
                prefix="₹"
              />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
                        <Form.Item
                            label="User Delivery Charge More Than 3 km (Per km)"
                            name="userDeliveryChargeMoreThan3"
                            rules={[{ required: true, message: 'Please enter user delivery charge more than 3' }]}
                        >
                            <InputNumber
                                min={0}
                                style={{ width: '100%' }}
                                placeholder="Enter User Delivery Charge More Than 3"
                                size='large'
                                prefix="₹"
                            />
                        </Form.Item>
                    </Col> */}
        </Row>

        {/* API Keys */}
        <Form.Item
          label="Google Map API Key"
          name="googleMapApiKey"
          rules={[
            { required: true, message: "Please enter google map api key" },
          ]}
        >
          <Input placeholder="Enter google map api key" size="large" disabled />
        </Form.Item>

        <Form.Item
          label="Razorpay API Key ID"
          name="razorpayKeyId"
          rules={[{ required: true, message: "Please enter razorpay key id" }]}
        >
          <Input placeholder="Enter razorpay key id" size="large" disabled />
        </Form.Item>

        <Form.Item
          label="Razorpay API Key Secret"
          name="razorpayKeySecret"
          rules={[
            { required: true, message: "Please enter razorpay key secret" },
          ]}
        >
          <Input
            placeholder="Enter razorpay key secret"
            size="large"
            disabled
          />
        </Form.Item>
        {/* API Keys */}
        <Form.Item
          label="App Version"
          name="mandatoryUpdateVersion"
          rules={[{ required: true, message: "Please enter app Version" }]}
        >
          <Input placeholder="Enter  app version code" size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={updateLoading}
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Charges;
