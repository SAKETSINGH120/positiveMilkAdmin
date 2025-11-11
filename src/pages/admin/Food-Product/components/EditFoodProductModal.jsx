import React, { useState, useEffect } from 'react'
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Row,
  Col,
  Avatar,
  message,
  Checkbox,
} from 'antd'
import { UploadOutlined, PlusOutlined } from '@ant-design/icons'
import { updateProduct } from '../../../../services/apiProduct'
const BASE_URL = import.meta.env.VITE_BASE_URL

const { Option } = Select

function EditFoodProductModal({ isModalOpen, handleOk, handleCancel, productData, data }) {
  const [form] = Form.useForm()
  const { categories, subCategories } = data

  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedUnit, setSelectedUnit] = useState('')
  const [filteredSubCategories, setFilteredSubCategories] = useState([])

  const [primaryImageList, setPrimaryImageList] = useState([])
  const [galleryImageList, setGalleryImageList] = useState([])

  // Helper to convert server path to full URL
  const getImageUrl = (path) => {
    if (!path) return ''
    return `${BASE_URL || ''}/${path.replace(/\\/g, '/')}`
  }

  useEffect(() => {
    if (productData && isModalOpen) {
      const categoryId = productData.categoryId?._id || productData.categoryId
      const subCategoryId = productData.subCategoryId?._id || productData.subCategoryId

      // Extract unit and quantity from sellingUnit (e.g., "1 kg" -> unit: "kg", quantity: "1")
      const sellingUnitParts = productData.sellingUnit
        ? productData.sellingUnit.split(' ')
        : ['', '']
      const unit =
        sellingUnitParts.length > 1
          ? sellingUnitParts.slice(1).join(' ')
          : productData.unitOfMeasurement
      const quantity = sellingUnitParts.length > 0 ? sellingUnitParts[0] : ''

      form.setFieldsValue({
        name: productData.name,
        mrp: Number(productData.mrp),
        sellingPrice: Number(productData.sellingPrice),
        discount: Number(productData.discount || 0),
        unitOfMeasurement: unit,
        sellingUnit: quantity,
        serviceId: productData.serviceId?._id || productData.serviceId,
        type: productData.type,
        category: categoryId,
        subCategory: subCategoryId,
        shortDescription: productData.shortDescription,
        longDescription: productData.longDescription,
        isSubscribable: !!productData.isSubscribable,
        isRecommended: !!productData.isRecommended,
        isFeatured: !!productData.isFeatured,
      })

      setSelectedUnit(unit)

      setSelectedCategory(categoryId)

      const filteredSubs = subCategories.filter(
        (sub) => sub.cat_id === categoryId || sub.cat_id?._id === categoryId,
      )
      setFilteredSubCategories(filteredSubs)

      // Setup primary image list:
      if (productData.primary_image) {
        setPrimaryImageList([
          {
            uid: 'primary-1',
            name: 'Primary Image',
            status: 'done',
            url: getImageUrl(productData.primary_image),
            originFileObj: null, // no file object for existing image
          },
        ])
      } else {
        setPrimaryImageList([])
      }

      // Setup gallery image list:
      const gallery = productData.gallery_image || []
      setGalleryImageList(
        gallery.map((img, i) => ({
          uid: `gallery-${i}`,
          name: `gallery-${i}.jpg`,
          status: 'done',
          url: getImageUrl(img),
          originFileObj: null, // no file object for existing images
        })),
      )
    } else {
      form.resetFields()
      setSelectedCategory(null)
      setFilteredSubCategories([])
      setPrimaryImageList([])
      setGalleryImageList([])
    }
  }, [productData, isModalOpen, subCategories, form])

  // Update discount on price change
  const handlePriceChange = () => {
    const { mrp, sellingPrice } = form.getFieldsValue()
    if (mrp && sellingPrice) {
      const discount = Math.max(0, Math.round(((mrp - sellingPrice) / mrp) * 100))
      form.setFieldsValue({ discount })
    }
  }

  const handleCategoryChange = (value) => {
    setSelectedCategory(value)
    const filtered = subCategories.filter(
      (sub) => sub.cat_id === value || sub.cat_id?._id === value,
    )
    setFilteredSubCategories(filtered)
    form.setFieldsValue({ subCategory: undefined })
  }

  const handleUnitChange = (value) => {
    setSelectedUnit(value)
  }

  const onFinish = async (values) => {
    try {
      const formData = new FormData()

      formData.append('name', values.name)
      // formData.append("sku", values.sku);
      formData.append('mrp', values.mrp)
      formData.append('sellingPrice', values.sellingPrice)
      formData.append('discount', values.discount || 0)
      formData.append('unitOfMeasurement', values.unitOfMeasurement)
      formData.append('sellingUnit', `${values.sellingUnit} ${values.unitOfMeasurement}`)
      formData.append('shortDescription', values.shortDescription)
      formData.append('longDescription', values.longDescription)
      formData.append('serviceId', values.serviceId)
      formData.append('type', 'veg')
      formData.append('categoryId', values.category)
      formData.append('subCategoryId', values.subCategory)
      formData.append('isSubscribable', values.isSubscribable ? 'true' : 'false')
      formData.append('isRecommended', values.isRecommended ? 'true' : 'false')
      formData.append('isFeatured', values.isFeatured ? 'true' : 'false')

      // Append primary image only if user uploaded a new file
      if (primaryImageList.length > 0) {
        const primary = primaryImageList[0]
        if (primary.originFileObj) {
          formData.append('primary_image', primary.originFileObj)
        }
      }

      // Append gallery images only if new files uploaded
      for (const file of galleryImageList) {
        if (file.originFileObj) {
          formData.append('gallery_image', file.originFileObj)
        }
      }

      await updateProduct(productData._id, formData)

      message.success('Product updated successfully!')
      handleOk()
    } catch (error) {
      console.error('Update error:', error)
      message.error('Failed to update product.')
    }
  }

  return (
    <Modal
      title={`Edit Product: ${productData?.name || ''}`}
      open={isModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCancel}
      okText="Save Changes"
      width={800}
      destroyOnClose={true}
    >
      <Form form={form} layout="vertical" onFinish={onFinish} className="space-y-4">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
              <Input placeholder="Enter product name" />
            </Form.Item>
          </Col>
          {/* <Col span={12}>
                        <Form.Item name="sku" label="SKU" rules={[{ required: true }]}>
                            <Input placeholder="Enter SKU" />
                        </Form.Item>
                    </Col> */}
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="mrp" label="MRP (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} onChange={handlePriceChange} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sellingPrice" label="Selling Price (₹)" rules={[{ required: true }]}>
              <InputNumber min={0} style={{ width: '100%' }} onChange={handlePriceChange} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="discount" label="Discount (%)">
              <InputNumber readOnly min={0} max={100} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="unitOfMeasurement"
              label="Unit of Measurement"
              rules={[{ required: true }]}
            >
              <Select placeholder="Select unit" onChange={handleUnitChange}>
                <Option value="pieces">Pieces</Option>
                <Option value="grams">Grams</Option>
                <Option value="kg">Kilograms</Option>
                <Option value="pack">Pack</Option>
                <Option value="bottle">Bottle</Option>
                <Option value="box">Box</Option>
                <Option value="dozen">Dozen</Option>
                <Option value="liter">Liter</Option>
                <Option value="ml">Milliliter</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="sellingUnit" label="Selling Unit" rules={[{ required: true }]}>
              <InputNumber
                min={0}
                step={0.1}
                style={{ width: '100%' }}
                placeholder="Enter quantity"
                addonAfter={selectedUnit}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item name="serviceId" label="Service Type" rules={[{ required: true }]}>
              <Select placeholder="Select service">
                <Option value="67ecc79120a93fc0b92a8b19">Milk</Option>
                {/* <Option value="67ecc79a20a93fc0b92a8b1b">Grocery</Option> */}
              </Select>
            </Form.Item>
          </Col>
          {/*  <Col span={6}>
            <Form.Item name="type" label="Type" rules={[{ required: true }]}>
              <Select placeholder="Select type">
                <Option value="veg">Veg</Option>
                <Option value="nonveg">Non-Veg</Option>
              </Select>
            </Form.Item>
          </Col> */}
          <Col span={6}>
            <Form.Item name="category" label="Category" rules={[{ required: true }]}>
              <Select
                placeholder="Select category"
                onChange={handleCategoryChange}
                showSearch
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
                optionFilterProp="children"
              >
                {categories.map((cat) => (
                  <Option key={cat._id} value={cat._id}>
                    {cat.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="subCategory" label="Sub-Category">
              <Select placeholder="Select sub-category" disabled={!selectedCategory}>
                {filteredSubCategories.map((sub) => (
                  <Option key={sub._id} value={sub._id}>
                    {sub.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="shortDescription" label="Short Description" rules={[{ required: true }]}>
          <Input.TextArea rows={2} placeholder="Enter short description" />
        </Form.Item>

        <Form.Item name="longDescription" label="Long Description" rules={[{ required: true }]}>
          <Input.TextArea rows={4} placeholder="Enter detailed description" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Primary Image">
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false} // prevent auto upload
                fileList={primaryImageList}
                onChange={({ fileList }) => {
                  // Limit to one file and generate preview if new file
                  const list = fileList.slice(-1).map((file) => {
                    if (file.originFileObj) {
                      return {
                        ...file,
                        preview: URL.createObjectURL(file.originFileObj),
                      }
                    }
                    return file
                  })
                  setPrimaryImageList(list)
                }}
                onRemove={() => {
                  setPrimaryImageList([])
                }}
                showUploadList={false} // hide default list to use custom preview
              >
                {primaryImageList.length === 0 ? (
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                ) : (
                  <Avatar
                    src={primaryImageList[0].preview || primaryImageList[0].url}
                    size={128}
                    shape="square"
                    style={{ cursor: 'pointer' }}
                    alt="Primary"
                  />
                )}
              </Upload>
            </Form.Item>
          </Col>

          <Col span={16}>
            <Form.Item label="Gallery Images">
              <Upload.Dragger
                listType="picture"
                multiple
                beforeUpload={() => false}
                fileList={galleryImageList}
                onChange={({ fileList }) => {
                  // Generate preview for new files
                  const list = fileList.map((file) => {
                    if (file.originFileObj && !file.preview) {
                      return {
                        ...file,
                        preview: URL.createObjectURL(file.originFileObj),
                      }
                    }
                    return file
                  })
                  setGalleryImageList(list)
                }}
                onRemove={(file) => {
                  setGalleryImageList((list) => list.filter((item) => item.uid !== file.uid))
                }}
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">Click or drag files to this area to upload</p>
                <p className="ant-upload-hint">Support for multiple files upload.</p>
              </Upload.Dragger>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="isSubscribable"
          valuePropName="checked"
          label="Subscribe"
          rules={[{ required: false }]}
        >
          <Checkbox>Is this product subscribable?</Checkbox>
        </Form.Item>

        <Form.Item
          name="isRecommended"
          valuePropName="checked"
          label="Recommended"
          rules={[{ required: false }]}
        >
          <Checkbox>Is this product recommended?</Checkbox>
        </Form.Item>

        <Form.Item
          name="isFeatured"
          valuePropName="checked"
          label="Featured"
          rules={[{ required: false }]}
        >
          <Checkbox>Is this product featured?</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditFoodProductModal
