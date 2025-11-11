// import React, { useEffect, useState } from 'react';
// import { Avatar, Layout, Menu } from 'antd';
// import { useNavigate, useLocation } from 'react-router';

// // --- Icon Imports (Your existing imports) ---
// import {
//     LuLayoutDashboard,
//     LuUsers,
//     LuShieldCheck,
//     LuUserCog
// } from "react-icons/lu";
// import { SiNextra } from "react-icons/si";
// import { TbCategory2, TbMapPin } from 'react-icons/tb';
// import { MdOutlineCategory, MdArticle } from 'react-icons/md';
// import {
//     FaClipboardList,
//     FaRegUser,
//     FaSitemap,
// } from 'react-icons/fa';
// import {
//     IoFastFoodOutline,
//     IoImagesOutline,
//     IoSettingsOutline,
//     IoStorefront
// } from 'react-icons/io5';
// import { GiTakeMyMoney } from "react-icons/gi";
// import { FaArrowRightToBracket, FaMoneyBillTransfer } from 'react-icons/fa6';
// import { RiCoupon3Line, RiEBike2Fill, RiLockPasswordLine } from "react-icons/ri";
// import { BiMoneyWithdraw } from "react-icons/bi";
// import { useAuth } from '../context/AuthContext';

// const { Sider } = Layout;

// const AdminSidebar = ({ collapsed, settingData }) => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const BASE_URL = import.meta.env.VITE_BASE_URL || '';

//     const { adminLogout, adminRole, admin } = useAuth();
//     console.log(adminRole)
//     console.log("----------------")
//     console.log(admin)

//     // --- FIX START: Corrected logic for selected and open keys ---
//     const [selectedKey, setSelectedKey] = useState('dashboard');
//     const [openKeys, setOpenKeys] = useState([]);

//     useEffect(() => {
//         // Parse the URL path to determine the active menu item and parent submenu
//         const pathParts = location.pathname.split('/').filter(p => p && p !== 'admin');

//         let newSelectedKey = 'dashboard';
//         let newOpenKeys = [];

// Handles single-level routes like `/admin/roles`
// if (pathParts.length === 1) {
//     newSelectedKey = pathParts[0];
// }
// // Handles nested routes like `/admin/order/food` or `/admin/privacy-policy/vendor`
// else if (pathParts.length === 2) {
//     const [part1, part2] = pathParts;

//     const cmsPages = ['terms-and-conditions', 'privacy-policy', 'refund-policy', 'about-us'];
//     const cmsTypes = ['vendor', 'user', 'driver'];

//     // Special handling for CMS pages because their URL structure doesn't match the key structure directly
//     if (cmsPages.includes(part1) && cmsTypes.includes(part2)) {
//         // Example: For path `/admin/privacy-policy/vendor`...
//         // The parent submenu key is 'vendor-cms'
//         newOpenKeys = [`${part2}-cms`];
//         // The item key is 'vendor-privacy-policy'
//         newSelectedKey = `${part2}-${part1}`;
//     } else {
//         // Handling for all other nested routes (e.g., Orders, Payouts, Settings)
//         newSelectedKey = `${part1}-${part2}`;

//         // A list of all keys that correspond to a collapsible submenu in your `menuItems`
//         const validSubmenus = ['order', 'request', 'payout', 'vendor-cms', 'user-cms', 'driver-cms'];

//         if (validSubmenus.includes(part1)) {
//             newOpenKeys = [part1];
//         }
//         // If part1 is not a valid submenu (e.g., 'settings' from '/admin/settings/charges'),
//         // newOpenKeys remains empty, and no submenu is opened.
//     }
// }

//         setSelectedKey(newSelectedKey);
//         setOpenKeys(newOpenKeys);

//     }, [location.pathname]);
//     // --- FIX END ---

