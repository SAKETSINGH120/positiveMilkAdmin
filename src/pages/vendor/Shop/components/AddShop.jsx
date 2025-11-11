import React, { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, message, Row, Col, Space, Select, InputNumber, AutoComplete } from 'antd';
import { UploadOutlined, ShopOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { addShop } from '@services/vendor/apiShop';
import { useMap } from 'react-leaflet';

// Custom marker icon setup
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: '/mark.png',
    iconRetinaUrl: '/mark.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const customIcon = new L.Icon({
    iconUrl: '/mark.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
});

const { Option } = Select;
const { TextArea } = Input;

// Map recenter helper component
const RecenterMap = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], map.getZoom());
    }, [lat, lng, map]);
    return null;
};

const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        }
    });

    return <Marker
        position={position}
        draggable={true}
        icon={customIcon}
        eventHandlers={{
            dragend: (e) => {
                const latlng = e.target.getLatLng();
                setPosition(latlng);
            }
        }}
    />;
};

// Map search component with auto-suggestion
const MapSearch = ({ setLocation }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [location, setMapLocation] = useState({ lat: 20.5937, lng: 78.9629 });
    const provider = new OpenStreetMapProvider();

    // const handleSearch = async (searchText) => {
    //     if (searchText) {
    //         const results = await provider.search({ query: searchText });
    //         setSearchResults(results);
    //     } else {
    //         setSearchResults([]);
    //     }
    // };
    const handleSearch = async (searchText) => {
        if (searchText) {
            const results = await provider.search({ query: searchText });

            // Filter results to include only those in India
            const indiaResults = results.filter(
                (result) =>
                    result.label.toLowerCase().includes('india')
            );

            setSearchResults(indiaResults);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelect = (value, option) => {
        const { lat, lon } = option.key;
        setMapLocation({ lat, lng: lon });
        setLocation({ lat, lng: lon });
    };

    useEffect(() => {
        if (setLocation) {
            setLocation(location);
        }
    }, [location, setLocation]);

    return (
        <div className="map-search-container">
            <AutoComplete
                onSearch={handleSearch}
                onSelect={handleSelect}
                style={{ width: '100%' }}
                placeholder="Search for address"
                options={searchResults.map((result) => ({
                    value: result.label,
                    key: result,
                }))}
            />
            <div className="mt-4">
                <MapContainer center={location} zoom={15} style={{ height: '300px', width: '100%' }} scrollWheelZoom={true}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <RecenterMap lat={location.lat} lng={location.lng} />
                    <LocationMarker position={location} setPosition={(pos) => setMapLocation(pos)} />
                </MapContainer>
            </div>
        </div>
    );
};

const AddShop = () => {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [location, setLocation] = useState({ lat: 20.5937, lng: 78.9629 });

    const onSubmit = async () => {
        try {
            const values = await form.validateFields();
            const formData = new FormData();

            for (const key in values) {
                if (key === 'shopImage') {
                    formData.append('shopImage', values.shopImage[0].originFileObj);
                } else if (key === 'galleryImage') {
                    values.galleryImage.forEach((file) => formData.append('galleryImage', file.originFileObj));
                } else if (key === 'menu') {
                    values.menu.forEach((file) => formData.append('menu', file.originFileObj));
                } else {
                    formData.append(key, values[key]);
                }
            }

            setUploading(true);
            await addShop(formData);
            message.success('Shop added successfully!');
            form.resetFields();
        } catch (error) {
            console.error('Error adding shop:', error);
            message.error('Failed to add shop. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const getLocation = () => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                form.setFieldsValue({ lat, long: lng });
                setLocation({ lat, lng });
                message.success('Location fetched!');
            },
            () => {
                message.error('Unable to retrieve location.');
            }
        );
    };

    return (
        <div className="p-6 bg-white shadow rounded-md max-w-5xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">Add New Shop</h2>
            <Form form={form} layout="vertical" onFinish={onSubmit}>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="name"
                            label="Shop Name"
                            rules={[{ required: true, message: 'Please enter shop name' }]}
                        >
                            <Input prefix={<ShopOutlined />} placeholder="Enter shop name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="shopImage"
                            label="Shop Image"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                            rules={[{ required: true, message: 'Please upload a shop image' }]}
                        >
                            <Upload beforeUpload={() => false} maxCount={1}>
                                <Button icon={<UploadOutlined />}>Upload Shop Image</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item name="serviceId" label="Service Type" rules={[{ required: true }]}>
                            <Select placeholder="Select service">
                                <Option value="67ecc79120a93fc0b92a8b19">Food</Option>
                                <Option value="67ecc79a20a93fc0b92a8b1b">Grocery</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="shopType" label="Shop Type" rules={[{ required: true }]}>
                            <Select placeholder="Select shop type">
                                <Option value="veg">Veg</Option>
                                <Option value="nonveg">Nonveg</Option>
                                <Option value="both">Both</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name="address" label="Address" rules={[{ required: true }]}>
                    <Space.Compact style={{ width: '100%' }}>
                        <TextArea rows={2} placeholder="Enter address" />
                        <Button onClick={() => { }}>Find Address</Button>
                    </Space.Compact>
                </Form.Item>

                <Form.Item label="Location (Lat, Long)">
                    <Space>
                        <Form.Item name="lat" noStyle>
                            <Input placeholder="Latitude" />
                        </Form.Item>
                        <Form.Item name="long" noStyle>
                            <Input placeholder="Longitude" />
                        </Form.Item>
                        <Button icon={<EnvironmentOutlined />} onClick={getLocation}>
                            Get Current Location
                        </Button>
                    </Space>
                </Form.Item>

                <div className="mb-4">
                    <MapSearch setLocation={setLocation} />
                </div>

                <Form.Item name="packingCharge" label="Packing Charge" rules={[{ required: true }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name="galleryImage"
                            label="Gallery Images (multiple)"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                            rules={[{ required: true }]}
                        >
                            <Upload multiple beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Gallery Images</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name="menu"
                            label="Menu Images (multiple)"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                            rules={[{ required: true }]}
                        >
                            <Upload multiple beforeUpload={() => false}>
                                <Button icon={<UploadOutlined />}>Upload Menu Images</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={uploading}>
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddShop;
