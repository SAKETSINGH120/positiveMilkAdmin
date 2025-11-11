import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router';
import { FiChevronDown, FiUser, FiFilePlus } from 'react-icons/fi';
import { Spin } from 'antd';

const BASE_URL = import.meta.env.VITE_BASE_URL;

function Header({ data, loading }) {
    const [isOpen, setIsOpen] = useState(false);
    const [vendorDropdownOpen, setVendorDropdownOpen] = useState(false);
    const location = useLocation();

    const menu = [
        { label: 'Home', href: '/' },
        { label: 'Features', href: '#features' },
        {
            label: 'Vendors',
            submenu: [
                { label: 'Login', href: '/vendor/login', icon: <FiUser /> },
                { label: 'Registration', href: '/vendor/register', icon: <FiFilePlus /> }
            ]
        },
        { label: 'Customers', href: '#customer-benefits' },
        { label: 'Contact', href: '#download' },
    ];

    useEffect(() => {
        if (location.hash) {
            const id = location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [location]);

    const handleClick = (e, href) => {
        if (href === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (href.startsWith('#')) {
            e.preventDefault();
            const id = href.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
            <motion.div
                className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Logo */}
                <div className="flex items-center gap-2 group">
                    {loading ? <Spin size="small" /> : <img src={`${BASE_URL}/${data.logo}`} alt="logo" height={60} width={60} className="rounded" loading="lazy" />}
                    <span className="text-xl font-bold text-green-600 group-hover:text-green-700 transition-colors">
                        {data.brandName}
                    </span>
                </div>

                {/* Desktop Menu */}
                <nav className="hidden md:flex items-center gap-8">
                    {menu.map((item) => (
                        <div
                            key={item.label}
                            className="relative"
                            onMouseEnter={() => item.submenu && setVendorDropdownOpen(true)}
                            onMouseLeave={() => item.submenu && setVendorDropdownOpen(false)}
                        >
                            {!item.submenu ? (
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    className="flex items-center gap-1"
                                >
                                    <Link
                                        to={item.href}
                                        onClick={(e) => handleClick(e, item.href)}
                                        className="font-medium text-gray-600 hover:text-green-600 transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </motion.div>
                            ) : (
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    className="flex items-center gap-1 cursor-pointer text-gray-600 hover:text-green-600 transition-colors"
                                >
                                    <span className="font-medium">{item.label}</span>
                                    <FiChevronDown className={`transition-transform ${vendorDropdownOpen ? 'rotate-180' : ''}`} />
                                </motion.div>
                            )}
                            {/* Vendor Dropdown */}
                            {item.submenu && (
                                <AnimatePresence>
                                    {vendorDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="absolute top-full left-0 mt-2 w-48"
                                        >
                                            <div className="bg-white rounded-lg shadow-xl p-2 border border-gray-100">
                                                {item.submenu.map((subItem) => (
                                                    <Link
                                                        key={subItem.label}
                                                        to={subItem.href}
                                                        className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-green-50 rounded-md transition-colors"
                                                    >
                                                        {subItem.icon}
                                                        <span>{subItem.label}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <motion.div
                        className="space-y-1"
                        animate={isOpen ? "open" : "closed"}
                        variants={{
                            open: { rotate: 180 },
                            closed: { rotate: 0 }
                        }}
                    >
                        <motion.span
                            className="block w-6 h-0.5 bg-gray-600"
                            variants={{
                                closed: { transform: 'translateY(0)' },
                                open: { transform: 'translateY(4px) rotate(45deg)' }
                            }}
                        />
                        <motion.span
                            className="block w-6 h-0.5 bg-gray-600"
                            variants={{
                                closed: { opacity: 1 },
                                open: { opacity: 0 }
                            }}
                        />
                        <motion.span
                            className="block w-6 h-0.5 bg-gray-600"
                            variants={{
                                closed: { transform: 'translateY(0)' },
                                open: { transform: 'translateY(-4px) rotate(-45deg)' }
                            }}
                        />
                    </motion.div>
                </button>
            </motion.div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t"
                    >
                        <ul className="px-6 py-4 space-y-4">
                            {menu.map((item) => (
                                <li key={item.label}>
                                    {item.submenu ? (
                                        <div className="space-y-2">
                                            <button
                                                className="flex items-center gap-2 w-full text-gray-600"
                                                onClick={() => setVendorDropdownOpen(!vendorDropdownOpen)}
                                            >
                                                <span>{item.label}</span>
                                                <FiChevronDown className={`transition-transform ${vendorDropdownOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                            {vendorDropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="pl-4 space-y-2"
                                                >
                                                    {item.submenu.map((subItem) => (
                                                        <Link
                                                            key={subItem.label}
                                                            to={subItem.href}
                                                            className="flex items-center gap-3 px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-md"
                                                            onClick={() => setIsOpen(false)}
                                                        >
                                                            {subItem.icon}
                                                            {subItem.label}
                                                        </Link>
                                                    ))}
                                                </motion.div>
                                            )}
                                        </div>
                                    ) : (
                                        <Link
                                            to={item.href}
                                            onClick={(e) => {
                                                handleClick(e, item.href);
                                                setIsOpen(false);
                                            }}
                                            className="block py-2 text-gray-600 hover:text-green-600 transition-colors"
                                        >
                                            {item.label}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Header;
