import React, { useEffect, useState } from 'react';
import Header from '../../../components/web/Header';
import { getAllCms, getAllSettings } from '../../../services/apiSettings';
import Footer from '../../../components/web/Footer';
import { useParams } from 'react-router';
import { message } from 'antd';

function Cms() {
    const [settingData, setSettingData] = useState({});
    const [loading, setLoading] = useState(true);

    const { type, page } = useParams();

    const [pageContent, setPageContent] = useState('');
    const [pageName, setPageName] = useState('');

    const fetchSetting = async () => {
        try {
            const settingsRes = await getAllSettings();
            const cmsRes = await getAllCms();

            const cmsList = cmsRes.cmsData;
            setSettingData(settingsRes.data.settings[0]);

            // Find data by type
            const selectedTypeData = cmsList.find(item => item.type === type);

            if (!selectedTypeData) {
                message.error("Invalid CMS type");
                setPageContent("No data found.");
                return;
            }

            // Set page content based on page param
            switch (page) {
                case 'term':
                    setPageName("Terms and Conditions");
                    setPageContent(selectedTypeData.termAndConditions);
                    break;
                case 'privacy':
                    setPageName("Privacy Policy");
                    setPageContent(selectedTypeData.privacyPolicy);
                    break;
                case 'refund':
                    setPageName("Return & Refund Policy");
                    setPageContent(selectedTypeData.refundPolicy || "No refund policy defined.");
                    break;
                default:
                    setPageName("CMS Page");
                    setPageContent("Invalid page requested.");
                    break;
            }

        } catch (error) {
            console.error(error);
            message.error("Failed to load CMS or settings data.");
            setPageContent("Error loading content.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSetting();
    }, [type, page]);

    return (
        <>
            <title>GoRabit</title>
            <Header data={settingData} loading={loading} />
            <div className='p-2 m-2 min-h-[50vh]'>
                <h1 className='text-3xl my-2'>{pageName}</h1>
                <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: pageContent }}
                />
            </div>
            <Footer data={settingData} />
        </>
    );
}

export default Cms;
