import { Input, Tabs } from 'antd'
import React, { useState } from 'react'
import OrderTable from './components/OrderTable'
import { useParams } from 'react-router'

const { TabPane } = Tabs

function Order() {
  const [searchText, setSearchText] = useState('')
  const [orderType, setOrderType] = useState('accepted') // default tab
  const [counts, setCounts] = useState({})

  const { type } = useParams()

  console.log('type', type)

  const handleCountsUpdate = (newCounts) => {
    setCounts(newCounts)
  }

  return (
    <>
      <div className="lg:px-10 px-5 my-8">
        <div className="md:flex items-center gap-4 justify-between">
          <Input.Search
            placeholder="Search by name"
            onChange={(e) => setSearchText(e.target.value)}
            style={{
              maxWidth: 300,
              borderRadius: '6px',
            }}
            size="large"
          />
        </div>

        <Tabs defaultActiveKey="accepted" onChange={(key) => setOrderType(key)} className="mt-6">
          <TabPane tab={`Accepted (${counts.accepted || 0})`} key="accepted" />
          <TabPane tab={`Pending (${counts?.new || 0})`} key="pending" />
          <TabPane tab={`Assigned (${counts.shipped || 0})`} key="shipped" />
          {/* <TabPane tab={`PickedUp (${counts.pickedup || 0})`} key="picked up" /> */}
          <TabPane tab={`Running (${counts.running || 0})`} key="running" />
          <TabPane tab={`Delivered (${counts.delivered || 0})`} key="delivered" />
          <TabPane tab={`Cancelled (${counts.cancelled || 0})`} key="cancelled" />
          <TabPane tab={`All (${counts.all || 0})`} key="all" />
        </Tabs>
      </div>

      <OrderTable
        searchText={searchText}
        type={orderType}
        onCountsUpdate={handleCountsUpdate}
        service={type}
      />
    </>
  )
}

export default Order
