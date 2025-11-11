import React, { useState, useEffect } from 'react';
import {
    Modal, Form, Input, Upload, Button, InputNumber,
    message, Select, Space, Row, Col
} from 'antd';
import {
    ShopOutlined, UploadOutlined, EnvironmentOutlined,
    PlusOutlined, HeatMapOutlined
} from '@ant-design/icons';
import ImgCrop from 'antd-img-crop';
import { FaMapLocationDot } from 'react-icons/fa6';
import MapModal from '../../../../components/MapModal';
import { getAddressFromCoordinates } from '../../../../utils/getCurrentLocation';
import { updateShop } from '@services/vendor/apiShop';

const { Option } = Select;
const { TextArea } = Input;
const BASE_URL = import.meta.env.VITE_BASE_URL;

const normFile = e => Array.isArray(e) ? e : e?.fileList;

function EditShopModel({ isModalOpen, handleOk, handleCancel, shopData }) {
    const [form] = Form.useForm();
    const [shopImagePreview, setShopImagePreview] = useState(null);
    const [shopImageFile, setShopImageFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [mapModalOpen, setMapModalOpen] = useState(false);

    useEffect(() => {
        if (shopData) {
            console.log(shopData);
            
            // Calculate base packing charge from final charge
            let packingChargeOld = 0;
            if (shopData.packingCharge) {
                // Calculate base charge: final charge / (1 + GST rate)
                // GST is 18%, so divide by 1.18
                packingChargeOld = Math.round(shopData.packingCharge / 1.18);
            }

            form.setFieldsValue({
                ...shopData,
                serviceId: shopData?.serviceId?._id,
                packingChargeOld: packingChargeOld,
                packingChargegst: 18,
                packingCharge: shopData.packingCharge || 0,
            });

            if (shopData.shopImage) {
                const fullImageUrl = `${BASE_URL}/${shopData.shopImage}`;
                setShopImagePreview(fullImageUrl);
                form.setFieldsValue({
                    shopImage: [{
                        uid: '-1',
                        name: 'shop.jpg',
                        status: 'done',
                        url: fullImageUrl
                    }]
                });
            }
        }
    }, [shopData, form]);

    const beforeUpload = (file) => {
        const isValidType = ['image/jpeg', 'image/png'].includes(file.type);
        if (!isValidType) {
            message.error('Only JPG/PNG files are allowed!');
            return Upload.LIST_IGNORE;
        }
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            message.error('Image must be smaller than 10MB!');
            return Upload.LIST_IGNORE;
        }
        return true;
    };

    const handleShopImageChange = ({ file }) => {
        if (file.originFileObj) {
            const reader = new FileReader();
            reader.onload = () => setShopImagePreview(reader.result);
            reader.readAsDataURL(file.originFileObj);
            setShopImageFile(file.originFileObj);
            form.setFieldsValue({ shopImage: [file] });
        }
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    const getLocation = async () => {
        setLocationLoading(true);
        try {
            navigator.geolocation.getCurrentPosition(
                async pos => {
                    const { latitude, longitude } = pos.coords;
                    form.setFieldsValue({
                        lat: latitude,
                        long: longitude,
                    });

                    // Get address details from coordinates
                    try {
                        const addressData = await getAddressFromCoordinates(latitude, longitude);
                        form.setFieldsValue({
                            address: addressData.address,
                            city: addressData.city,
                            state: addressData.state,
                            pincode: addressData.pincode,
                        });
                        message.success('Location and address fetched successfully!');
                    } catch {
                        message.warning('Location fetched but could not get address details. Please fill manually.');
                    }
                    setLocationLoading(false);
                },
                () => {
                    message.error('Unable to retrieve location.');
                    setLocationLoading(false);
                }
            );
        } catch {
            message.error('Error getting location.');
            setLocationLoading(false);
        }
    };

    const handleMapButtonClick = () => {
        setMapModalOpen(true);
    };

    const handleMapModalClose = () => {
        setMapModalOpen(false);
    };

    const handleLocationSelect = async (location) => {
        form.setFieldsValue({
            lat: location.lat,
            long: location.lng,
        });

        // Get address details from selected coordinates
        try {
            const addressData = await getAddressFromCoordinates(location.lat, location.lng);
            form.setFieldsValue({
                address: addressData.address,
                city: addressData.city,
                state: addressData.state,
                pincode: addressData.pincode,
            });
            message.success('Location and address selected successfully!');
        } catch {
            message.warning('Location selected but could not get address details. Please fill manually.');
        }
        setMapModalOpen(false);
    };

    const fetchAddressFromCoordinates = async () => {
        const lat = form.getFieldValue('lat');
        const long = form.getFieldValue('long');

        if (!lat || !long) {
            message.warning('Please enter latitude and longitude first');
            return;
        }

        try {
            const addressData = await getAddressFromCoordinates(lat, long);
            form.setFieldsValue({
                address: addressData.address,
                city: addressData.city,
                state: addressData.state,
                pincode: addressData.pincode,
            });
            message.success('Address fetched successfully!');
        } catch {
            message.error('Unable to fetch address details for the given coordinates.');
        }
    };

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            for (const key in values) {
                if (key === 'shopImage') {
                    if (shopImageFile) {
                        formData.append('shopImage', shopImageFile);
                    }
                } else if (key === 'galleryImage' || key === 'menu') {
                    values[key].forEach(file => {
                        if (file.originFileObj) {
                            formData.append(key, file.originFileObj);
                        }
                    });
                } else {
                    formData.append(key, values[key]);
                }
            }

            setUploading(true);
            await updateShop(shopData._id, formData);
            message.success('Shop updated successfully!');
            form.resetFields();
            setShopImagePreview(null);
            setShopImageFile(null);
            handleOk();
        } catch (error) {
            console.error('Error updating shop:', error);
            message.error('Failed to update shop. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <Modal
            title="Edit Shop"
            open={isModalOpen}
            onOk={onSubmit}
            onCancel={handleCancel}
            okText="Save Changes"
            cancelText="Cancel"
            confirmLoading={uploading}
            width={600}
        >
            <Form form={form} layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Shop Name"
                            rules={[{ required: true, message: 'Please enter shop name' }]}
                        >
                            <Input prefix={<ShopOutlined />} placeholder="Enter shop name" />
                        </Form.Item>
                        <Form.Item name="serviceId" label="Service Type" rules={[{ required: true }]}>
                            <Select placeholder="Select service">
                                <Option value="67ecc79120a93fc0b92a8b19">Food</Option>
                                <Option value="67ecc79a20a93fc0b92a8b1b">Grocery</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="shopType" label="Shop Type" rules={[{ required: true }]}>
                            <Select placeholder="Select shop type">
                                <Option value="veg">Veg</Option>
                                <Option value="nonveg">Nonveg</Option>
                                <Option value="both">Both</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Shop Image" required>
                            <ImgCrop rotationSlider aspect={1} quality={1} modalTitle="Crop Shop Image">
                                <Upload
                                    listType="picture-card"
                                    showUploadList={false}
                                    beforeUpload={beforeUpload}
                                    customRequest={({ onSuccess }) => setTimeout(() => onSuccess("ok"), 0)}
                                    onChange={handleShopImageChange}
                                    style={{ width: '200px', height: '200px' }}
                                >
                                    {shopImagePreview ? (
                                        <img
                                            src={shopImagePreview}
                                            alt="Preview"
                                            style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                                        />
                                    ) : uploadButton}
                                </Upload>
                            </ImgCrop>
                            <div style={{ fontSize: '12px', color: '#888' }}>
                                Recommended Size: <strong>250 x 250 px</strong>
                            </div>
                        </Form.Item>
                        <Form.Item
                            name="shopImage"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                            hidden
                        >
                            <Upload />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item label="Location (Lat, Long)">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="lat" rules={[{ required: true }]} noStyle>
                                <Input placeholder="Latitude" />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="long" rules={[{ required: true }]} noStyle>
                                <Input placeholder="Longitude" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16} className='mt-2'>
                        <Col span={8}>
                            <Button
                                icon={<EnvironmentOutlined />}
                                onClick={getLocation}
                                loading={locationLoading}
                            >
                                {locationLoading ? 'Wait...' : 'Current Location'}
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Button
                                icon={<FaMapLocationDot />}
                                onClick={handleMapButtonClick}
                            >
                                Choose on Map
                            </Button>
                        </Col>
                        <Col span={8}>
                            <Button
                                icon={<HeatMapOutlined />}
                                onClick={fetchAddressFromCoordinates}
                            >
                                Fetch Address
                            </Button>
                        </Col>
                    </Row>

                    <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
                        💡 <strong>Tip:</strong> Use "Current Location" or "Map" to automatically fill coordinates and address, or manually enter coordinates and click "Fetch Address"
                    </div>
                </Form.Item>

                <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                    <TextArea rows={2} placeholder="Enter address or use location buttons to auto-fill" />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="city" label="City" rules={[{ required: true }]}>
                            <Input placeholder="Enter city or auto-fill from coordinates" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="state" label="State" rules={[{ required: true }]}>
                            <Select placeholder="Select state or auto-fill from coordinates">
                                <Option value="Andhra Pradesh">Andhra Pradesh</Option>
                                <Option value="Arunachal Pradesh">Arunachal Pradesh</Option>
                                <Option value="Assam">Assam</Option>
                                <Option value="Bihar">Bihar</Option>
                                <Option value="Chhattisgarh">Chhattisgarh</Option>
                                <Option value="Goa">Goa</Option>
                                <Option value="Gujarat">Gujarat</Option>
                                <Option value="Haryana">Haryana</Option>
                                <Option value="Himachal Pradesh">Himachal Pradesh</Option>
                                <Option value="Jharkhand">Jharkhand</Option>
                                <Option value="Karnataka">Karnataka</Option>
                                <Option value="Kerala">Kerala</Option>
                                <Option value="Madhya Pradesh">Madhya Pradesh</Option>
                                <Option value="Maharashtra">Maharashtra</Option>
                                <Option value="Manipur">Manipur</Option>
                                <Option value="Meghalaya">Meghalaya</Option>
                                <Option value="Mizoram">Mizoram</Option>
                                <Option value="Nagaland">Nagaland</Option>
                                <Option value="Odisha">Odisha</Option>
                                <Option value="Punjab">Punjab</Option>
                                <Option value="Rajasthan">Rajasthan</Option>
                                <Option value="Sikkim">Sikkim</Option>
                                <Option value="Tamil Nadu">Tamil Nadu</Option>
                                <Option value="Telangana">Telangana</Option>
                                <Option value="Tripura">Tripura</Option>
                                <Option value="Uttar Pradesh">Uttar Pradesh</Option>
                                <Option value="Uttarakhand">Uttarakhand</Option>
                                <Option value="West Bengal">West Bengal</Option>
                                <Option value="Andaman and Nicobar Islands">Andaman and Nicobar Islands</Option>
                                <Option value="Chandigarh">Chandigarh</Option>
                                <Option value="Dadra and Nagar Haveli and Daman and Diu">Dadra and Nagar Haveli and Daman and Diu</Option>
                                <Option value="Delhi">Delhi</Option>
                                <Option value="Jammu and Kashmir">Jammu and Kashmir</Option>
                                <Option value="Ladakh">Ladakh</Option>
                                <Option value="Lakshadweep">Lakshadweep</Option>
                                <Option value="Puducherry">Puducherry</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="pincode"
                            label="Pincode"
                            rules={[
                                { required: true },
                                { pattern: /^\d{1,6}$/, message: 'Enter up to 6 digits' }
                            ]}
                        >
                            <Input placeholder="Enter pincode or auto-fill from coordinates" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="phone"
                            label="Phone"
                            rules={[
                                { required: true },
                                { pattern: /^\d{1,10}$/, message: 'Enter up to 10 digits' }
                            ]}
                        >
                            <Input placeholder="Enter phone number" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item
                            name="packingChargeOld"
                            label="Packing Charge"
                            rules={[{ required: true }]}
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                style={{ width: '100%' }}
                                onChange={(value) => {
                                    const gst = value * 0.18;
                                    form.setFieldsValue({
                                        packingChargegst: 18,
                                        packingCharge: Math.round(value + gst),
                                    });
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item
                            name="packingChargegst"
                            label="GST (%)"
                            initialValue={18}
                        >
                            <InputNumber readOnly style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="packingCharge"
                            label="Final Packing Charge"
                            rules={[{ required: true }]}
                        >
                            <InputNumber readOnly style={{ width: '100%' }} />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="galleryImage"
                            label="Gallery Images"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload multiple beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Gallery Images</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="menu"
                            label="Menu Images"
                            valuePropName="fileList"
                            getValueFromEvent={normFile}
                        >
                            <Upload multiple beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Menu Images</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

            <MapModal
                isOpen={mapModalOpen}
                onClose={handleMapModalClose}
                onLocationSelect={handleLocationSelect}
            />
        </Modal>
    );
}

export default EditShopModel;
