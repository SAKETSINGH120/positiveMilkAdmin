// import React, { useState } from 'react'
// import { Outlet } from 'react-router';

// import { Button, Layout, theme } from 'antd';
// const { Content } = Layout;
// import AdminSidebar from '../components/AdminSidebar';
// import AdminHeader from '../components/AdminHeader';
// import AdminFooter from '../components/AdminFooter';
// function adminLayout() {
//     const [collapsed, setCollapsed] = useState(false);
//     const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

//     return (
//         <>
//         <title>positiveMilk | Admin Panel</title>
//             <Layout>
//                 <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
//                 <Layout>
//                     <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed} background={colorBgContainer} />
//                     <Content style={{ margin: '24px 16px', padding: 24, minHeight: "100vh", background: colorBgContainer, borderRadius: borderRadiusLG }}>
//                         <Outlet />
//                     </Content>
//                     <AdminFooter />
//                 </Layout>
//             </Layout>
//         </>
//     )
// }

// export default adminLayout;

import React, { useEffect, useState } from "react";
import { Layout, theme, Breadcrumb, message } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import AdminSidebar from "../components/AdminSidebar";
import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import { getAllSettings } from "../services/apiSettings";
import OrderListener from "../components/orderListeners";

const { Content } = Layout;

function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [settingData, setSettingData] = useState({});
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchSetting = async () => {
    try {
      const data = await getAllSettings();
      setSettingData(data.data.settings[0]);
      setImageUrl(`${BASE_URL}/${data.data.settings[0].logo}`);
    } catch (error) {
      message.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSetting();
  }, []);

  // Map route segments to user-friendly labels
  const labelMap = {
    admin: "Dashboard",
    banner: "Banner",
    product: "Products",
    "grocery-product": "Grocery Products",
    category: "Category",
    "sub-category": "Sub Category",
    vendor: "Vendors",
    user: "Users",
    settings: "Settings",
    profile: "Profile",
    charges: "Charges",
    "terms-and-conditions": "Terms & Conditions",
    "privacy-policy": "Privacy Policy",
    "refund-policy": "Refund Policy",
    request: "Payment Request",
    payout: "Payout",
  };

  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const breadcrumbItems = pathSnippets.map((segment, index) => {
    const isLast = index === pathSnippets.length - 1;
    return {
      title: (
        <span
          style={{
            cursor: !isLast ? "pointer" : "default",
            color: isLast ? "#000" : "#1677ff",
          }}
          onClick={() => {
            if (!isLast) {
              // Navigate to parent path
              const url = "/" + pathSnippets.slice(0, index + 1).join("/");
              navigate(-1);
            }
          }}
        >
          {labelMap[segment] || segment}
        </span>
      ),
    };
  });

  return (
    <>
      <title>PositiveMilk | Admin Panel</title>
      <Layout style={{ minHeight: "100vh" }}>
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          settingData={settingData}
        />
        <Layout>
          <AdminHeader
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            background={colorBgContainer}
            settingData={settingData}
          />
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              minHeight: "100vh",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <div className="px-4 mb-4">
              <Breadcrumb items={breadcrumbItems} />
            </div>
            {/* <OrderListener role="admin" /> */}
            <Outlet />
          </Content>
          <AdminFooter settingData={settingData} />
        </Layout>
      </Layout>
    </>
  );
}

export default AdminLayout;
