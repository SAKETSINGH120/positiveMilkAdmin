import React, { useState, useEffect } from 'react';
import { Avatar, Button, Layout, Dropdown, Space, Typography } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons';
import { FaAngleRight, FaArrowRightToBracket } from 'react-icons/fa6';
import { IoSettingsSharp } from 'react-icons/io5';
import { CgProfile } from 'react-icons/cg';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

const { Header } = Layout;
const { Text } = Typography;
const BASE_URL = import.meta.env.VITE_BASE_URL;

function VendorHeader({ collapsed, setCollapsed, background, settingData, vendorData }) {
    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    const { vendorLogout } = useAuth();
    // console.log(settingData)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const items = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
            className: 'bg-gray-100 text-gray-600 cursor-default'
        },
        {
            type: 'divider',
            className: 'my-2'
        },
        {
            key: '2',
            label: (
                <div onClick={() => navigate('/vendor/profile')} className="hover:bg-gray-100 px-4 py-2 cursor-pointer">
                    <Space className="flex items-center gap-2">
                        <CgProfile className="text-base" />
                        <Text>Profile</Text>
                    </Space>
                </div>
            )
        },
        {
            key: '4',
            label: (
                <div
                    onClick={() => {
                        vendorLogout();
                        navigate('/vendor/login');
                    }}
                    className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                >
                    <Space className="flex items-center gap-2">
                        <FaArrowRightToBracket className="text-base" />
                        <Text>Logout</Text>
                    </Space>
                </div>
            )
        }
    ];

    return (
        <Header className="bg-white shadow-md px-6 h-16 z-10" style={{ background }}>
            <div className="flex justify-between items-center h-full">
                <div className="flex items-center gap-4">
                    <Button
                        type="text"
                        shape="circle"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        className="text-xl w-12 h-12 text-green-600 flex items-center justify-center"
                    />
                    <Text strong className="text-xl text-green-600 hidden sm:block">{settingData.brandName}</Text>
                </div>

                <div className="flex items-center gap-6">
                    <div className="sm:flex flex-col items-end hidden">
                        <Text className="text-sm text-gray-600 font-medium">
                            {currentTime.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </Text>
                        <Text className="text-base text-green-600 font-semibold">
                            {currentTime.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </Text>
                    </div>

                    <Dropdown menu={{ items }} trigger={['click']}>
                        <div className="flex items-center gap-2 p-2 px-3 rounded-lg cursor-pointer transition-colors hover:bg-gray-100">
                            <Avatar
                                size={36}
                                className="bg-green-600 flex items-center justify-center"

                            >
                                {vendorData.profileImg ? (<img src={`${BASE_URL}/${vendorData.profileImg}`} alt="" />) : (<img src="https://static.vecteezy.com/system/resources/thumbnails/059/171/711/small_2x/wonderful-rustic-portrait-of-a-man-with-a-thoughtful-gaze-and-a-gentle-smile-lit-by-a-warm-comforting-light-in-a-kind-compassionate-style-genuine-png.png" />)}

                            </Avatar>
                            <Text strong className="text-green-600 font-semibold">{vendorData.name}</Text>
                            <FaAngleRight className="text-green-600 text-sm" />
                        </div>
                    </Dropdown>
                </div>
            </div>
        </Header>
    );
}

export default VendorHeader;
