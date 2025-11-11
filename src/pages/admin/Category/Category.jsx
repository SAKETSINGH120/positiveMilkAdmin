import React, { useEffect, useState } from 'react'
import { Breadcrumb, Button, Input, message, Modal, Spin } from 'antd'
import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router'
import CategoryTable from './components/CategoryTable'
import AddCategoryModel from './components/AddCategoryModel'
import EditCategoryModel from './components/EditCategoryModel'
import { deleteCategory, getAllCategory } from '@services/apiCategory'
import { usePermissions } from '../../../hooks/usePermissions'

function Category() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { hasPermission } = usePermissions()

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await getAllCategory()
      setCategories(data)
    } catch {
      message.error('Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const openModal = (category = null) => {
    setSelectedCategory(category)
    setEditMode(!!category)
    setIsModalOpen(true)
  }

  const closeModal = (refresh = false) => {
    setIsModalOpen(false)
    setSelectedCategory(null)
    if (refresh) fetchCategories()
  }

  const handleDelete = (category) => {
    Modal.confirm({
      title: 'Delete Category',
      content: `Are you sure you want to delete "${category.name}"?`,
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No, Cancel',
      onOk: async () => {
        try {
          await deleteCategory(category._id)
          message.success('Category deleted successfully!')
          fetchCategories()
        } catch {
          message.error('Failed to delete category.')
        }
      },
    })
  }

  // if (loading) return <Spin size="large" fullscreen />;

  return (
    <>
      <div className="lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between">
        <Input.Search
          placeholder="Search by name"
          onChange={(e) => setSearchText(e.target.value)}
          style={{ maxWidth: 300, borderRadius: '6px' }}
          size="large"
        />
        {hasPermission(['CREATE_CATEGORY']) && (
          <Button type="primary" icon={<FaPlus />} size="large" onClick={() => openModal()}>
            Add Category
          </Button>
        )}
      </div>

      <CategoryTable
        loading={loading}
        searchText={searchText}
        data={categories}
        onEdit={openModal}
        onDelete={handleDelete}
        hasPermission={hasPermission}
      />

      {editMode ? (
        <EditCategoryModel
          isModalOpen={isModalOpen}
          handleOk={() => closeModal(true)}
          handleCancel={() => closeModal(false)}
          categoryData={selectedCategory}
        />
      ) : (
        <AddCategoryModel
          isModalOpen={isModalOpen}
          handleOk={() => closeModal(true)}
          handleCancel={() => closeModal(false)}
        />
      )}
    </>
  )
}

export default Category
