import { Col, Row, Spin, message } from 'antd'
import React, { useEffect, useState } from 'react'
import StaticsData from './components/StaticsData'
import SalesChart from './components/SalesChart'
import EarningsChart from './components/EarningsChart'
import AverageOrderChart from './components/AverageOrderChart'
import { getDashboard } from '../../../services/admin/apiDashboard'
import OrderListener from '../../../components/orderListeners'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard()
      setData(res)
    } catch {
      message.error('Error fetching dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // if (loading) return <Spin size='large' fullscreen />

  return (
    <div className="p-4">
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={24} lg={24}>
          {data ? <StaticsData data={data.countData} loading={loading} /> : <Spin size="large" />}
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <SalesChart />
        </Col>
        <Col xs={24} lg={12}>
          <EarningsChart />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={24}>
          <AverageOrderChart />
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
