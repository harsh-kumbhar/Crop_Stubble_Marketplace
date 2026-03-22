import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import SatelliteBadge from './SatelliteBadge';
import { CropIcons } from './Icons';

const cropEmojis = {
    paddy: 'P', wheat: 'W', maize: 'M',
    cotton: 'C', sugarcane: 'S', mustard: 'Mu',
    soybean: 'So', groundnut: 'G'
};

const ListingCard = ({ listing, farmerState, userType = 'buyer' }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const matchScore = Math.floor(75 + (listing.id * 7) % 20);
    const carbonCredits = (listing.quantity * 1.46).toFixed(1);

    return (
        <div className="card hover:shadow-md transition-all duration-200 border hover:border-primary-200">

            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        {(() => {
                            const Icon = CropIcons[listing.crop_type] || CropIcons.default;
                            return <Icon className="text-primary-700 text-lg" />;
                        })()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 capitalize">
                            {listing.crop_type} Residue
                        </h3>
                        <p className="text-xs text-gray-500">
                            {farmerState || 'India'} · Listed recently
                        </p>
                    </div>
                </div>

                {/* Match score only for buyers */}
                {userType === 'buyer' && (
                    <div className="text-right">
                        <div className="text-lg font-bold text-primary-600">
                            {matchScore}%
                        </div>
                        <div className="text-xs text-gray-500">
                            {t('buyer.match_score')}
                        </div>
                    </div>
                )}

                {/* Status badge for farmers */}
                {userType === 'farmer' && (
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${listing.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                        {listing.status === 'active' ? 'Active' : 'Sold'}
                    </span>
                )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-gray-800">
                        {listing.quantity}
                    </div>
                    <div className="text-xs text-gray-500">{t('common.tonnes')}</div>
                </div>
                <div className="bg-primary-50 rounded-lg p-2 text-center">
                    <div className="text-lg font-bold text-primary-700">
                        {listing.ai_price_min
                            ? `Rs.${listing.ai_price_min}`
                            : 'Pricing...'}
                    </div>
                    <div className="text-xs text-gray-500">Min per tonne</div>
                </div>
            </div>

            {/* Satellite Badge */}
            <div className="mb-3">
                <SatelliteBadge
                    verified={listing.satellite_verified}
                    quantity={listing.quantity}
                />
            </div>

            {/* Carbon Credits */}
            <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-2 mb-3">
                <span>~{carbonCredits} carbon credits</span>
                <span className={`font-semibold ${listing.status === 'active' ? 'text-green-600' : 'text-gray-400'
                    }`}>
                    {listing.status === 'active' ? '● Active' : '● Sold'}
                </span>
            </div>

            {/* Action Buttons — different for farmer vs buyer */}
            {userType === 'buyer' && (
                <button
                    onClick={() => navigate(`/listing/${listing.id}`)}
                    className="w-full btn-primary text-sm py-2 text-center"
                >
                    {t('common.view_details')}
                </button>
            )}

            {userType === 'farmer' && (
                <button
                    onClick={() => navigate(`/listing/${listing.id}?userType=farmer`)}
                    className="w-full btn-secondary text-sm py-2 text-center"
                >
                    View Listing
                </button>
            )}

        </div>
    );
};

export default ListingCard;