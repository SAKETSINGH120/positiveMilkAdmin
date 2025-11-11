import React from 'react';
import { motion } from 'framer-motion';
import { FaShoppingBasket, FaTruck, FaShieldAlt, FaMapMarkedAlt, FaTags, FaHeadset, FaGift, FaLeaf } from 'react-icons/fa';

const benefitsCust = [
    { text: 'Wide Variety of Products', icon: <FaShoppingBasket className="text-xl" />, color: 'from-purple-400 to-purple-600' },
    { text: 'Fast Home Delivery', icon: <FaTruck className="text-xl" />, color: 'from-green-400 to-green-600' },
    { text: 'Secure Payments', icon: <FaShieldAlt className="text-xl" />, color: 'from-blue-400 to-blue-600' },
    { text: 'Real-Time Order Tracking', icon: <FaMapMarkedAlt className="text-xl" />, color: 'from-red-400 to-red-600' },
    { text: 'Exclusive Deals and Discounts', icon: <FaTags className="text-xl" />, color: 'from-yellow-400 to-yellow-600' },
    { text: '24/7 Customer Support', icon: <FaHeadset className="text-xl" />, color: 'from-pink-400 to-pink-600' },
    { text: 'Loyalty Rewards Program', icon: <FaGift className="text-xl" />, color: 'from-indigo-400 to-indigo-600' },
    { text: 'Fresh and Organic Products', icon: <FaLeaf className="text-xl" />, color: 'from-teal-400 to-teal-600' },
];

function CustomerBenefits() {
    return (
        <section className="relative py-20 bg-gradient-to-b from-green-900 to-green-950 overflow-hidden" id="customer-benefits">
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
                        Why Customers Love Us
                    </h2>
                    <p className="text-xl text-green-200 max-w-2xl mx-auto">
                        Discover the benefits that make our customers happy and satisfied
                    </p>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {benefitsCust.map((benefit, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            whileHover={{ y: -10 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl blur-xl -z-10" />
                            <div className="h-full bg-green-800/30 backdrop-blur-sm rounded-xl p-6 border border-green-700/30 hover:border-green-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
                                <motion.div
                                    className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${benefit.color} text-white`}
                                    whileHover={{ rotate: 15, scale: 1.1 }}
                                    transition={{ type: 'spring' }}
                                >
                                    <div className="text-3xl">
                                        {benefit.icon}
                                    </div>
                                </motion.div>
                                <h3 className="text-xl font-semibold text-green-100 mb-2 text-center">{benefit.text}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
                {/* Floating decoration */}
                <motion.div
                    className="absolute top-1/4 left-10 opacity-20"
                    animate={{ y: [-20, 20, -20] }}
                    transition={{ duration: 8, repeat: Infinity }}
                >
                    <div className="w-32 h-32 bg-green-500 rounded-full blur-xl" />
                </motion.div>
            </div>
        </section>
    );
}

export default CustomerBenefits;
