import React, { useEffect, useState } from "react";
import { Tabs, Input, Button, Modal, message } from "antd";
import { FaPlus } from "react-icons/fa";
import FoodProductTable from "./components/FoodProductTable";
import AddFoodProductModel from "./components/AddFoodProductModal";
import EditFoodProductModel from "./components/EditFoodProductModal";
import { getAllProducts } from "@services/apiProduct";
import { getAllCategory, getAllSubCategory } from "@services/apiCategory";
import { getAllVendor } from "@services/apiVendor";
import { getAllBrand } from "@services/apiBrand";
import { deleteProduct, getProductDetail } from "../../../services/apiProduct";
import { usePermissions } from "../../../hooks/usePermissions";

const { TabPane } = Tabs;

const FoodProduct = () => {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brand, setBrand] = useState([]);
  const [vendor, setVendor] = useState([]);
  const [activeTab, setActiveTab] = useState("food"); // default tab

  const { hasPermission } = usePermissions();

  const fetchProduct = async (type) => {
    setLoading(true);
    try {
      const productList = await getAllProducts(type);
      setProducts(productList || []);
    } catch {
      message.error("Error fetching product list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const fetchMetaData = async () => {
      const categoryList = await getAllCategory();
      const subCategoryList = await getAllSubCategory();
      const brandList = await getAllBrand();
      const vendorList = await getAllVendor();
      setCategories(categoryList);
      setSubCategories(subCategoryList);
      setBrand(brandList);
      setVendor(vendorList);
    };
    fetchMetaData();
  }, []);

  const transformedSubCategories = subCategories.reduce((acc, subCat) => {
    const catId = subCat?.cat_id?._id;
    if (!acc[catId]) acc[catId] = [];
    acc[catId].push(subCat);
    return acc;
  }, {});

  const handleDelete = (product) => {
    Modal.confirm({
      title: "Are you sure you want to delete this product?",
      content: `This will permanently delete "${product.name}"`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: () => deleteProductFn(product._id),
    });
  };

  const deleteProductFn = async (id) => {
    try {
      await deleteProduct(id);
      fetchProduct(activeTab);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (productId) => {
    try {
      setLoading(true);
      const productDetails = await getProductDetail(productId);
      setSelectedProduct(productDetails);
      setIsEditModalOpen(true);
    } catch (error) {
      message.error("Failed to fetch product details");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
                <TabPane tab="Food" key="food" />
                <TabPane tab="Grocery" key="grocery" />
            </Tabs> */}

      <div className="lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between">
        <Input.Search
          placeholder={`Search by product name`}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300, borderRadius: "6px" }}
          size="large"
        />
        {hasPermission(["CREATE_PRODUCT"]) && (
          <Button
            type="primary"
            icon={<FaPlus />}
            size="large"
            onClick={() => setIsModalOpen(true)}
          >
            Add Products
          </Button>
        )}

        {/* {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} */}
      </div>

      <FoodProductTable
        searchText={searchText}
        data={products}
        onEdit={(product) => handleEdit(product._id)}
        onDelete={handleDelete}
        loading={loading}
        hasPermission={hasPermission}
      />

      <AddFoodProductModel
        isModalOpen={isModalOpen}
        handleOk={() => {
          setIsModalOpen(false);
          fetchProduct(activeTab);
        }}
        handleCancel={() => setIsModalOpen(false)}
        data={{
          categories,
          brand,
          vendor,
          transformedSubCategories,
          subCategories,
        }}
        serviceType={activeTab}
      />

      <EditFoodProductModel
        isModalOpen={isEditModalOpen}
        handleOk={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
          fetchProduct(activeTab);
        }}
        handleCancel={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        productData={selectedProduct}
        data={{
          categories,
          brand,
          vendor,
          transformedSubCategories,
          subCategories,
        }}
      />
    </>
  );
};

export default FoodProduct;
