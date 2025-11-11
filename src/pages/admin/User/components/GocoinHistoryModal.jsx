import React, { useMemo } from 'react';
import { Modal, Table, Tag } from 'antd';
import { convertDate } from '../../../../utils/formatDate';

const GocoinHistoryModal = React.memo(({ visible, user, history, loading, onClose }) => {
    const historyColumns = useMemo(() => [
        {
            title: 'Sr No',
            key: 'sr',
            align: 'center',
            render: (_, _r, i) => i + 1
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (action) => (
                <Tag color="green" style={{ textTransform: 'capitalize' }}>
                    {action}
                </Tag>
            )
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            render: (amount) => <Tag color="blue">{amount}</Tag>
        },
        {
            title: 'Balance After Action',
            dataIndex: 'balance_after_action',
            key: 'balance_after_action',
            align: 'center',
            render: (balance) => <Tag color="purple">{balance}</Tag>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            align: 'center',
            render: (description) => (
                <div style={{ maxWidth: '200px', wordWrap: 'break-word' }}>
                    {description || 'N/A'}
                </div>
            )
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            align: 'center',
            render: (date) => <Tag color="orange">{convertDate(date)}</Tag>
        },
    ], []);

    const TABLE_PAGINATION_CONFIG = {
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
    };

    return (
        <Modal
            title={`GoCoin History - ${user?.name}`}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            loading={loading}
        >
            {!loading && history.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500">No gocoin history found for this user.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table
                        dataSource={history}
                        columns={historyColumns}
                        pagination={TABLE_PAGINATION_CONFIG}
                        rowKey="_id"
                    />
                </div>
            )}
        </Modal>
    );
});

export default GocoinHistoryModal; 