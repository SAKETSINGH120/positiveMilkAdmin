// components/ProfileInfo.jsx
import React from 'react';
import { Form, Input, Button, Avatar } from 'antd';
import { useWatch } from 'antd/es/form/Form';

const ProfileInfo = ({ vendor, form, updateProfile, BASE_URL, loading }) => {
    const ifsc = useWatch('ifsc', form);

    const profileImageVector = "https://static.vecteezy.com/system/resources/thumbnails/059/171/711/small_2x/wonderful-rustic-portrait-of-a-man-with-a-thoughtful-gaze-and-a-gentle-smile-lit-by-a-warm-comforting-light-in-a-kind-compassionate-style-genuine-png.png"

    return (
        <div>
            <div className="flex gap-6 items-center mb-6">
                <Avatar size={96} src={`${vendor?.profileImg ? `${BASE_URL}/${vendor?.profileImg}` : profileImageVector}`} />
                <div>
                    <h2 className="text-xl font-semibold">{vendor?.name}</h2>
                    <p className="text-gray-600">{vendor?.email}</p>
                </div>
            </div>
            <Form form={form} layout="vertical" onFinish={updateProfile}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item label="Name" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="User ID" name="userId">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Mobile Number" name="mobile">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Alternate Mobile" name="alternateMobile">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Email" name="email">
                        <Input />
                    </Form.Item>
                </div>
                <Button type="primary" htmlType="submit" loading={loading}>Update Profile</Button>
            </Form>
        </div>
    );
};

export default ProfileInfo;