//     // --- Menu Items with updated icons and original structure ---
//     const menuItems = [
//         { type: 'divider' },
//         {
//             key: 'dashboard',
//             icon: <LuLayoutDashboard size={18} />,
//             label: 'Dashboard',
//             onClick: () => navigate('/admin')
//         },
//         {
//             type: 'group',
//             label: 'Roles & Permissions',
//             children: [
//                 {
//                     key: 'roles',
//                     icon: <LuShieldCheck size={18} />,
//                     label: 'Manage Roles',
//                     onClick: () => navigate('/admin/roles')
//                 },
//                 {
//                     key: 'manage-admin',
//                     icon: <LuUserCog size={18} />,
//                     label: 'Manage Admins',
//                     onClick: () => navigate('/admin/manage-admin')
//                 }
//             ]
//         },
//         {
//             type: 'group',
//             label: 'Content',
//             children: [
//                 {
//                     key: 'banner',
//                     icon: <IoImagesOutline size={18} />,
//                     label: 'Banner',
//                     onClick: () => navigate('/admin/banner')
//                 },
//                 {
//                     key: 'explore',
//                     icon: <SiNextra size={18} />,
//                     label: 'Explore',
//                     onClick: () => navigate('/admin/explore')
//                 }
//             ]
//         },
//         {
//             type: 'group',
//             label: 'Product Management',
//             children: [
//                 {
//                     key: 'category',
//                     icon: <TbCategory2 size={18} />,
//                     label: 'Category',
//                     onClick: () => navigate('/admin/category')
//                 },
//                 {
//                     key: 'sub-category',
//                     icon: <MdOutlineCategory size={18} />,
//                     label: 'Sub Category',
//                     onClick: () => navigate('/admin/sub-category')
//                 },
//                 {
//                     key: 'product',
//                     icon: <IoFastFoodOutline size={18} />,
//                     label: 'Product',
//                     onClick: () => navigate('/admin/product')
//                 }
//             ]
//         },
//         {
//             type: 'group',
//             label: 'Vendors & Shops',
//             children: [
//                 {
//                     key: 'vendor',
//                     icon: <LuUsers size={18} />,
//                     label: 'Vendor',
//                     onClick: () => navigate('/admin/vendor')
//                 },
//                 {
//                     key: 'shop',
//                     icon: <IoStorefront size={18} />,
//                     label: 'Shop',
//                     onClick: () => navigate('/admin/shop')
//                 }
//             ]
//         },
//         {
//             type: 'group',
//             label: 'Orders',
//             children: [
//                 {
//                     key: 'order',
//                     icon: <FaClipboardList size={18} />,
//                     label: 'Order',
//                     children: [
//                         { key: 'order-food', label: 'Food', onClick: () => navigate('/admin/order/food') },
//                         { key: 'order-grocery', label: 'Grocery', onClick: () => navigate('/admin/order/grocery') }
//                     ]
//                 },
//             ]
//         },
//         {
//             type: 'group',
//             label: 'Drivers',
//             children: [
//                 {
//                     key: 'driver',
//                     icon: <RiEBike2Fill size={18} />,
//                     label: 'Driver',
//                     onClick: () => navigate('/admin/driver')
//                 }
//             ]
//         },
//         {
//             type: 'group',
//             label: 'Finance',
//             children: [
//                 {
//                     key: 'coupon',
//                     icon: <RiCoupon3Line size={18} />,
//                     label: 'Coupon',
//                     onClick: () => navigate('/admin/coupon')
//                 },
//                 {
//                     key: 'request',
//                     icon: <GiTakeMyMoney size={18} />,
//                     label: 'Payment Request',
//                     children: [
//                         { key: 'request-vendor', label: 'Vendor Request', onClick: () => navigate('/admin/request/vendor') },
//                         { key: 'request-driver', label: 'Driver Request', onClick: () => navigate('/admin/request/driver') }
//                     ]
//                 },
//                 {
//                     key: 'payout',
//                     icon: <FaMoneyBillTransfer size={18} />,
//                     label: 'Payout',
//                     children: [
//                         { key: 'payout-vendor', label: 'Vendor Payout', onClick: () => navigate('/admin/payout/vendor') },
//                         { key: 'payout-driver', label: 'Driver Payout', onClick: () => navigate('/admin/payout/driver') }
//                     ]
//                 },
//             ]
//         },
//         {
//             type: 'group',
//             label: 'Users',
//             children: [
//                 {
//                     key: 'user',
//                     icon: <FaRegUser size={18} />,
//                     label: 'User',
//                     onClick: () => navigate('/admin/user')
//                 }
//             ]
//         },
//         {
//             type: 'group',
//             label: 'CMS Pages',
//             children: [
//                 {
//                     key: 'vendor-cms',
//                     icon: <MdArticle size={18} />,
//                     label: 'Vendor CMS',
//                     children: [
//                         { key: 'vendor-terms-and-conditions', label: 'Terms & Conditions', onClick: () => navigate('/admin/terms-and-conditions/vendor') },
//                         { key: 'vendor-privacy-policy', label: 'Privacy Policy', onClick: () => navigate('/admin/privacy-policy/vendor') },
//                         { key: 'vendor-refund-policy', label: 'Refund Policy', onClick: () => navigate('/admin/refund-policy/vendor') },
//                         { key: 'vendor-about-us', label: 'About Us', onClick: () => navigate('/admin/about-us/vendor') }
//                     ]
//                 },
//                 {
//                     key: 'user-cms',
//                     icon: <MdArticle size={18} />,
//                     label: 'User CMS',
//                     children: [
//                         { key: 'user-terms-and-conditions', label: 'Terms & Conditions', onClick: () => navigate('/admin/terms-and-conditions/user') },
//                         { key: 'user-privacy-policy', label: 'Privacy Policy', onClick: () => navigate('/admin/privacy-policy/user') },
//                         { key: 'user-refund-policy', label: 'Refund Policy', onClick: () => navigate('/admin/refund-policy/user') },
//                         { key: 'user-about-us', label: 'About Us', onClick: () => navigate('/admin/about-us/user') }
//                     ]
//                 },
//                 {
//                     key: 'driver-cms',
//                     icon: <MdArticle size={18} />,
//                     label: 'Driver CMS',
//                     children: [
//                         { key: 'driver-terms-and-conditions', label: 'Terms & Conditions', onClick: () => navigate('/admin/terms-and-conditions/driver') },
//                         { key: 'driver-privacy-policy', label: 'Privacy Policy', onClick: () => navigate('/admin/privacy-policy/driver') },
//                         { key: 'driver-refund-policy', label: 'Refund Policy', onClick: () => navigate('/admin/refund-policy/driver') },
//                         { key: 'driver-about-us', label: 'About Us', onClick: () => navigate('/admin/about-us/driver') }
//                     ]
//                 }
//             ]
//         },
//         {
//             type: 'group',
//             label: 'Settings',
//             children: [
//                 {
//                     key: 'settings-charges',
//                     icon: <IoSettingsOutline size={18} />,
//                     label: 'Site Settings',
//                     onClick: () => navigate('/admin/settings/charges')
//                 },
//                 {
//                     key: 'service-area',
//                     icon: <TbMapPin size={18} />,
//                     label: 'Service Area',
//                     onClick: () => navigate('/admin/service-area')
//                 },
//                 {
//                     key: 'settings-change-password',
//                     icon: <RiLockPasswordLine size={18} />,
//                     label: 'Change Password',
//                     onClick: () => navigate('/admin/settings/change-password')
//                 }
//             ]
//         },
//         { type: 'divider' },
//         {
//             key: 'logout',
//             icon: <FaArrowRightToBracket size={18} />,
//             label: 'Logout',
//             onClick: () => {
//                 adminLogout();
//                 navigate('/admin/login');
//             },
//         }
//     ];

