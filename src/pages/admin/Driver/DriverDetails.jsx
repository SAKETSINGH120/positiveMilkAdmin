import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { Card, Descriptions, Image, Spin, message } from 'antd';
import { getDriverDetails } from '../../../services/admin/apiDrivers';
const BASE_URL = import.meta.env.VITE_BASE_URL;

function DriverDetails() {
    const { driverId } = useParams();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDriverDetails = async (id) => {
        try {
            setLoading(true);
            const res = await getDriverDetails(id);
            if (res?.success) {
                setDriver(res.driver);
            } else {
                message.error(res?.message || "Failed to fetch driver details.");
            }
        } catch (error) {
            console.error("Error fetching driver details:", error);
            message.error("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDriverDetails(driverId);
    }, [driverId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Spin size="large" />
            </div>
        );
    }

    if (!driver) return null;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <Card
                title={<h2 className="text-xl font-semibold">{driver.name}</h2>}
                className="shadow-lg rounded-2xl"
                bordered={false}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Image */}
                    <Image
                        className="rounded-xl object-cover"
                        src={`${BASE_URL}/${driver.image}`}
                        alt="Driver"
                    />

                    {/* Info List */}
                    <Descriptions column={1} bordered size="small">
                        <Descriptions.Item label="Name">{driver.name}</Descriptions.Item>
                        <Descriptions.Item label="Email">{driver.email}</Descriptions.Item>
                        <Descriptions.Item label="Mobile No">{driver.mobileNo}</Descriptions.Item>
                        <Descriptions.Item label="Address">{driver.address}</Descriptions.Item>
                        <Descriptions.Item label="License Number">{driver.licenseNumber}</Descriptions.Item>
                        <Descriptions.Item label="Vehicle Type">{driver.vehicle?.type}</Descriptions.Item>
                        <Descriptions.Item label="Vehicle Model">{driver.vehicle?.model}</Descriptions.Item>
                        <Descriptions.Item label="Vehicle Reg. No.">{driver.vehicle?.registrationNumber}</Descriptions.Item>
                        <Descriptions.Item label="Insurance No.">{driver.vehicle?.insuranceNumber}</Descriptions.Item>
                        <Descriptions.Item label="Status">{driver.status}</Descriptions.Item>
                        <Descriptions.Item label="Blocked">{driver.isBlocked ? 'Yes' : 'No'}</Descriptions.Item>
                        <Descriptions.Item label="Wallet Balance">₹{driver.wallet_balance}</Descriptions.Item>
                        <Descriptions.Item label="Commission">₹{driver.commission}</Descriptions.Item>
                        <Descriptions.Item label="Cash Collection">₹{driver.cashCollection}</Descriptions.Item>
                        <Descriptions.Item label="Rating">{driver.rating}</Descriptions.Item>
                        <Descriptions.Item label="Created At">
                            {new Date(driver.createdAt).toLocaleDateString()}
                        </Descriptions.Item>
                    </Descriptions>
                </div>

                {/* Images */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {driver.licenseImage && (
                        <div>
                            <p className="text-sm font-medium mb-1">License Image</p>
                            <Image src={`${BASE_URL}/${driver.licenseImage}`} />
                        </div>
                    )}
                    {driver.vehicleRcImage && (
                        <div>
                            <p className="text-sm font-medium mb-1">RC Image</p>
                            <Image src={`${BASE_URL}/${driver.vehicleRcImage}`} />
                        </div>
                    )}
                    {driver.insuranceImage && (
                        <div>
                            <p className="text-sm font-medium mb-1">Insurance Image</p>
                            <Image src={`${BASE_URL}/${driver.insuranceImage}`} />
                        </div>
                    )}
                    {driver.adharImage && driver.adharImage !== '' && (
                        <div>
                            <p className="text-sm font-medium mb-1">Aadhar Image</p>
                            <Image src={`${BASE_URL}/${driver.adharImage}`} />
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}

export default DriverDetails;
