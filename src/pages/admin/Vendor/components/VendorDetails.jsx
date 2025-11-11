import React, { useEffect, useState } from "react";
import { Card, Descriptions, Table, Tag, Button, Spin, message } from "antd";
import { useParams, useNavigate } from "react-router";
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { getVendorDetails } from "@services/apiVendor";
import EditVendorModal from './EditVendorModal';
const BASE_URL = import.meta.env.VITE_BASE_URL;

const VendorDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendorData, setVendorData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                const res = await getVendorDetails(id);
                setVendorData({
                    vendor: res.vendor,
                    vendorAccountDetails: res.bankDetails,
                    shopTime: res.shopTime
                })
            } catch {
                message.error('Error fetching vendor details');
            }
            finally {
                setLoading(false);
            }
        }
        fetchVendorDetails()
    }, [id])

    const { vendor } = vendorData || {};

    const handleEditVendor = () => {
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
    };

    const fetchVendorDetails = async () => {
        try {
            const res = await getVendorDetails(id);
            setVendorData({
                vendor: res.vendor,
                vendorAccountDetails: res.bankDetails,
                shopTime: res.shopTime
            })
        } catch {
            message.error('Error fetching vendor details');
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <Button
                    type="text"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Back to Vendors
                </Button>
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditVendor}
                >
                    Edit Vendor
                </Button>
            </div>
            <div className="grid gap-6">
                {/* Vendor Info */}
                <Card title="Vendor Information" loading={loading}>
                    <Descriptions column={2}>
                        <Descriptions.Item label="Owner Name">{vendor?.name}</Descriptions.Item>
                        <Descriptions.Item label="User Id">{vendor?.userId}</Descriptions.Item>
                        <Descriptions.Item label="Mobile No">{vendor?.mobile}</Descriptions.Item>
                        <Descriptions.Item label="Alternate Phone">{vendor?.alternate_phoneNo || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Email">{vendor?.email}</Descriptions.Item>
                        <Descriptions.Item label="Address">{vendor?.address || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Approved">
                            <Tag color={vendor?.isApproved ? "green" : "red"}>
                                {vendor?.isApproved ? "Yes" : "No"}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Blocked">
                            <Tag color={vendor?.isBlock ? "red" : "green"}>
                                {vendor?.isBlock ? "Yes" : "No"}
                            </Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Account Info */}
                <Card title="Bank Account Details" loading={loading}>
                    <Descriptions column={2}>
                        <Descriptions.Item label="Bank Name">{vendor?.bankName || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Account No">{vendor?.accountNo || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="IFSC">{vendor?.ifsc || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Branch">{vendor?.branchName || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Passbook/Statement/Cheque">
                            {vendor?.passbook ? (
                                <a href={`${BASE_URL}/${vendor?.passbook}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    View Image
                                </a>
                            ) : (
                                "N/A"
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Benificiary Name">{vendor?.benificiaryName || "N/A"}</Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Document Details" loading={loading}>
                    <Descriptions column={2}>
                        <Descriptions.Item label="Business PAN Number">{vendor?.panNo || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="GST Number">{vendor?.gstNo || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Food License Number">{vendor?.foodLicense || "N/A"}</Descriptions.Item>
                        {/* <Descriptions.Item label="Branch">{vendor?.branchName || "N/A"}</Descriptions.Item> */}
                        <Descriptions.Item label="Business PAN Image">
                            {vendor?.panImage ? (
                                <a href={`${BASE_URL}/${vendor?.panImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    View Image
                                </a>
                            ) : (
                                "N/A"
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="GST Image">
                            {vendor?.gstImage ? (
                                <a href={`${BASE_URL}/${vendor?.gstImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    View Image
                                </a>
                            ) : (
                                "N/A"
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Food License Image">
                            {vendor?.foodImage ? (
                                <a href={`${BASE_URL}/${vendor?.foodImage}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    View Image
                                </a>
                            ) : (
                                "N/A"
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>

            <EditVendorModal
                isModalOpen={isEditModalOpen}
                handleCancel={handleCloseEditModal}
                vendorData={vendorData}
                fetchVendorDetails={fetchVendorDetails}
            />
        </div>
    );
};

export default VendorDetails;