//     return (
//         <Sider
//             width={240}
//             theme="light"
//             collapsible
//             collapsed={collapsed}
//             trigger={null}
//             className="shadow-md border-r"
//             style={{ height: '100vh', position: 'sticky', top: 0, overflow: 'auto' }}
//         >
//             <div className="flex items-center justify-center py-4">
//                 <Avatar size={collapsed ? 40 : 64} src={settingData?.logo ? `${BASE_URL}/${settingData?.logo}` : null} className="transition-all duration-300" />
//                 {!collapsed && <span className="ml-3 font-semibold text-2xl">{settingData?.brandName}</span>}
//             </div>

//             <Menu
//                 mode="inline"
//                 theme="light"
//                 selectedKeys={[selectedKey]}
//                 openKeys={openKeys}
//                 onOpenChange={keys => setOpenKeys(keys)}
//                 items={menuItems}
//                 className="text-[15px] font-medium"
//             />
//         </Sider>
//     );
// };

// export default AdminSidebar;

import React, { useEffect, useState, useMemo } from "react";
import { Avatar, Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router";

// --- Icon Imports (Your existing imports) ---
import {
  LuLayoutDashboard,
  LuUsers,
  LuShieldCheck,
  LuUserCog,
} from "react-icons/lu";
import { SiNextra } from "react-icons/si";
import { TbCategory2, TbMapPin } from "react-icons/tb";
import { MdOutlineCategory, MdArticle } from "react-icons/md";
import { FaClipboardList, FaRegUser, FaSitemap } from "react-icons/fa";
import {
  IoFastFoodOutline,
  IoImagesOutline,
  IoSettingsOutline,
  IoStorefront,
} from "react-icons/io5";
import { GiTakeMyMoney } from "react-icons/gi";
import { FaArrowRightToBracket, FaMoneyBillTransfer } from "react-icons/fa6";
import {
  RiCoupon3Line,
  RiEBike2Fill,
  RiLockPasswordLine,
} from "react-icons/ri";
import { BiMoneyWithdraw } from "react-icons/bi";
import { MdSubscriptions } from "react-icons/md";

// --- Context and Permission Hook Imports ---
import { useAuth } from "../context/AuthContext";
import { usePermissions } from "../hooks/usePermissions"; // <-- IMPORT THE NEW HOOK

const { Sider } = Layout;

const AdminSidebar = ({ collapsed, settingData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const BASE_URL = import.meta.env.VITE_BASE_URL || "";

  const { adminLogout } = useAuth();
  const { hasPermission } = usePermissions(); // <-- USE THE HOOK

  // State for selected and open keys (your existing logic)
  const [selectedKey, setSelectedKey] = useState("dashboard");
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    const pathParts = location.pathname
      .split("/")
      .filter((p) => p && p !== "admin");
    let newSelectedKey = "dashboard";
    let newOpenKeys = [];
    if (pathParts.length === 1) {
      newSelectedKey = pathParts[0];
    } else if (pathParts.length === 2) {
      const [part1, part2] = pathParts;
      const cmsPages = [
        "terms-and-conditions",
        "privacy-policy",
        "refund-policy",
        "about-us",
      ];
      const cmsTypes = ["vendor", "user", "driver"];
      if (cmsPages.includes(part1) && cmsTypes.includes(part2)) {
        newOpenKeys = [`${part2}-cms`];
        newSelectedKey = `${part2}-${part1}`;
      } else {
        newSelectedKey = `${part1}-${part2}`;
        const validSubmenus = [
          "order",
          "request",
          "payout",
          "vendor-cms",
          "user-cms",
          "driver-cms",
        ];
        if (validSubmenus.includes(part1)) {
          newOpenKeys = [part1];
        }
      }
    }
    setSelectedKey(newSelectedKey);
    setOpenKeys(newOpenKeys);
  }, [location.pathname]);

  // --- Define all possible menu items with their required permissions ---
  const allMenuItems = useMemo(
    () => [
      { type: "divider" },
      {
        key: "dashboard",
        icon: <LuLayoutDashboard size={18} />,
        label: "Dashboard",
        onClick: () => navigate("/admin"),
        permissions: [], // No permissions needed for dashboard
      },
      //   {
      //     type: "group",
      //     label: "Roles & Permissions",
      //     children: [
      //       {
      //         key: "roles",
      //         icon: <LuShieldCheck size={18} />,
      //         label: "Manage Roles",
      //         onClick: () => navigate("/admin/roles"),
      //         permissions: ["LIST_ROLES"],
      //       },
      //       {
      //         key: "manage-admin",
      //         icon: <LuUserCog size={18} />,
      //         label: "Manage Admins",
      //         onClick: () => navigate("/admin/manage-admin"),
      //         permissions: ["LIST_ADMINS"],
      //       },
      //     ],
      //   },
      // {
      //     type: 'group',
      //     label: 'Content',
      //     children: [
      //         {
      //             key: 'banner',
      //             icon: <IoImagesOutline size={18} />,
      //             label: 'Banner',
      //             onClick: () => navigate('/admin/banner'),
      //             permissions: ['LIST_BANNERS']
      //         },
      //         {
      //             key: 'explore',
      //             icon: <SiNextra size={18} />,
      //             label: 'Explore',
      //             onClick: () => navigate('/admin/explore'),
      //             permissions: ['LIST_EXPLORE_SECTIONS']
      //         }
      //     ]
      // },
      {
        type: "group",
        label: "Content",
        children: [
          {
            key: "banner",
            icon: <IoImagesOutline size={18} />,
            label: "Banner",
            onClick: () => navigate("/admin/banner"),
          },
          // {
          //   key: 'explore',
          //   icon: <SiNextra size={18} />,
          //   label: 'Explore',
          //   onClick: () => navigate('/admin/explore'),
          // },
        ],
      },
      {
        type: "group",
        label: "Product Management",
        children: [
          {
            key: "category",
            icon: <TbCategory2 size={18} />,
            label: "Category",
            onClick: () => navigate("/admin/category"),
            permissions: ["LIST_CATEGORIES"],
          },
          {
            key: "sub-category",
            icon: <MdOutlineCategory size={18} />,
            label: "Sub Category",
            onClick: () => navigate("/admin/sub-category"),
            permissions: ["LIST_SUBCATEGORIES"],
          },
          {
            key: "product",
            icon: <IoFastFoodOutline size={18} />,
            label: "Product",
            onClick: () => navigate("/admin/product"),
            permissions: ["LIST_PRODUCTS"],
          },
        ],
      },

      //   {
      //     type: "group",
      //     label: "Vendors & Shops",
      //     children: [
      //       {
      //         key: "vendor",
      //         icon: <LuUsers size={18} />,
      //         label: "Vendor",
      //         onClick: () => navigate("/admin/vendor"),
      //         permissions: ["LIST_VENDORS"],
      //       },
      //       {
      //         key: "shop",
      //         icon: <IoStorefront size={18} />,
      //         label: "Shop",
      //         onClick: () => navigate("/admin/shop"),
      //         permissions: ["LIST_SHOPS"],
      //       },
      //     ],
      //   },
      {
        type: "group",
        label: "Orders",
        children: [
          {
            key: "order",
            icon: <FaClipboardList size={18} />,
            label: "Order",
            children: [
              {
                key: "order-food",
                label: "OrderList",
                onClick: () => navigate("/admin/order/milk"),
                permissions: ["LIST_FOOD_ORDERS"],
              },
              {
                key: "order-categorywise",
                label: "category Orders",
                onClick: () => navigate("/admin/order/category_order"),
                permissions: ["LIST_FOOD_ORDERS"],
              },

              // {
              //   key: 'order-grocery',
              //   label: 'orderList',
              //   onClick: () => navigate('/admin/order/grocery'),
              //   permissions: ['LIST_GROCERY_ORDERS'],
              // },
            ],
          },
        ],
      },
      {
        type: "group",
        label: "Dairy Collection Info",
        children: [
          {
            key: "dairy-farmer",
            // icon: <IoSettingsOutline size={18} />,
            label: "Dairy-Farmer",
            onClick: () => navigate("/admin/dairy-farmer"),
          },
          {
            key: "dairy-collections",
            // icon: <TbMapPin size={18} />,
            label: "Dairy-Collections",
            onClick: () => navigate("/admin/dairy-collections"),
          },
        ],
      },
      {
        type: "group",
        label: "Drivers",
        children: [
          {
            key: "driver",
            icon: <RiEBike2Fill size={18} />,
            label: "Driver",
            onClick: () => navigate("/admin/driver"),
            permissions: ["LIST_DRIVERS"],
          },
        ],
      },
      {
        type: "group",
        label: "Finance",
        children: [
          // {
          //   key: "coupon",
          //   icon: <RiCoupon3Line size={18} />,
          //   label: "Coupon",
          //   onClick: () => navigate("/admin/coupon"),
          //   permissions: ["LIST_COUPONS"],
          // },
          {
            key: "request",
            icon: <GiTakeMyMoney size={18} />,
            label: "Payment Request",
            children: [
              // {
              //   key: "request-vendor",
              //   label: "Vendor Request",
              //   onClick: () => navigate("/admin/request/vendor"),
              //   permissions: ["LIST_VENDOR_PAYMENT_REQUESTS"],
              // },
              {
                key: "request-driver",
                label: "Driver Request",
                onClick: () => navigate("/admin/request/driver"),
                permissions: ["LIST_DRIVER_PAYMENT_REQUESTS"],
              },
            ],
          },
          {
            key: "payout",
            icon: <FaMoneyBillTransfer size={18} />,
            label: "Payout",
            children: [
              // {
              //   key: "payout-vendor",
              //   label: "Vendor Payout",
              //   onClick: () => navigate("/admin/payout/vendor"),
              //   permissions: ["MANAGE_VENDOR_PAYOUTS"],
              // },
              {
                key: "payout-driver",
                label: "Driver Payout",
                onClick: () => navigate("/admin/payout/driver"),
                permissions: ["MANAGE_DRIVER_PAYOUTS"],
              },
            ],
          },
        ],
      },
      {
        type: "group",
        label: "Users",
        children: [
          {
            key: "user",
            icon: <FaRegUser size={18} />,
            label: "User",
            onClick: () => navigate("/admin/user"),
            permissions: ["LIST_USERS"],
          },
          {
            key: "users",
            icon: <FaRegUser size={18} />,
            label: "Low Balance Users",
            onClick: () => navigate("/admin/low-balance-lists"),
            permissions: ["LIST_USERS_BALANCE"],
          },
        ],
      },
      {
        type: "group",
        label: "CMS Pages",
        children: [
          //   {
          //     key: "vendor-cms",
          //     icon: <MdArticle size={18} />,
          //     label: "Vendor CMS",
          //     children: [
          //       {
          //         key: "vendor-terms-and-conditions",
          //         label: "Terms & Conditions",
          //         onClick: () => navigate("/admin/terms-and-conditions/vendor"),
          //         permissions: ["VIEW_VENDOR_TERMS_AND_CONDITIONS"],
          //       },
          //       {
          //         key: "vendor-privacy-policy",
          //         label: "Privacy Policy",
          //         onClick: () => navigate("/admin/privacy-policy/vendor"),
          //         permissions: ["VIEW_VENDOR_PRIVACY_POLICY"],
          //       },
          //       {
          //         key: "vendor-refund-policy",
          //         label: "Refund Policy",
          //         onClick: () => navigate("/admin/refund-policy/vendor"),
          //         permissions: ["VIEW_VENDOR_REFUND_POLICY"],
          //       },
          //       {
          //         key: "vendor-about-us",
          //         label: "About Us",
          //         onClick: () => navigate("/admin/about-us/vendor"),
          //         permissions: ["VIEW_VENDOR_ABOUT_US"],
          //       },
          //     ],
          //   },
          {
            key: "user-cms",
            icon: <MdArticle size={18} />,
            label: "User CMS",
            children: [
              {
                key: "user-terms-and-conditions",
                label: "Terms & Conditions",
                onClick: () => navigate("/admin/terms-and-conditions/user"),
                permissions: ["VIEW_USER_TERMS_AND_CONDITIONS"],
              },
              {
                key: "user-privacy-policy",
                label: "Privacy Policy",
                onClick: () => navigate("/admin/privacy-policy/user"),
                permissions: ["VIEW_USER_PRIVACY_POLICY"],
              },
              {
                key: "user-refund-policy",
                label: "Refund Policy",
                onClick: () => navigate("/admin/refund-policy/user"),
                permissions: ["VIEW_USER_REFUND_POLICY"],
              },
              {
                key: "user-about-us",
                label: "About Us",
                onClick: () => navigate("/admin/about-us/user"),
                permissions: ["VIEW_USER_ABOUT_US"],
              },
            ],
          },
          {
            key: "driver-cms",
            icon: <MdArticle size={18} />,
            label: "Driver CMS",
            children: [
              {
                key: "driver-terms-and-conditions",
                label: "Terms & Conditions",
                onClick: () => navigate("/admin/terms-and-conditions/driver"),
                permissions: ["VIEW_DRIVER_TERMS_AND_CONDITIONS"],
              },
              {
                key: "driver-privacy-policy",
                label: "Privacy Policy",
                onClick: () => navigate("/admin/privacy-policy/driver"),
                permissions: ["VIEW_DRIVER_PRIVACY_POLICY"],
              },
              {
                key: "driver-refund-policy",
                label: "Refund Policy",
                onClick: () => navigate("/admin/refund-policy/driver"),
                permissions: ["VIEW_DRIVER_REFUND_POLICY"],
              },
              {
                key: "driver-about-us",
                label: "About Us",
                onClick: () => navigate("/admin/about-us/driver"),
                permissions: ["VIEW_DRIVER_ABOUT_US"],
              },
            ],
          },
        ],
      },
      {
        type: "group",
        label: "Settings",
        children: [
          {
            key: "settings-charges",
            icon: <IoSettingsOutline size={18} />,
            label: "Site Settings",
            onClick: () => navigate("/admin/settings/charges"),
            permissions: ["MANAGE_SITE_SETTINGS"],
          },
          {
            key: "service-area",
            icon: <TbMapPin size={18} />,
            label: "Service Area",
            onClick: () => navigate("/admin/service-area"),
            permissions: ["MANAGE_SERVICE_AREAS"],
          },
          {
            key: "settings-change-password",
            icon: <RiLockPasswordLine size={18} />,
            label: "Change Password",
            onClick: () => navigate("/admin/settings/change-password"),
            permissions: [], // No permissions needed
          },
        ],
      },
      {
        type: "group",
        label: "subscription",
        children: [
          {
            key: "subscriptions",
            icon: <MdSubscriptions size={18} />,
            label: "Subscriptions",
            onClick: () => navigate("/admin/subscription"),
            permissions: ["MANAGE_SUBSCRIPTION"],
          },
        ],
      },
      {
        type: "group",
        label: "Support",
        children: [
          {
            key: "support",
            icon: <FaRegUser size={18} />,
            label: "Support Query",
            onClick: () => navigate("/admin/support"),
            permissions: ["LIST_SUPPORT_QUERY"],
          },
        ],
      },
      { type: "divider" },
      {
        key: "logout",
        icon: <FaArrowRightToBracket size={18} />,
        label: "Logout",
        onClick: () => {
          adminLogout();
          navigate("/admin/login");
        },
      },
    ],
    [navigate]
  );

  // --- Filter the menu items based on permissions ---
  const permittedMenuItems = useMemo(() => {
    const filterItems = (items) => {
      return items.reduce((acc, item) => {
        // If the item has children (like a group or submenu), filter them first.
        if (item.children) {
          const visibleChildren = filterItems(item.children);
          // If any children are visible, add the parent to the menu.
          if (visibleChildren.length > 0) {
            acc.push({ ...item, children: visibleChildren });
          }
          return acc;
        }

        // If it's a regular item, check its permissions.
        if (hasPermission(item.permissions)) {
          acc.push(item);
        }
        return acc;
      }, []);
    };
    return filterItems(allMenuItems);
  }, [allMenuItems, hasPermission]);

  return (
    <Sider
      width={240}
      theme="light"
      collapsible
      collapsed={collapsed}
      trigger={null}
      className="shadow-md border-r"
      style={{ height: "100vh", position: "sticky", top: 0, overflow: "auto" }}
    >
      <div className="flex items-center justify-center py-4">
        <Avatar
          size={collapsed ? 40 : 64}
          src={settingData?.logo ? `${BASE_URL}/${settingData?.logo}` : null}
          className="transition-all duration-300"
        />
        {!collapsed && (
          <span className="ml-3 font-semibold text-2xl">
            {settingData?.brandName}
          </span>
        )}
      </div>

      <Menu
        mode="inline"
        theme="light"
        selectedKeys={[selectedKey]}
        openKeys={openKeys}
        onOpenChange={(keys) => setOpenKeys(keys)}
        items={permittedMenuItems} // <-- USE THE FILTERED MENU
        className="text-[15px] font-medium"
      />
    </Sider>
  );
};

export default AdminSidebar;
