import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const VendorFooter = ({settingData}) => {
    return (
        <Footer className="text-center text-sm text-gray-400">
            {settingData.brandName} Vendor Panel ©{new Date().getFullYear()}
        </Footer>
    );
};

export default VendorFooter;
