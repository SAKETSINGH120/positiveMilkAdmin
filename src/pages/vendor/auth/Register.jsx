// import React, { useEffect, useState } from 'react';
// import { Button, Form, Spin, Steps, message } from 'antd';
// import Vendor from './components/Vendor';
// import Account from './components/Account';
// import Document from './components/Document';
// import Agreement from './components/Agreement';
// import { registerVendor } from '../../../services/vendor/apiAuth';
// import { getFee, getTermAndServices } from '../../../services/vendor/apiCms';
// import { Link } from 'react-router';

// const { Step } = Steps;

// const Register = () => {
//     const [current, setCurrent] = useState(0);
//     const [form] = Form.useForm();
//     const [termCondition, setTermCondition] = useState();
//     const [fee, setFee] = useState();
//     const [loading, setLoading] = useState(false)

//     useEffect(() => {
//         const fetchTermAndFee = async () => {
//             setLoading(true)
//             try {
//                 const res = await getTermAndServices();
//                 const fee = await getFee();
//                 setTermCondition(res.data)
//                 setFee(fee.data)
//             } catch (error) {
//                 message.error("Something is wrong")
//             } finally {
//                 setLoading(false)
//             }
//         }
//         fetchTermAndFee()
//     }, [])

//     const next = () => {
//         form.validateFields()
//             .then(() => setCurrent(current + 1))
//             .catch((errorInfo) => console.log('Validation Failed:', errorInfo));
//     };

//     const prev = () => setCurrent(current - 1);

//     const handleSubmit = async () => {
//         try {
//             const allValues = form.getFieldsValue(true);
//             const getFile = (fileList) => fileList?.[0]?.originFileObj;

//             const formData = new FormData();
//             formData.append("name", allValues.name);
//             formData.append("userId", allValues.userId);
//             formData.append("password", allValues.password);
//             formData.append("mobile", allValues.mobile);
//             formData.append("alternateMobile", allValues.alternateMobile || '');
//             formData.append("email", allValues.email || '');

//             if (allValues.profileImg) formData.append("profileImg", getFile(allValues.profileImg));
//             formData.append("panNo", allValues.panNo);
//             formData.append("gstNo", allValues.gstNo || '');
//             formData.append("foodLicense", allValues.foodLicense || '');
//             formData.append("panImage", getFile(allValues.panImage));
//             if (allValues.gstImage) formData.append("gstImage", getFile(allValues.gstImage));
//             if (allValues.foodImage) formData.append("foodImage", getFile(allValues.foodImage));

//             formData.append("ifsc", allValues.ifsc);
//             formData.append("bankName", allValues.bankName);
//             formData.append("benificiaryName", allValues.benificiaryName);
//             formData.append("branchName", allValues.branchName);
//             formData.append("accountNo", allValues.accountNo);
//             formData.append("passbook", getFile(allValues.passbook));
//             formData.append("agreement", allValues.agreement);

//             const response = await registerVendor(formData);
//             message.success(response.message || "Vendor registered successfully!");
//             form.resetFields();
//             setCurrent(0);
//         } catch (err) {
//             console.error("Registration failed:", err);
//             message.error(err.response?.data?.message || "Something went wrong!");
//         }
//     };

//     const steps = [
//         { title: 'Vendor Details', content: <Vendor form={form} /> },
//         { title: 'Account Info', content: <Account form={form} /> },
//         { title: 'Documents', content: <Document form={form} /> },
//         { title: 'Agreement', content: <Agreement termCondition={termCondition} fee={fee} /> },
//     ];

//     if (loading) return <Spin size="large" fullscreen />

//     return (
//         <>
//             <title>GoRabit | Vendor Registration</title>
//             <div className="flex min-h-screen bg-gray-100">
//                 {/* Left Side Image */}
//                 <div className="hidden lg:flex w-1/2 justify-center items-center bg-white">
//                     <img
//                         src="https://cdn.pixabay.com/photo/2021/05/27/18/55/woman-6289052_1280.png"
//                         alt="Register Visual"
//                         className="object-cover w-full h-full"
//                         loading='lazy'
//                     />
//                 </div>

//                 {/* Right Side Form */}
//                 <div className="flex w-full lg:w-1/2 justify-center items-center px-4 sm:px-6 py-4">
//                     <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-2 sm:p-10">
//                         <h2 className="text-3xl font-bold text-center text-green-600 mb-2">Vendor Registration</h2>
//                         <p className="text-sm text-gray-500 text-center mb-8">GoRabit Business partner!</p>
//                         {/* <p className="text-sm text-gray-500 text-center mb-8">Become a seller with GoRabit!</p> */}

//                         <Steps
//                             current={current}
//                             size="small"
//                             responsive
//                             className="mb-10 px-2 sm:px-8" style={{ marginBottom: "10px" }}
//                         >
//                             {steps.map(item => (
//                                 <Step key={item.title} title={item.title} />
//                             ))}
//                         </Steps>

//                         <Form
//                             form={form}
//                             layout="vertical"
//                             onFinish={handleSubmit}
//                         >
//                             {steps[current].content}

