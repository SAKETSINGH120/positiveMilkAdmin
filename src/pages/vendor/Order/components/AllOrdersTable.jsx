import { Table, Button, Tag } from 'antd';
import { IoMdEye } from 'react-icons/io';
import { convertDate } from '../../../../utils/formatDate';

const AllOrdersTable = ({ data = [], loading = false, onViewDetails }) => {
    const allOrderColumns = [
        {
            title: 'Booking ID',
            dataIndex: 'booking_id',
            align: 'center',
        },
        {
            title: 'Delivery Date',
            dataIndex: 'deliveryDate',
            align: 'center',
            render: (date) => convertDate(date),
        },
        {
            title: 'Delivery Time',
            dataIndex: 'deliveryTime',
            align: 'center',
        },
        {
            title: 'Amount',
            dataIndex: 'finalTotalPrice',
            align: 'center',
            render: (amt) => `₹ ${amt}`,
        },
        {
            title: 'Order Status',
            dataIndex: 'orderStatus',
            align: 'center',
            render: (status) => <Tag>{status}</Tag>,
        },
        {
            title: 'Payment',
            dataIndex: 'paymentStatus',
            align: 'center',
            render: (status) => (
                <Tag color={status === 'Paid' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
                    {status?.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Mode',
            dataIndex: 'paymentMode',
            align: 'center',
        },
        {
            title: 'Created',
            dataIndex: 'createdAt',
            align: 'center',
            render: (date) => convertDate(date),
        },
        {
            title: 'Action',
            key: 'action',
            align: 'center',
            render: (_, record) => (
                <Button icon={<IoMdEye />} onClick={() => onViewDetails(record._id)} />
            ),
        },
    ];

    return (
        <Table
            dataSource={data}
            loading={loading}
            columns={allOrderColumns}
            rowKey="_id"
            scroll={{ x: true }}
            bordered
            size="small"
        />
    );
};

export default AllOrdersTable;
