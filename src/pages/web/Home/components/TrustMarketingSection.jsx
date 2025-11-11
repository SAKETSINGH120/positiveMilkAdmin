import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaStore, FaTruckMoving, FaUserShield } from 'react-icons/fa';

// Mock data for partners' logos
const partnersLogos = [
    { name: 'Partner 1', logo: 'https://logowik.com/content/uploads/images/burger-king-new-20218389.jpg' },
    { name: 'Partner 2', logo: 'https://logowik.com/content/uploads/images/pizza-pedricos5887.logowik.com.webp' },
    { name: 'Partner 3', logo: 'https://logowik.com/content/uploads/images/big-boy-restaurants3119.jpg' },
    { name: 'Partner 4', logo: 'https://logowik.com/content/uploads/images/franks-pizza-italian-restaurant5058.logowik.com.webp' },
    { name: 'Partner 5', logo: 'https://logowik.com/content/uploads/images/dominos-pizza1251.logowik.com.webp' },
];

// Mock data for driver information
const driversInfo = [
    { id: 1, name: 'Rohan', experience: '5 years', rating: 4.9, image: 'https://randomuser.me/api/portraits/men/75.jpg' },
    { id: 2, name: 'Ajay', experience: '3 years', rating: 4.8, image: 'https://randomuser.me/api/portraits/men/76.jpg' },
    { id: 3, name: 'Satish', experience: '7 years', rating: 4.95, image: 'https://randomuser.me/api/portraits/men/77.jpg' },
    { id: 4, name: 'Abdul', experience: '2 years', rating: 4.7, image: 'https://randomuser.me/api/portraits/men/78.jpg' },
];

const TrustMarketingSection = () => {
    const [customerCount, setCustomerCount] = useState(0);
    const [vendorCount, setVendorCount] = useState(0);
    const [driverCount, setDriverCount] = useState(0);

    useEffect(() => {
        // Simulate fetching data from an API
        const fetchCounts = () => {
            // Mock data - replace with actual data fetching logic
            setCustomerCount(15000);
            setVendorCount(500);
            setDriverCount(300);
        };

        fetchCounts();
    }, []);

    return (
        <section className="relative py-20 bg-gradient-to-b from-green-900 to-green-950 overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-green-600 rounded-full blur-3xl opacity-20"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-300 to-white bg-clip-text text-transparent mb-4">
                        Trusted by Thousands
                    </h2>
                    <p className="text-xl text-green-200 max-w-2xl mx-auto">
                        Join our growing community of satisfied customers, vendors, and partners.
                    </p>
                </motion.div>

                {/* Counters Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="bg-green-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-700/30 shadow-xl"
                    >
                        <div className="flex justify-center mb-4">
                            <FaUsers className="text-4xl text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-green-100 mb-2">{customerCount.toLocaleString()}</h3>
                        <p className="text-green-300">Happy Customers</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-green-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-700/30 shadow-xl"
                    >
                        <div className="flex justify-center mb-4">
                            <FaStore className="text-4xl text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-green-100 mb-2">{vendorCount.toLocaleString()}+</h3>
                        <p className="text-green-300">Trusted Vendors</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="bg-green-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-700/30 shadow-xl"
                    >
                        <div className="flex justify-center mb-4">
                            <FaTruckMoving className="text-4xl text-green-400" />
                        </div>
                        <h3 className="text-3xl font-bold text-green-100 mb-2">{driverCount.toLocaleString()}+</h3>
                        <p className="text-green-300">Dedicated Drivers</p>
                    </motion.div>
                </div>

                {/* Partners Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-green-300 to-white bg-clip-text text-transparent">
                        Our Trusted Partners
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-8 justify-items-center">
                        {partnersLogos.map((partner, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center justify-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
                            >
                                <img src={partner.logo} alt={partner.name} className="max-h-16 object-contain" />
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Drivers Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h3 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-green-300 to-white bg-clip-text text-transparent">
                        Meet Our Drivers
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {driversInfo.map((driver) => (
                            <motion.div
                                key={driver.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ y: -10 }}
                                className="group relative bg-green-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-700/30 hover:border-green-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl text-center"
                            >
                                <div className="flex justify-center mb-4">
                                    <img src={driver.image} alt={driver.name} className="w-24 h-24 rounded-full object-cover mx-auto" />
                                </div>
                                <h4 className="text-xl font-semibold text-green-100 mb-1">{driver.name}</h4>
                                <p className="text-green-300 mb-2">Experience: {driver.experience}</p>
                                <div className="flex justify-center">
                                    {[...Array(5)].map((_, i) => (
                                        <FaUserShield
                                            key={i}
                                            className={`text-yellow-400 ${i < Math.floor(driver.rating) ? 'fill-current' : 'text-gray-400'}`}
                                        />
                                    ))}
                                    <span className="ml-2 text-green-100">{driver.rating}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Floating decoration */}
                <motion.div
                    className="absolute bottom-1/4 right-10 opacity-20"
                    animate={{ y: [-20, 20, -20] }}
                    transition={{ duration: 8, repeat: Infinity }}
                >
                    <div className="w-32 h-32 bg-green-500 rounded-full blur-xl" />
                </motion.div>
            </div>
        </section>
    );
};

export default TrustMarketingSection;
