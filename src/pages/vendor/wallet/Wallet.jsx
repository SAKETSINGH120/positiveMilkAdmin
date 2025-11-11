// Wallet.jsx
import React, { useEffect, useState } from 'react';
import { Card, Button, message, Tag, Row, Col, Spin } from 'antd';
import { WalletOutlined } from '@ant-design/icons';
import ShopWallet from './components/ShopWallet';
import RequestModal from './components/RequestModal';
import ShopWalletHistory from './ShopWalletHistory';
import { getshopsWallet, getWallet, getWalletRequest } from '../../../services/vendor/apiWallet';
import RequestedPaymentHistory from './components/RequestedPaymentHistory';

const Wallet = () => {
    const [wallet, setWallet] = useState(0)
    const [shopWallets, setShopWallets] = useState([])
    const [walletRequest, setWalletRequest] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [walletLoading, setWalletLoading] = useState(false);
    const [shopsLoading, setShopsLoading] = useState(false);
    const [requestLoading, setRequestLoading] = useState(false);

    useEffect(() => {
        fetchWallet()
        fetchShopsWallet()
        fetchWalletRequest()
    }, [])

    const fetchWallet = async () => {
        setWalletLoading(true);
        try {
            const res = await getWallet();
            setWallet(res.wallet.wallet_balance);
        } catch (error) {
            message.error("Something went wrong in wallet");
        } finally {
            setWalletLoading(false);
        }
    };

    const fetchShopsWallet = async () => {
        setShopsLoading(true);
        try {
            const res = await getshopsWallet();
            setShopWallets(res.shop_list);
        } catch (error) {
            message.error("Something went wrong in shop wallet");
        } finally {
            setShopsLoading(false);
        }
    };

    const fetchWalletRequest = async () => {
        setRequestLoading(true);
        try {
            const res = await getWalletRequest();
            setWalletRequest(res.wallet_request);
        } catch (error) {
            message.error("Something went wrong in wallet request");
        } finally {
            setRequestLoading(false);
        }
    };




    return (
        <div className="p-4 space-y-6">
            <Card className="rounded-2xl shadow">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div className="text-lg font-semibold flex items-center gap-2">
                        <WalletOutlined className="text-blue-500 text-2xl" />
                        Total Wallet Balance: ₹ {walletLoading ? <Spin size='default' /> : wallet}

                    </div>
                    <Button
                        type="primary"
                        onClick={() => setModalVisible(true)}
                        className="mt-4 sm:mt-0"
                    >
                        Request Payment
                    </Button>
                </div>
            </Card>

            <Row gutter={16} className='mt-5' >
                <Col span={18} xs={24} sm={24} md={24} lg={12}>
                    <ShopWallet shopWallets={shopWallets} loading={shopsLoading} />
                </Col>
                <Col span={6} xs={24} sm={24} md={24} lg={12}>
                    <RequestedPaymentHistory walletRequest={walletRequest} loading={requestLoading} />
                </Col>
            </Row>

            {/* payment request by vendor to admin */}
            <RequestModal
                modalVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                wallet={wallet}
                fetchWalletRequest={fetchWalletRequest}
            />
        </div>
    );
};

export default Wallet;
