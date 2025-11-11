// This file centralizes the permission structure for the entire application.
// The 'key' should be a unique, standardized string that you also create in your backend 'permissions' collection.

export const PERMISSION_GROUPS = [
    {
        groupName: "Banner Management",
        permissions: [
            { label: 'Add Banner', key: 'CREATE_BANNER' },
            { label: 'Edit Banner', key: 'UPDATE_BANNER' },
            { label: 'Delete Banner', key: 'DELETE_BANNER' },
            { label: 'View Banners', key: 'LIST_BANNERS' },
        ],
    },
    {
        groupName: "Category Management",
        permissions: [
            { label: 'Add Category', key: 'CREATE_CATEGORY' },
            { label: 'Edit Category', key: 'UPDATE_CATEGORY' },
            { label: 'Delete Category', key: 'DELETE_CATEGORY' },
            { label: 'View Categories', key: 'LIST_CATEGORIES' },
            { label: 'Set Top Shop', key: 'SET_TOP_SHOP_IN_CATEGORY' },
        ],
    },
    {
        groupName: "Sub-Category Management",
        permissions: [
            { label: 'Add Sub-Category', key: 'CREATE_SUBCATEGORY' },
            { label: 'Edit Sub-Category', key: 'UPDATE_SUBCATEGORY' },
            { label: 'Delete Sub-Category', key: 'DELETE_SUBCATEGORY' },
            { label: 'View Sub-Categories', key: 'LIST_SUBCATEGORIES' },
        ],
    },
    {
        groupName: "Product Management",
        permissions: [
            { label: 'Add Product', key: 'CREATE_PRODUCT' },
            { label: 'Edit Product', key: 'UPDATE_PRODUCT' },
            { label: 'Delete Product', key: 'DELETE_PRODUCT' },
            { label: 'View Products', key: 'LIST_PRODUCTS' },
            { label: 'Manage Status', key: 'MANAGE_PRODUCT_STATUS' },
        ],
    },
    {
        groupName: "Vendor Management",
        permissions: [
            { label: 'View Vendors', key: 'LIST_VENDORS' },
            { label: 'View Vendor Details', key: 'VIEW_VENDOR_DETAILS' },
            { label: "View Vendor's Shops", key: 'LIST_VENDOR_SHOPS' },
            { label: 'Edit Vendor', key: 'UPDATE_VENDOR' },
            { label: 'Delete Vendor', key: 'DELETE_VENDOR' },
            { label: 'Approve/Block Vendor', key: 'MANAGE_VENDOR_STATUS' },
        ],
    },
    {
        groupName: "Shop Management",
        permissions: [
            { label: 'View Shops', key: 'LIST_SHOPS' },
            { label: 'View Shop Details', key: 'VIEW_SHOP_DETAILS' },
            { label: 'Edit Shop Priority', key: 'UPDATE_SHOP_PRIORITY' },
        ],
    },
    {
        groupName: "Order Management",
        permissions: [
            { label: 'View Food Orders', key: 'LIST_FOOD_ORDERS' },
            { label: 'View Grocery Orders', key: 'LIST_GROCERY_ORDERS' },
            { label: 'View Order Details', key: 'VIEW_ORDER_DETAILS' },
        ],
    },
    {
        groupName: "Coupon Management",
        permissions: [
            { label: 'Add Coupon', key: 'CREATE_COUPON' },
            { label: 'Edit Coupon', key: 'UPDATE_COUPON' },
            { label: 'Delete Coupon', key: 'DELETE_COUPON' },
            { label: 'View Coupons', key: 'LIST_COUPONS' },
            { label: 'Manage Status', key: 'MANAGE_COUPON_STATUS' },
        ],
    },
    {
        groupName: "Driver Management",
        permissions: [
            { label: 'View Drivers', key: 'LIST_DRIVERS' },
            { label: 'View Driver Details', key: 'VIEW_DRIVER_DETAILS' },
            { label: 'Block/Unblock Driver', key: 'MANAGE_DRIVER_STATUS' },
        ],
    },
    {
        groupName: "Explore Section Management",
        permissions: [
            { label: 'Add Explore Section', key: 'CREATE_EXPLORE_SECTION' },
            { label: 'Edit Explore Section', key: 'UPDATE_EXPLORE_SECTION' },
            { label: 'Delete Explore Section', key: 'DELETE_EXPLORE_SECTION' },
            { label: 'View Explore Sections', key: 'LIST_EXPLORE_SECTIONS' },
            { label: 'View Section Details', key: 'VIEW_EXPLORE_SECTION_DETAILS' },
        ],
    },
    {
        groupName: "Payment Request Management",
        permissions: [
            { label: 'View Vendor Requests', key: 'LIST_VENDOR_PAYMENT_REQUESTS' },
            { label: 'View Driver Requests', key: 'LIST_DRIVER_PAYMENT_REQUESTS' },
        ],
    },
    {
        groupName: "Payout Management",
        permissions: [
            { label: 'Manage Vendor Payouts', key: 'MANAGE_VENDOR_PAYOUTS' },
            { label: 'Manage Driver Payouts', key: 'MANAGE_DRIVER_PAYOUTS' },
        ],
    },
    {
        groupName: "User Management",
        permissions: [
            { label: 'View Users', key: 'LIST_USERS' },
            { label: 'View User Details', key: 'VIEW_USER_DETAILS' },
            { label: "View User's History", key: 'VIEW_USER_HISTORY' },
            { label: 'Block/Unblock User', key: 'MANAGE_USER_STATUS' },
        ],
    },
];