import React, { useState, useEffect } from 'react';
import { Tabs, Form, message, Spin } from 'antd';
import { getVendorProfile, updateAccountInfo, updateDocumentInfo, updateProfileInfo } from '../../../services/vendor/apiAuth';
import { useWatch } from 'antd/es/form/Form';

import ProfileInfo from './components/ProfileInfo';
import AccountInfo from './components/AccountInfo';
import DocumentInfo from './components/DocumentInfo';
import ChangePassword from './components/ChangePassword';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const Profile = () => {
  const [form] = Form.useForm();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const ifsc = useWatch('ifsc', form);

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const res = await getVendorProfile();
        const vendorData = res.data.vendor;
        setVendor(vendorData);
        form.setFieldsValue({
          name: vendorData.name || '',
          userId: vendorData.userId || '',
          mobile: vendorData.mobile || '',
          alternateMobile: vendorData.alternateMobile || '',
          email: vendorData.email || '',
          panNo: vendorData.panNo || '',
          gstNo: vendorData.gstNo || '',
          foodLicense: vendorData.foodLicense || '',
          ifsc: vendorData.ifsc === 'undefined' ? '' : vendorData.ifsc,
          bankName: vendorData.bankName === 'undefined' ? '' : vendorData.bankName,
          branchName: vendorData.branchName === 'undefined' ? '' : vendorData.branchName,
          accountNo: vendorData.accountNo === 'undefined' ? '' : vendorData.accountNo,
          commission: vendorData.commission ?? '',
        });
      } catch (err) {
        message.error('Failed to load vendor profile');
      } finally {
        setLoading(false);
      }
    };

    fetchVendor();
  }, [form]);

  useEffect(() => {
    const fetchIFSCDetails = async () => {
      if (ifsc && /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
        try {
          const res = await fetch(`https://ifsc.razorpay.com/${ifsc}`);
          const data = await res.json();
          if (data.BANK && data.BRANCH) {
            form.setFieldsValue({
              bankName: data.BANK,
              branchName: data.BRANCH,
            });
          } else {
            throw new Error();
          }
        } catch {
          message.error('Invalid IFSC code');
          form.setFieldsValue({ bankName: '', branchName: '' });
        }
      }
    };

    fetchIFSCDetails();
  }, [ifsc, form]);

  const updateProfile = async (values) => {
    setUpdateLoading(true)
    try {
      const res = await updateProfileInfo(values);
      message.success(res.message);
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setUpdateLoading(false)
    }
  };

  const updateBankAccountDetails = async (values) => {
    setUpdateLoading(true)
    try {
      const formData = new FormData();
      formData.append("bankName", values.bankName);
      formData.append("ifsc", values.ifsc);
      formData.append("branchName", values.branchName);
      formData.append("accountNo", values.accountNo);
      formData.append("benificiaryName", values.benificiaryName);

      // Append passbook file if uploaded
      // if (values.passbook && values.passbook.fileList) {
      //   formData.append("passbook", values.passbook.fileList[0].originFileObj);
      //   console.log(values.passbook.fileList[0].originFileObj)
      // }
      if (values.passbook?.length) {
        formData.append("passbook", values.passbook[0].originFileObj);
      }

      const res = await updateAccountInfo(formData);
      // console.log(res)
      message.success(res.message);
    } catch (error) {
      // console.log(error.message)
      message.error('Failed to update bank details');
    } finally {
      setUpdateLoading(false)
    }
  };

  const updateDocument = async (values) => {
    setUpdateLoading(true)
    try {
      const formData = new FormData();
      formData.append("panNo", values.panNo);
      formData.append("gstNo", values.gstNo);
      formData.append("foodLicense", values.foodLicense);
      if (values.panImage?.length) {
        formData.append("panImage", values.panImage[0].originFileObj);
      }
      if (values.gstImage?.length) {
        formData.append("gstImage", values.gstImage[0].originFileObj);
      }
      if (values.foodImage?.length) {
        formData.append("foodImage", values.foodImage[0].originFileObj);
      }
      const res = await updateDocumentInfo(formData);
      // console.log(res)
      message.success(res.message);
    } catch (error) {
      message.error('Failed to update document');
    } finally {
      setUpdateLoading(false)
    }
  }

  const tabItems = [
    { label: 'Profile Info', key: '1', children: <ProfileInfo vendor={vendor} form={form} updateProfile={updateProfile} BASE_URL={BASE_URL} loading={updateLoading} /> },
    { label: 'Account Details', key: '2', children: <AccountInfo vendor={vendor} form={form} updateBankAccountDetails={updateBankAccountDetails} BASE_URL={BASE_URL} loading={updateLoading} /> },
    { label: 'Documents', key: '3', children: <DocumentInfo vendor={vendor} form={form} updateDocument={updateDocument} BASE_URL={BASE_URL} loading={updateLoading} /> },
    { label: 'Change Password', key: '4', children: <ChangePassword vendor={vendor} form={form} updateDocument={updateDocument} BASE_URL={BASE_URL} loading={updateLoading} /> },
  ]

  if (loading) return <Spin size="large" fullscreen />;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <Tabs defaultActiveKey="1" items={tabItems} />
      </div>
    </div>
  );
};

export default Profile;