//                             <div className="mt-8 flex flex-wrap justify-between gap-4">
//                                 {current > 0 && (
//                                     <Button onClick={prev} size="large">
//                                         Previous
//                                     </Button>
//                                 )}
//                                 {current < steps.length - 1 && (
//                                     <Button type="primary" onClick={next} size="large">
//                                         Next
//                                     </Button>
//                                 )}
//                                 {current === steps.length - 1 && (
//                                     <Button type="primary" htmlType="submit" size="large">
//                                         Register
//                                     </Button>
//                                 )}
//                             </div>
//                         </Form>
//                         <p className="text-sm text-gray-500 mb-8 my-4">Already registred <Link to={'/vendor/login'} className='text-blue-500'>Login</Link>!</p>
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default Register;



import React, { useEffect, useState } from 'react';
import { Button, Form, Spin, Steps, message } from 'antd';
import Vendor from './components/Vendor';
import Account from './components/Account';
import Document from './components/Document';
import Agreement from './components/Agreement';
import { registerVendor } from '../../../services/vendor/apiAuth';
import { getFee, getTermAndServices } from '../../../services/vendor/apiCms';
import { Link } from 'react-router';

const { Step } = Steps;

const Register = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();
    const [termCondition, setTermCondition] = useState();
    const [fee, setFee] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchTermAndFee = async () => {
            setLoading(true);
            try {
                const res = await getTermAndServices();
                const fee = await getFee();
                setTermCondition(res.data);
                setFee(fee.data);
            } catch (error) {
                message.error("Something is wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchTermAndFee();
    }, []);

    const next = () => {
        form.validateFields()
            .then(() => setCurrent(current + 1))
            .catch((errorInfo) => console.log('Validation Failed:', errorInfo));
    };

    const prev = () => setCurrent(current - 1);

    const handleSubmit = async () => {
        try {
            const allValues = form.getFieldsValue(true);
            const getFile = (fileList) => fileList?.[0]?.originFileObj;

            const formData = new FormData();
            formData.append("name", allValues.name);
            formData.append("userId", allValues.userId);
            formData.append("password", allValues.password);
            formData.append("mobile", allValues.mobile);
            formData.append("alternateMobile", allValues.alternateMobile || '');
            formData.append("email", allValues.email || '');

            if (allValues.profileImg) formData.append("profileImg", getFile(allValues.profileImg));
            formData.append("panNo", allValues.panNo);
            formData.append("gstNo", allValues.gstNo || '');
            formData.append("foodLicense", allValues.foodLicense || '');
            formData.append("panImage", getFile(allValues.panImage));
            if (allValues.gstImage) formData.append("gstImage", getFile(allValues.gstImage));
            if (allValues.foodImage) formData.append("foodImage", getFile(allValues.foodImage));

            formData.append("ifsc", allValues.ifsc);
            formData.append("bankName", allValues.bankName);
            formData.append("benificiaryName", allValues.benificiaryName);
            formData.append("branchName", allValues.branchName);
            formData.append("accountNo", allValues.accountNo);
            formData.append("passbook", getFile(allValues.passbook));
            formData.append("agreement", allValues.agreement);

            const response = await registerVendor(formData);
            message.success(response.message || "Vendor registered successfully!");
            form.resetFields();
            setCurrent(0);
        } catch (err) {
            console.error("Registration failed:", err);
            message.error(err.response?.data?.message || "Something went wrong!");
        }
    };

    const steps = [
        { title: 'Vendor Details', content: <Vendor form={form} /> },
        { title: 'Account Info', content: <Account form={form} /> },
        { title: 'Documents', content: <Document form={form} /> },
        { title: 'Agreement', content: <Agreement termCondition={termCondition} fee={fee} /> },
    ];

    if (loading) return <Spin size="large" fullscreen />

    return (
        <>
            <title>GoRabit | Vendor Registration</title>
            <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
                {/* Left Side Illustration */}
                <div className="hidden lg:flex w-full lg:w-1/2 justify-center items-center p-8 bg-white">
                    <img
                        src="/go-rabit-logo.png"
                        alt="Register Visual"
                        className="max-w-md h-auto object-contain"
                        loading="lazy"
                    />
                </div>

                {/* Right Side Form */}
                <div className="w-full lg:w-1/2 flex justify-center items-center p-4 sm:p-10">
                    <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-4 sm:p-10">
                        {/* Heading */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-green-600">Vendor Registration</h2>
                            <p className="text-gray-500 mt-2">Become a GoRabit Business Partner</p>
                        </div>

                        {/* Stepper */}
                        <Steps
                            current={current}
                            size="small"
                            responsive
                            className="mb-10 px-4 sm:px-8"
                        >
                            {steps.map((item) => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>

                        {/* Form Content */}
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            {steps[current].content}

                            <div className="mt-10 flex flex-wrap justify-between gap-4">
                                {current > 0 && (
                                    <Button onClick={prev} size="large">
                                        Previous
                                    </Button>
                                )}
                                {current < steps.length - 1 && (
                                    <Button type="primary" onClick={next} size="large">
                                        Next
                                    </Button>
                                )}
                                {current === steps.length - 1 && (
                                    <Button type="primary" htmlType="submit" size="large">
                                        Register
                                    </Button>
                                )}
                            </div>
                        </Form>

                        {/* Login Link */}
                        <div className="text-center mt-6 text-sm">
                            Already registered?{' '}
                            <Link to="/vendor/login" className="text-blue-500 font-medium">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;

