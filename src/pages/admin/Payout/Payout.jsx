import { Input, message, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import PayoutTable from "./components/PayoutTable";
import { getPayoutData } from "../../../services/admin/apiPayout";
import { useParams } from "react-router";

const { TabPane } = Tabs;

function Payout() {
  const [searchText, setSearchText] = useState("");
  const [dataSource, setDataSource] = useState([]);
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("daily"); // default tab

  const { type } = useParams(); // vendor or driver

  useEffect(() => {
    fetchPayoutData(type, activeTab);
  }, [type, activeTab]);

  const fetchPayoutData = async (payoutType, tabType) => {
    setLoading(true);
    try {
      // For now, using sample data. Replace with actual API call when backend is ready
      const res = await getPayoutData(payoutType, tabType);
      if (payoutType == "vendor") {
        setDataSource(res.data?.vendors || []);
      } else {
        setDataSource(res.data?.drivers || []);
      }
      setCounts(res.data?.counts || {});
    } catch (error) {
      message.error("Something went wrong in fetching payout data");
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const handlePayoutAction = async (record, action) => {
    try {
      // Handle payout actions (approve, reject, process)
      message.success(`Payout ${action} successfully`);
      fetchPayoutData(type, activeTab);
    } catch (error) {
      message.error("Something went wrong in payout action");
    }
  };

  const onSettleSuccess = async (payoutType, tabType) => {
    fetchPayoutData(payoutType, tabType);
  };

  const getTabItems = () => {
    const items = [
      {
        key: "daily",
        label: `Daily Payout (${counts.daily})`,
        children: (
          <PayoutTable
            data={dataSource}
            searchText={searchText}
            loading={loading}
            onPayoutAction={handlePayoutAction}
            payoutType={type}
            tabType="daily"
            onSettleSuccess={onSettleSuccess}
          />
        ),
      },
      {
        key: "weekly",
        label: `Weekly Payout (${counts.weekly})`, //`New Orders (${orderCounts.new || 0})`
        children: (
          <PayoutTable
            data={dataSource}
            searchText={searchText}
            loading={loading}
            onPayoutAction={handlePayoutAction}
            payoutType={type}
            tabType="weekly"
            onSettleSuccess={onSettleSuccess}
          />
        ),
      },
    ];
    return items;
  };

  return (
    <>
      <div className="lg:px-10 px-5 my-8 md:flex items-center gap-4 justify-between ">
        <Input.Search
          placeholder="Search by name"
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            maxWidth: 300,
            borderRadius: "6px",
          }}
          size="large"
        />
      </div>

      <div className="lg:px-10 px-5">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={getTabItems()}
          // className="bg-white p-4 rounded-lg shadow-sm"
        />
      </div>
    </>
  );
}

export default Payout;
