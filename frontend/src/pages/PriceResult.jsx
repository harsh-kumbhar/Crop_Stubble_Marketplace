import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import SatelliteBadge from '../components/SatelliteBadge';
import { SatelliteIcon, CarbonIcon, AIIcon, VerifiedIcon } from '../components/Icons';

const PriceResult = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { listing, price, farmer } = location.state || {};

    const [verifying, setVerifying] = useState(true);
    const [verified, setVerified] = useState(false);
    const [progress, setProgress] = useState(0);

    // Simulate satellite verification animation
    useEffect(() => {
        if (!listing) return;
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setVerifying(false);
                    setVerified(true);
                    return 100;
                }
                return p + 4;
            });
        }, 80);
        return () => clearInterval(interval);
    }, [listing]);

    if (!listing || !price) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">No listing data found</p>
                    <button onClick={() => navigate('/')} className="btn-primary">
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const carbonCredits = (listing.quantity * 1.46).toFixed(1);
    const carbonValue = (carbonCredits * 145).toFixed(0);
    const totalEarning = (price.suggested_price * listing.quantity).toFixed(0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Success Header */}
                <div className="card bg-gradient-to-r from-primary-600 to-primary-700 text-white mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">{t('listing.listing_live')}</h1>
                            <p className="text-primary-200 text-sm">
                                Listing #{listing.id} · {listing.crop_type} · {listing.quantity} tonnes
                            </p>
                        </div>
                    </div>
                </div>

                {/* AI Price Card */}
                <div className="card mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                            <AIIcon className="text-purple-600 text-lg" />
                        </div>
                        <h2 className="font-bold text-gray-800">{t('listing.price_title')}</h2>
                    </div>

                    {/* Price Range */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
                            <div className="text-xs text-gray-500 mb-1">{t('listing.price_min')}</div>
                            <div className="text-xl font-bold text-red-500">
                                Rs.{price.price_min}
                            </div>
                            <div className="text-xs text-gray-400">{t('listing.per_tonne')}</div>
                        </div>
                        <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-3 text-center relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                                Best Price
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{t('listing.suggested')}</div>
                            <div className="text-2xl font-bold text-primary-600">
                                Rs.{price.suggested_price}
                            </div>
                            <div className="text-xs text-gray-400">{t('listing.per_tonne')}</div>
                        </div>
                        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
                            <div className="text-xs text-gray-500 mb-1">{t('listing.price_max')}</div>
                            <div className="text-xl font-bold text-green-600">
                                Rs.{price.price_max}
                            </div>
                            <div className="text-xs text-gray-400">{t('listing.per_tonne')}</div>
                        </div>
                    </div>

                    {/* Total Earning */}
                    <div className="bg-primary-50 rounded-xl p-4 text-center border border-primary-100">
                        <div className="text-sm text-gray-500 mb-1">
                            Estimated Total Earning ({listing.quantity} tonnes)
                        </div>
                        <div className="text-3xl font-bold text-primary-700">
                            Rs.{parseInt(totalEarning).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            Based on suggested price × quantity
                        </div>
                    </div>
                </div>

                {/* Satellite Verification Card */}
                <div className="card mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                            <SatelliteIcon className="text-amber-600 text-lg" />
                        </div>
                        <h2 className="font-bold text-gray-800">Satellite Verification</h2>
                    </div>

                    {/* Verification Progress */}
                    {verifying && (
                        <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                <span>Running GEE Analysis...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary-600 h-2 rounded-full transition-all duration-100"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                                Fetching Sentinel-2 imagery · Computing NDVI + NDTI indices...
                            </div>
                        </div>
                    )}

                    {/* Verified State */}
                    {verified && (
                        <div className="space-y-3">
                            <SatelliteBadge verified={true} quantity={listing.quantity} />

                            {/* NDVI Image */}
                            <div className="rounded-xl overflow-hidden border border-gray-200">
                                <img
                                    src="/images/sentinel_sample.png"
                                    alt="NDVI Satellite View"
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                                <div className="bg-gray-800 text-white text-xs p-2 flex justify-between">
                                    <span>Sentinel-2 NDVI — Ludhiana, Punjab</span>
                                    <span>Nov 2023</span>
                                </div>
                            </div>

                            {/* Satellite Stats */}
                            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                                <div className="bg-green-50 rounded-lg p-2">
                                    <div className="font-bold text-green-700">0.18</div>
                                    <div className="text-gray-500">NDVI Value</div>
                                </div>
                                <div className="bg-amber-50 rounded-lg p-2">
                                    <div className="font-bold text-amber-700">0.12</div>
                                    <div className="text-gray-500">NDTI Value</div>
                                </div>
                                <div className="bg-blue-50 rounded-lg p-2">
                                    <div className="font-bold text-blue-700">82%</div>
                                    <div className="text-gray-500">Accuracy</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Carbon Credits Card */}
                <div className="card mb-6 bg-green-50 border border-green-200">
                    <h2 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                        <CarbonIcon className="text-green-600" />
                        {t('listing.carbon_credits')}
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-700">{carbonCredits}</div>
                            <div className="text-xs text-green-600">Carbon Credits</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-700">Rs.{parseInt(carbonValue).toLocaleString()}</div>
                            <div className="text-xs text-green-600">Estimated Value</div>
                        </div>
                    </div>
                    <p className="text-xs text-green-600 mt-3">
                        Based on Verra VM0042 methodology — Rs.145 per credit
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate(`/farmer/dashboard/${listing.farmer_id}`)}
                        className="btn-secondary flex-1 text-center"
                    >
                        Back to Dashboard
                    </button>
                    <button
                        onClick={() => navigate('/buyer/dashboard/1')}
                        className="btn-primary flex-1 text-center"
                    >
                        View as Buyer
                    </button>
                </div>

            </div>
        </div>
    );
};

export default PriceResult;