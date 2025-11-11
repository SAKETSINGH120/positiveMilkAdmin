import React, { useEffect, useState } from "react";
import { Button, Card, Input, message, Modal, Spin } from "antd";
import AddServiceAreaModal from "./components/AddServiceAreaModal";
import EditServiceAreaModal from "./components/EditServiceAreaModal";
import ServiceAreaTable from "./components/ServiceAreaTable";
import {
  getAllServiceArea,
  deleteServiceArea,
} from "@services/admin/apiServiceArea";

function ServiceArea() {
  const [serviceAreas, setServiceAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);

  const fetchServiceAreas = async () => {
    setLoading(true);
    try {
      const data = await getAllServiceArea();
      setServiceAreas(data.area || []);
    } catch {
      message.error("Failed to load service areas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  const openModal = (area = null) => {
    setSelectedArea(area);
    setEditMode(!!area);
    setIsModalOpen(true);
  };

  const closeModal = (refresh = false) => {
    setIsModalOpen(false);
    setSelectedArea(null);
    if (refresh) fetchServiceAreas();
  };

  const handleDelete = (area) => {
    Modal.confirm({
      title: "Delete Service Area",
      content: `Are you sure you want to delete service area with pincode "${area.pincode}"?`,
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "No, Cancel",
      onOk: async () => {
        try {
          await deleteServiceArea(area._id);
          message.success("Service area deleted successfully!");
          fetchServiceAreas();
        } catch {
          message.error("Failed to delete service area.");
        }
      },
    });
  };

  // Filtered data for search
  const filteredAreas = serviceAreas.filter((area) => {
    const search = searchText.toLowerCase();
    return (
      area.pincode?.toString().includes(search) ||
      area.city?.toLowerCase().includes(search) ||
      area.state?.toLowerCase().includes(search)
    );
  });

  return (
    <>
      <div className="lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between">
        <Input.Search
          placeholder="Search by pincode, city, or state"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300, borderRadius: "6px" }}
          size="large"
        />
        <Button type="primary" size="large" onClick={() => openModal()}>
          Add Service Area
        </Button>
      </div>

      <ServiceAreaTable
        loading={loading}
        data={filteredAreas}
        onEdit={openModal}
        onDelete={handleDelete}
      />

      {editMode ? (
        <EditServiceAreaModal
          isModalOpen={isModalOpen}
          handleOk={() => closeModal(true)}
          handleCancel={() => closeModal(false)}
          serviceAreaData={selectedArea}
        />
      ) : (
        <AddServiceAreaModal
          isModalOpen={isModalOpen}
          handleOk={() => closeModal(true)}
          handleCancel={() => closeModal(false)}
        />
      )}
    </>
  );
}

export default ServiceArea;
