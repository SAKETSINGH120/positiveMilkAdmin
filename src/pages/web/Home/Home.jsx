import React, { useEffect, useState } from 'react';
import Header from '../../../components/web/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import CustomerBenefits from './components/CustomerBenefits';
import AppDownload from './components/AppDownload';
import Footer from '../../../components/web/Footer';
import { getAllCms, getAllSettings } from '../../../services/apiSettings';
import { message } from 'antd';
import TawkToChat from '../../../components/TawkToChat';

function Home() {
    const [settingData, setSettingData] = useState({});
    const [cmsData, setCmsData] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchSetting = async () => {
        try {
            const data = await getAllSettings();
            const res = await getAllCms();
            setSettingData(data.data.settings[0]);
            setCmsData(res.cmsData);
        } catch (error) {
            message.error("Failed to load settings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSetting();
    }, []);

    return (
        <>
            <title>GoRabit</title>
            <TawkToChat />
            <div className="font-sans text-gray-800">
                <Header data={settingData} loading={loading} />
                <Hero />
                <Features />
                <CustomerBenefits />
                <AppDownload />
                <Footer data={settingData} cmsData={cmsData} />
            </div>
        </>
    );
}

export default Home;
