import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { registerFarmer } from '../api/api';

const states = [
    'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Haryana',
    'Madhya Pradesh', 'Rajasthan', 'Bihar', 'Gujarat',
    'Karnataka', 'Andhra Pradesh', 'Other'
];

const cropTypes = [
    'paddy', 'wheat', 'maize', 'cotton',
    'sugarcane', 'mustard', 'soybean', 'groundnut'
];

const FarmerRegister = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: '', phone: '', aadhaar: '',
        village: '', state: '', crop_type: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const validate = () => {
        if (form.name.trim().length < 3) {
            setError('Name must be at least 3 characters'); return false;
        }
        if (!/^\d{10}$/.test(form.phone)) {
            setError('Phone must be exactly 10 digits'); return false;
        }
        if (!/^\d{12}$/.test(form.aadhaar)) {
            setError('Aadhaar must be exactly 12 digits'); return false;
        }
        if (form.village.trim().length < 2) {
            setError('Please enter a valid village name'); return false;
        }
        if (!form.state) {
            setError('Please select a state'); return false;
        }
        if (!form.crop_type) {
            setError('Please select a crop type'); return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setError('');
        try {
            const res = await registerFarmer(form);
            navigate(`/farmer/dashboard/${res.data.id}`);
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white py-12 px-4">
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🌾</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {t('farmer.register_title')}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Join thousands of farmers earning from crop residue
                    </p>
                </div>

                {/* Form Card */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('farmer.name')} *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="input-field"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('farmer.phone')} *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="10 digit mobile number"
                                className="input-field"
                                maxLength={10}
                                required
                            />
                        </div>

                        {/* Aadhaar */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('farmer.aadhaar')} *
                            </label>
                            <input
                                type="text"
                                name="aadhaar"
                                value={form.aadhaar}
                                onChange={handleChange}
                                placeholder="12 digit Aadhaar number"
                                className="input-field"
                                maxLength={12}
                                required
                            />
                        </div>

                        {/* Village */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('farmer.village')} *
                            </label>
                            <input
                                type="text"
                                name="village"
                                value={form.village}
                                onChange={handleChange}
                                placeholder="Village or town name"
                                className="input-field"
                                required
                            />
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('farmer.state')} *
                            </label>
                            <select
                                name="state"
                                value={form.state}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="">Select your state</option>
                                {states.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Crop Type */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('farmer.crop_type')} *
                            </label>
                            <select
                                name="crop_type"
                                value={form.crop_type}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="">Select primary crop</option>
                                {cropTypes.map(c => (
                                    <option key={c} value={c} className="capitalize">{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full text-center mt-2"
                        >
                            {loading ? 'Registering...' : t('farmer.submit')}
                        </button>

                    </form>
                </div>

                {/* Already registered */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Already registered?{' '}
                    <span
                        className="text-primary-600 font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate('/')}
                    >
                        Go to Home
                    </span>
                </p>

            </div>
        </div>
    );
};

export default FarmerRegister;