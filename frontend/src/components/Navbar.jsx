import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import LanguageSwitcher from './LanguageSwitcher';
import LoginModal from './LoginModal';

const Navbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [defaultUserType, setDefaultUserType] = useState('farmer');

    // Detect current page type
    const isFarmerPage = location.pathname.includes('/farmer');
    const isBuyerPage = location.pathname.includes('/buyer');
    const isOnDashboard = isFarmerPage || isBuyerPage;

    const handleSwitchClick = (type) => {
        setDefaultUserType(type);
        setShowLogin(true);
    };

    return (
        <>
            <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">

                        {/* Logo */}
                        <div
                            className="flex items-center gap-2 cursor-pointer"
                            onClick={() => navigate('/')}
                        >
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">F2F</span>
                            </div>
                            <span className="font-bold text-lg text-gray-800">
                                Field <span className="text-primary-600">to</span> Factory
                            </span>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-3">
                            <LanguageSwitcher />

                            {/* Show switch button when on a dashboard */}
                            {isOnDashboard ? (
                                <>
                                    {isFarmerPage && (
                                        <button
                                            onClick={() => handleSwitchClick('buyer')}
                                            className="text-sm font-semibold text-blue-600 border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-all"
                                        >
                                            Switch to Buyer
                                        </button>
                                    )}
                                    {isBuyerPage && (
                                        <button
                                            onClick={() => handleSwitchClick('farmer')}
                                            className="text-sm font-semibold text-primary-600 border-2 border-primary-200 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-all"
                                        >
                                            Switch to Farmer
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => handleSwitchClick('farmer')}
                                        className="text-sm font-semibold text-gray-600 hover:text-primary-600 px-3 py-2 rounded-lg hover:bg-primary-50 transition-all"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => navigate('/farmer/register')}
                                        className="btn-secondary text-sm py-2 px-4"
                                    >
                                        {t('nav.farmer')}
                                    </button>
                                    <button
                                        onClick={() => navigate('/buyer/register')}
                                        className="btn-primary text-sm py-2 px-4"
                                    >
                                        {t('nav.buyer')}
                                    </button>
                                </>
                            )}

                            <button
                                onClick={() => navigate('/admin')}
                                className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 py-1 rounded border border-gray-200 hover:border-gray-300 transition-all"
                            >
                                Admin
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="md:hidden p-2 rounded-lg text-gray-600"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? 'X' : 'Menu'}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {menuOpen && (
                        <div className="md:hidden pb-4 flex flex-col gap-3">
                            <LanguageSwitcher />
                            {isOnDashboard ? (
                                <>
                                    {isFarmerPage && (
                                        <button
                                            onClick={() => { handleSwitchClick('buyer'); setMenuOpen(false); }}
                                            className="text-sm font-semibold text-blue-600 border border-blue-200 py-2 rounded-lg"
                                        >
                                            Switch to Buyer
                                        </button>
                                    )}
                                    {isBuyerPage && (
                                        <button
                                            onClick={() => { handleSwitchClick('farmer'); setMenuOpen(false); }}
                                            className="text-sm font-semibold text-primary-600 border border-primary-200 py-2 rounded-lg"
                                        >
                                            Switch to Farmer
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => { handleSwitchClick('farmer'); setMenuOpen(false); }}
                                        className="text-sm font-semibold text-gray-600 py-2 border border-gray-200 rounded-lg"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => { navigate('/farmer/register'); setMenuOpen(false); }}
                                        className="btn-secondary text-sm"
                                    >
                                        {t('nav.farmer')}
                                    </button>
                                    <button
                                        onClick={() => { navigate('/buyer/register'); setMenuOpen(false); }}
                                        className="btn-primary text-sm"
                                    >
                                        {t('nav.buyer')}
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => { navigate('/admin'); setMenuOpen(false); }}
                                className="text-xs text-gray-400 py-2"
                            >
                                Admin Panel
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Login Modal */}
            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    defaultType={defaultUserType}
                />
            )}
        </>
    );
};

export default Navbar;