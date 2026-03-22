import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const LoginModal = ({ onClose, defaultType = 'farmer' }) => {
    const navigate = useNavigate();
    const [userType, setUserType] = useState(defaultType);
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!/^\d{10}$/.test(phone)) {
            setError('Please enter a valid 10 digit phone number');
            return;
        }
        setLoading(true);
        setError('');
        try {
            if (userType === 'farmer') {
                const res = await axios.get(`${BASE_URL}/farmer/`);
                console.log('All farmers:', res.data);
                console.log('Looking for phone:', phone);
                const farmer = res.data.find(f => String(f.phone).trim() === String(phone).trim());
                console.log('Found farmer:', farmer);
                if (!farmer) {
                    setError('No farmer account found with this phone number');
                    return;
                }
                onClose();
                navigate(`/farmer/dashboard/${farmer.id}`);
            } else {
                const res = await axios.get(`${BASE_URL}/buyer/all`);
                console.log('All buyers:', res.data);
                console.log('Looking for phone:', phone);
                const buyer = res.data.find(b => String(b.phone).trim() === String(phone).trim());
                console.log('Found buyer:', buyer);
                if (!buyer) {
                    setError('No buyer account found with this phone number');
                    return;
                }
                onClose();
                navigate(`/buyer/dashboard/${buyer.id}`);
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Welcome Back</h2>
                        <p className="text-sm text-gray-500">Login with your phone number</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
                    >
                        x
                    </button>
                </div>

                {/* User Type Toggle */}
                <div className="flex gap-2 mb-5">
                    <button
                        type="button"
                        onClick={() => { setUserType('farmer'); setError(''); }}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${userType === 'farmer'
                                ? 'border-primary-600 bg-primary-50 text-primary-700'
                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                    >
                        Farmer
                    </button>
                    <button
                        type="button"
                        onClick={() => { setUserType('buyer'); setError(''); }}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${userType === 'buyer'
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                    >
                        Buyer
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={e => { setPhone(e.target.value); setError(''); }}
                            placeholder="Enter your 10 digit phone number"
                            className="input-field"
                            maxLength={10}
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full font-semibold py-3 px-6 rounded-lg transition-all ${userType === 'farmer'
                                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {loading ? 'Finding your account...' : 'Login'}
                    </button>
                </form>

                {/* Register Links */}
                <div className="mt-4 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <span
                        className="text-primary-600 font-semibold cursor-pointer hover:underline"
                        onClick={() => {
                            onClose();
                            navigate(userType === 'farmer' ? '/farmer/register' : '/buyer/register');
                        }}
                    >
                        Register here
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;