import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { registerBuyer } from '../api/api';

const industryTypes = [
    'Biomass Power Plant',
    'Thermal Power Plant (Co-firing)',
    'Paper & Pulp Industry',
    'Compressed Biogas (CBG) Plant',
    'Cattle Feed Manufacturer',
    'Biochar Producer',
    'Packaging Industry',
    'Other'
];

const BuyerRegister = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        contact_name: '', phone: '',
        company_name: '', gst_number: '', industry_type: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const validate = () => {
        if (form.contact_name.trim().length < 3) {
            setError('Name must be at least 3 characters'); return false;
        }
        if (!/^\d{10}$/.test(form.phone)) {
            setError('Phone must be exactly 10 digits'); return false;
        }
        if (form.company_name.trim().length < 3) {
            setError('Company name must be at least 3 characters'); return false;
        }
        if (form.gst_number.trim().length !== 15) {
            setError('GST number must be exactly 15 characters'); return false;
        }
        if (!form.industry_type) {
            setError('Please select industry type'); return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setError('');
        try {
            const res = await registerBuyer(form);
            setSuccess(true);
            setTimeout(() => navigate(`/buyer/dashboard/${res.data.id}`), 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary-50 px-4">
                <div className="card max-w-md w-full text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h2>
                    <p className="text-gray-500 text-sm mb-4">{t('buyer.pending')}</p>
                    <div className="badge-pending inline-block">Pending Admin Verification</div>
                    <p className="text-xs text-gray-400 mt-4">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4">
            <div className="max-w-lg mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        {t('buyer.register_title')}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Source verified crop residue directly from farmers
                    </p>
                </div>

                {/* KYC Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-blue-700">
                    <strong>KYC Required:</strong> Your GST number and industry license will be
                    verified by our admin team within 24-48 hours before your account is activated.
                </div>

                {/* Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('buyer.contact_name')} *
                            </label>
                            <input
                                type="text"
                                name="contact_name"
                                value={form.contact_name}
                                onChange={handleChange}
                                placeholder="Contact person name"
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('buyer.phone')} *
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

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('buyer.company')} *
                            </label>
                            <input
                                type="text"
                                name="company_name"
                                value={form.company_name}
                                onChange={handleChange}
                                placeholder="Registered company name"
                                className="input-field"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('buyer.gst')} *
                            </label>
                            <input
                                type="text"
                                name="gst_number"
                                value={form.gst_number}
                                onChange={handleChange}
                                placeholder="15 digit GST number"
                                className="input-field"
                                maxLength={15}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                {t('buyer.industry_type')} *
                            </label>
                            <select
                                name="industry_type"
                                value={form.industry_type}
                                onChange={handleChange}
                                className="input-field"
                                required
                            >
                                <option value="">Select industry type</option>
                                {industryTypes.map(i => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 mt-2"
                        >
                            {loading ? 'Registering...' : t('buyer.submit')}
                        </button>

                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already registered?{' '}
                    <span
                        className="text-blue-600 font-semibold cursor-pointer hover:underline"
                        onClick={() => navigate('/')}
                    >
                        Go to Home
                    </span>
                </p>

            </div>
        </div>
    );
};

export default BuyerRegister;