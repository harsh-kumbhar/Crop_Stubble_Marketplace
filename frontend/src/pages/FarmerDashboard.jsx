import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { getFarmer, getAllListings } from '../api/api';
import ListingCard from '../components/ListingCard';
import { FarmerIcon, PlusIcon, AgricultureIcon } from '../components/Icons';

const FarmerDashboard = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [farmer, setFarmer] = useState(null);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const farmerRes = await getFarmer(id);
                setFarmer(farmerRes.data);
                const listingsRes = await getAllListings();
                const myListings = listingsRes.data.filter(
                    l => l.farmer_id === parseInt(id)
                );
                setListings(myListings);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    const activeListings = listings.filter(l => l.status === 'active');
    const soldListings = listings.filter(l => l.status === 'sold');
    const estimatedEarnings = listings.reduce((sum, l) => {
        return sum + (l.ai_price_min || 0) * l.quantity;
    }, 0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Welcome Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white mb-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-primary-200 text-sm mb-1">Welcome back</p>
                            <h1 className="text-2xl font-bold mb-1">
                                {farmer?.name}
                            </h1>
                            <p className="text-primary-200 text-sm">
                                {farmer?.village}, {farmer?.state} · {farmer?.crop_type} farmer
                            </p>
                        </div>
                        <div className="bg-white bg-opacity-20 rounded-xl px-4 py-2 text-center">
                            <div className="text-2xl font-bold">
                                {listings.length}
                            </div>
                            <div className="text-xs text-primary-200">
                                Total Listings
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-primary-600 mb-1">
                            {listings.length}
                        </div>
                        <div className="text-xs text-gray-500">{t('farmer.my_listings')}</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                            {activeListings.length}
                        </div>
                        <div className="text-xs text-gray-500">{t('farmer.active')}</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-gray-600 mb-1">
                            {soldListings.length}
                        </div>
                        <div className="text-xs text-gray-500">{t('farmer.sold')}</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-orange-500 mb-1">
                            Rs.{estimatedEarnings.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">{t('farmer.total_earned')}</div>
                    </div>
                </div>

                {/* Create Listing Button */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                        {t('farmer.my_listings')}
                    </h2>
                    <button
                        onClick={() => navigate(`/farmer/create-listing/${id}`)}
                        className="btn-primary text-sm py-2 px-5 flex items-center gap-2"
                    >
                        <PlusIcon /> {t('farmer.create_listing')}
                    </button>
                </div>

                {/* Listings Grid */}
                {listings.length === 0 ? (
                    <div className="card text-center py-16">
                        <div className="text-5xl mb-4">🌾</div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No listings yet
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Create your first listing and start earning from your crop residue
                        </p>
                        <button
                            onClick={() => navigate(`/farmer/create-listing/${id}`)}
                            className="btn-primary"
                        >
                            Create First Listing
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {listings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                farmerState={farmer?.state}
                                userType="farmer"
                            />
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default FarmerDashboard;