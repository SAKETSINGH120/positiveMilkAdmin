import { Card, Tag, Tooltip } from 'antd';
import React from 'react';

function RequestedPaymentHistory({ walletRequest = [], loading }) {

    const convertDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "Asia/Kolkata",
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'green';
            case 'pending':
                return 'blue';
            case 'rejected':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <div >
            <Card
                title="Requested Payments"
                className="rounded-xl shadow-sm"
                loading={loading}
            >
                <div className='max-h-[300px] overflow-y-scroll'>
                    {walletRequest?.map((request) => (
                        <div key={request._id} className="mt-2 cursor-default" >
                            <Card
                                className="bg-orange-50 border border-orange-200 shadow-md rounded-lg"
                                size="small"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <div>
                                        <div className="font-semibold text-sm text-orange-800">
                                            ₹ {request.amount_requested}
                                        </div>
                                        <div className="text-xs text-orange-600">
                                            {convertDate(request.request_date)}
                                        </div>
                                    </div>
                                    <Tag
                                        color={getStatusColor(request.status)}
                                        className="text-[10px] font-medium px-2 py-0.5 rounded-md capitalize"
                                    >
                                        {request.status}
                                    </Tag>
                                </div>
                                <div className="flex justify-between items-center mt-1">
                                    <div className="text-xs text-gray-600 italic truncate max-w-[70%]">
                                        <Tooltip title={request.message}>{request.message}</Tooltip>
                                    </div>
                                    <Tag
                                        color={request.admin_settled ? 'green' : 'default'}
                                        className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                                    >
                                        {request.admin_settled ? 'Settled' : 'Not Settled'}
                                    </Tag>
                                </div>
                            </Card>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

export default RequestedPaymentHistory;
