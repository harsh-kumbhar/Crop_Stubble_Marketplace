import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getBuyer, getAllListings, filterByCrop, filterByState } from '../api/api';
import ListingCard from '../components/ListingCard';
import { SearchIcon, FilterIcon, FactoryIcon } from '../components/Icons';

const cropOptions = ['All Crops', 'paddy', 'wheat', 'maize', 'cotton', 'sugarcane', 'mustard', 'soybean', 'groundnut'];
const stateOptions = ['All States', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Haryana', 'Other'];

const BuyerDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [buyer, setBuyer] = useState(null);
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cropFilter, setCropFilter] = useState('All Crops');
    const [stateFilter, setStateFilter] = useState('All States');
    const [quantityFilter, setQuantityFilter] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const buyerRes = await getBuyer(id);
                setBuyer(buyerRes.data);
                const listingsRes = await getAllListings();
                setListings(listingsRes.data);
                setFilteredListings(listingsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Apply filters
    useEffect(() => {
        let filtered = [...listings];
        if (cropFilter !== 'All Crops') {
            filtered = filtered.filter(l => l.crop_type === cropFilter);
        }
        if (quantityFilter > 0) {
            filtered = filtered.filter(l => l.quantity >= quantityFilter);
        }
        setFilteredListings(filtered);
    }, [cropFilter, stateFilter, quantityFilter, listings]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    const verifiedListings = listings.filter(l => l.satellite_verified);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-200 text-sm mb-1">Buyer Dashboard</p>
                            <h1 className="text-2xl font-bold mb-1">
                                {buyer?.company_name}
                            </h1>
                            <p className="text-blue-200 text-sm">
                                {buyer?.industry_type} · {buyer?.contact_name}
                            </p>
                        </div>
                        <div className={`px-4 py-2 rounded-xl text-center text-sm font-semibold ${buyer?.verified
                                ? 'bg-green-400 text-green-900'
                                : 'bg-yellow-400 text-yellow-900'
                            }`}>
                            {buyer?.verified ? 'Verified' : 'Pending KYC'}
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-1">
                            {listings.length}
                        </div>
                        <div className="text-xs text-gray-500">{t('buyer.total_listings')}</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            {verifiedListings.length}
                        </div>
                        <div className="text-xs text-gray-500">{t('buyer.verified_listings')}</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-orange-500 mb-1">
                            {filteredListings.length}
                        </div>
                        <div className="text-xs text-gray-500">Matching Your Filters</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="card mb-6">
                    <h3 className="font-semibold text-gray-700 mb-4">Filter Listings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Crop Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                                {t('buyer.filter_crop')}
                            </label>
                            <select
                                value={cropFilter}
                                onChange={(e) => setCropFilter(e.target.value)}
                                className="input-field text-sm"
                            >
                                {cropOptions.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>

                        {/* State Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                                {t('buyer.filter_state')}
                            </label>
                            <select
                                value={stateFilter}
                                onChange={(e) => setStateFilter(e.target.value)}
                                className="input-field text-sm"
                            >
                                {stateOptions.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity Filter */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                                Min Quantity: {quantityFilter} Tonnes
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                value={quantityFilter}
                                onChange={(e) => setQuantityFilter(Number(e.target.value))}
                                className="w-full accent-primary-600"
                            />
                        </div>

                    </div>
                </div>

                {/* Listings */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        Available Listings
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({filteredListings.length} found)
                        </span>
                    </h2>
                </div>

                {filteredListings.length === 0 ? (
                    <div className="card text-center py-16">
                        <div className="text-5xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No listings found
                        </h3>
                        <p className="text-gray-500 text-sm">
                            Try adjusting your filters to see more results
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredListings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                farmerState={stateFilter !== 'All States' ? stateFilter : 'India'}
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default BuyerDashboard;