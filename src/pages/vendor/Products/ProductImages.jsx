import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Upload, Button, Image, message, Spin } from 'antd';
import { UploadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getProductDetail, updateProductImages } from '../../../services/vendor/apiProduct';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ProductImages = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [primaryImage, setPrimaryImage] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const res = await getProductDetail(productId);
                setPrimaryImage(res.primary_image);
                setGalleryImages(res.gallery_image || []);
            } catch (err) {
                message.error('Failed to load product images');
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [productId]);

    const handlePrimaryImageChange = async ({ file }) => {
        const formData = new FormData();
        formData.append('primary_image', file);
        try {
            await updateProductImages(productId, formData);
            setPrimaryImage(URL.createObjectURL(file));
            message.success('Primary image updated');
        } catch (err) {
            message.error('Failed to update primary image');
        }
    };

    const handleReplaceGalleryImage = async (file, index) => {
        const formData = new FormData();
        formData.append('gallery_image', file);
        formData.append('galleryIndex', index);
        try {
            await updateProductImages(productId, formData);
            const newImageUrl = URL.createObjectURL(file);
            const updated = [...galleryImages];
            updated[index] = newImageUrl;
            setGalleryImages(updated);
            message.success('Gallery image updated');
        } catch (err) {
            message.error('Failed to update gallery image');
        }
    };

    const handleDeleteGalleryImage = async (index) => {
        const formData = new FormData();
        formData.append('deleteGalleryIndex', index);
        try {
            await updateProductImages(productId, formData);
            const updated = [...galleryImages];
            updated.splice(index, 1);
            setGalleryImages(updated);
            message.success('Gallery image deleted');
        } catch (err) {
            message.error('Failed to delete gallery image');
        }
    };

    const handleAddGalleryImages = async ({ fileList }) => {
        const formData = new FormData();
        // formData.append('gallery_image', f.originFileObj)
        fileList.forEach(f => formData.append('gallery_image', f.originFileObj));

        try {
            // formData.forEach((p,a)=>{
            //     console.log(p,a)
            // })
            console.log(productId)
            await updateProductImages(productId, formData);
            // const newImages = fileList.map(f => URL.createObjectURL(f.originFileObj));
            // setGalleryImages(prev => [...prev, ...newImages]);
            message.success('Gallery images added successfully');
        } catch (err) {
            message.error('Failed to add gallery images');
        }
    };

    if (loading) return <Spin size="large" fullscreen />;

    return (
        <div className="p-4">
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="mb-4"
            >
                Back
            </Button>

            <Card title="Manage Product Images">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Primary Image Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-center">Primary Image</h3>
                        <div className="flex flex-col items-center">
                            <Image
                                src={
                                    primaryImage?.startsWith('blob:')
                                        ? primaryImage
                                        : `${BASE_URL}/${primaryImage}`
                                }
                                alt="Primary"
                                width={200}
                                className="rounded-lg mb-4"
                            />
                            <Upload
                                showUploadList={false}
                                customRequest={({ file, onSuccess }) => {
                                    handlePrimaryImageChange({ file });
                                    onSuccess("ok");
                                }}
                            >
                                <Button icon={<UploadOutlined />}>Change Primary Image</Button>
                            </Upload>
                        </div>
                    </div>

                    {/* Gallery Images Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Gallery Images</h3>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            {galleryImages?.map((img, i) => (
                                <div key={i} className="flex flex-col items-center">
                                    <Image
                                        src={
                                            img.startsWith('blob:')
                                                ? img
                                                : `${BASE_URL}/${img}`
                                        }
                                        alt={`Gallery ${i + 1}`}
                                        width={200}
                                        className="rounded-lg"
                                    />
                                    <div className="mt-2 flex gap-2">
                                        <Upload
                                            showUploadList={false}
                                            customRequest={({ file, onSuccess }) => {
                                                handleReplaceGalleryImage(file, i);
                                                onSuccess("ok");
                                            }}
                                        >
                                            <Button size="small" icon={<UploadOutlined />}>Change</Button>
                                        </Upload>
                                        <Button
                                            size="small"
                                            danger
                                            onClick={() => handleDeleteGalleryImage(i)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Upload
                            multiple
                            listType="picture"
                            beforeUpload={() => false}
                            onChange={handleAddGalleryImages}
                        >
                            <Button icon={<UploadOutlined />}>Add More Gallery Images</Button>
                        </Upload>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ProductImages;
