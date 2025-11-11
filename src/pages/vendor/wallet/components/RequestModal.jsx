import React, { useMemo, useState } from 'react';
import { Modal, Button, Input, message as antdMsg } from 'antd';
import { createWithdrawRequest } from '../../../../services/vendor/apiWallet';

export default function RequestModal({ modalVisible, onClose, wallet, fetchWalletRequest }) {
    const [amount, setAmount] = useState('');
    const [requestMsg, setRequestMsg] = useState('');
    const [pct, setPct] = useState(null);
    const [loading, setLoading] = useState(false);

    const remaining = useMemo(() => wallet - (+amount || 0), [amount, wallet]);
    const presets = [10, 25, 50];

    const trySubmit = async () => {
        const num = +amount;
        if (!num || num <= 0) return antdMsg.error('Enter a valid amount');
        if (remaining < 0) return antdMsg.error('Insufficient balance');

        const data = {
            amount_requested: num,
            message: requestMsg,
        }

        setLoading(true)
        try {
            await createWithdrawRequest(data)
            antdMsg.success(`₹${num} request raised!`);
            onClose();
            setAmount('');
            setPct(null);
            setRequestMsg('');
            fetchWalletRequest?.();
        } catch {
            antdMsg.error('Something went wrong');
        }finally {
            setLoading(false); 
        }
    };

    return (
        <Modal
            title="Request Payment"
            open={modalVisible}
            onOk={trySubmit}
            onCancel={() => {
                onClose();
                setAmount(''); setPct(null); setRequestMsg('');
            }}
            okText="Raise Request"
            okButtonProps={{ disabled: !amount || +amount <= 0 || remaining < 0, loading: loading }}
        >
            <p>Total Balance: ₹{wallet}</p>

            <div className="space-y-3 mt-4">
                <div className="flex gap-2">
                    {presets.map(p => (
                        <Button
                            key={p}
                            type={pct === p ? 'primary' : 'default'}
                            onClick={() => {
                                setAmount(Math.floor((wallet * p) / 100).toString());
                                setPct(p);
                            }}
                        >
                            {p}%
                        </Button>
                    ))}
                </div>

                <Input
                    value={amount}
                    onChange={e => { setAmount(e.target.value.replace(/\D/g, '')); setPct(null); }}
                    placeholder="Enter amount"
                />

                <div className='mt-4'>
                    <p>Enter message</p>
                    <Input.TextArea
                        rows={4}
                        placeholder="Optional message"
                        maxLength={150}
                        value={requestMsg}
                        onChange={e => setRequestMsg(e.target.value)}
                    />
                </div>

                {amount && (
                    <div className={`text-sm ${remaining < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                        {remaining < 0 ? '⚠️ Insufficient balance' : `Remaining: ₹${remaining}`}
                    </div>
                )}

                <div className="text-yellow-600 text-sm">⚠️ Only one withdrawal per week.</div>
                {/* <div className="text-blue-600 text-sm">⏳ Processing takes 7 days.</div> */}
            </div>
        </Modal>
    );
}
