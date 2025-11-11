import React, { useEffect, useState } from 'react';
import { Breadcrumb, Layout, message, theme } from 'antd';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import VendorSidebar from '../components/VendorSidebar';
import VendorHeader from '../components/VendorHeader';
import VendorFooter from '../components/VendorFooter';
import { getAllSettings } from '../services/apiSettings';
import { getVendorProfile } from '../services/vendor/apiAuth';
import OrderListener from '../components/orderListeners';

const { Content } = Layout;

const VendorLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const [settingData, setSettingData] = useState({})
  const [vendor, setVendor] = useState({})
  const [loading, setLoading] = useState(true)
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const location = useLocation();
  const navigate = useNavigate();

  const fetchSetting = async () => {
    try {
      const data = await getAllSettings();
      setSettingData(data.data.settings[0])
      // console.log(settingData)
    } catch (error) {
      message.error("Failed to load settings.");
    } finally {
      setLoading(false)
    }
  }

  const fetchVendor = async () => {
    try {
      const res = await getVendorProfile();
      const vendorData = res.data.vendor;
      setVendor(vendorData);
    } catch (err) {
      message.error('Failed to load vendor profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSetting(), fetchVendor()}, [])


  const pathSnippets = location.pathname.split('/').filter(i => i);
  const labelMap = {
    vendor: "Dashboard",
    shop: "Shop",
    product: "Product",
  };

  const breadcrumbItems = pathSnippets.map((segment, index) => {
    const isLast = index === pathSnippets.length - 1;
    return {
      title: (
        <span
          style={{ cursor: 'pointer', color: isLast ? '#000' : '#1677ff' }}
          onClick={() => !isLast && navigate(-1)}
        >
          {labelMap[segment] || segment}
        </span>
      ),
    };
  });

  return (
    <>
      <title>Go Rabit | Vendor Panel</title>
      <Layout style={{ minHeight: '100vh' }}>
        <VendorSidebar collapsed={collapsed} setCollapsed={setCollapsed} settingData={settingData} />

        <Layout>
          <VendorHeader collapsed={collapsed} setCollapsed={setCollapsed} background={colorBgContainer} settingData={settingData} vendorData={vendor}/>

          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: '100vh',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div className='px-4 mb-4'>
              <Breadcrumb items={breadcrumbItems} />
            </div>
            <OrderListener role="vendor"/>
            <Outlet />
          </Content>

          <VendorFooter settingData={settingData} />
        </Layout>
      </Layout>
    </>
  );
};

export default VendorLayout;
