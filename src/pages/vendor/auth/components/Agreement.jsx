import React from 'react'
import { Form, Checkbox } from 'antd';

function Agreement({ termCondition, fee }) {
    return (
        <>
            <div className="max-h-52 overflow-y-auto p-4 border border-gray-300 rounded mb-4 bg-gray-50 text-sm">
                <p className="font-bold">GoRabit Vendor Agreement:</p> <br /> <br />
                <div className="whitespace-pre-line">{termCondition}</div>
            </div>
            <span className="font-bold">GoRabit Commission: {fee?.commission}% </span> |
            <span className="font-bold"> GST: {fee?.gst}% </span> |
            <span className="font-bold"> Onbording Fee: {fee?.onbording} ₹</span>
            <Form.Item name="agreement" valuePropName="checked" rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('You must accept the agreement.') }]}>
                <Checkbox>I have read and agree to the terms & conditions</Checkbox>
            </Form.Item>
        </>
    )
}

export default Agreement
