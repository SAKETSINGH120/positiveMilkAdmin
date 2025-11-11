import React, { useEffect, useState } from "react";
import { Card, Descriptions, Tag, Button, Spin } from "antd";
import { useParams, useNavigate } from "react-router";
import { ArrowLeftOutlined, UserOutlined } from '@ant-design/icons';
import { getUserDetailed } from "@services/admin/apiUser";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await getUserDetailed(userId);
                console.log(response)
                setUserData(response.data.user);
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!userData) {
        return <div>User not found</div>;
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-4">
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                className="mb-4"
            >
                Back to Users
            </Button>
            
            <div className="grid gap-6">
                {/* User Basic Info */}
                <Card 
                    title={
                        <div className="flex items-center gap-2">
                            <UserOutlined />
                            <span>User Information</span>
                        </div>
                    } 
                    bordered
                >
                    <Descriptions column={2}>
                        <Descriptions.Item label="User ID">{userData._id}</Descriptions.Item>
                        <Descriptions.Item label="Name">{userData.name || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Mobile Number">{userData.mobileNo}</Descriptions.Item>
                        <Descriptions.Item label="Email">{userData.email || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="User Type">
                            <Tag color="blue">{userData.userType?.toUpperCase() || "N/A"}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Service Type">
                            <Tag color="green">{userData.serviceType?.toUpperCase() || "N/A"}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Status">
                            <Tag color={userData.status ? "green" : "red"}>
                                {userData.status ? "Active" : "Inactive"}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Verified">
                            <Tag color={userData.isVerified ? "green" : "orange"}>
                                {userData.isVerified ? "Verified" : "Not Verified"}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="New User">
                            <Tag color={userData.isNewUser ? "blue" : "default"}>
                                {userData.isNewUser ? "Yes" : "No"}
                            </Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Wallet Balance">
                            <Tag color="gold">₹{userData.wallet || 0}</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {/* Location Information */}
                <Card title="Location Information" bordered>
                    <Descriptions column={2}>
                        <Descriptions.Item label="Latitude">{userData.lat || "N/A"}</Descriptions.Item>
                        <Descriptions.Item label="Longitude">{userData.long || "N/A"}</Descriptions.Item>
                        {userData.location && (
                            <>
                                <Descriptions.Item label="Address">{userData.location.address || "N/A"}</Descriptions.Item>
                                <Descriptions.Item label="City">{userData.location.city || "N/A"}</Descriptions.Item>
                                <Descriptions.Item label="State">{userData.location.state || "N/A"}</Descriptions.Item>
                                <Descriptions.Item label="Pincode">{userData.location.pincode || "N/A"}</Descriptions.Item>
                            </>
                        )}
                    </Descriptions>
                </Card>

                {/* Account Information */}
                <Card title="Account Information" bordered>
                    <Descriptions column={2}>
                        <Descriptions.Item label="Created At">{formatDate(userData.createdAt)}</Descriptions.Item>
                        <Descriptions.Item label="Last Updated">{formatDate(userData.updatedAt)}</Descriptions.Item>
                        <Descriptions.Item label="Profile Image">
                            {userData.profileImage ? (
                                <img 
                                    src={`${BASE_URL}/${userData.profileImage}`} 
                                    alt="Profile" 
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                    <UserOutlined className="text-gray-400 text-xl" />
                                </div>
                            )}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>
        </div>
    );
};

export default UserDetails;
