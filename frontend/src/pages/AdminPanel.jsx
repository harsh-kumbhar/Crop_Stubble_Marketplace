import React, { useEffect, useState } from 'react';
import { getAllBuyers, verifyBuyer, getAllListings, verifySatellite } from '../api/api';
import { UserCheckIcon, SatelliteIcon, VerifiedIcon, PendingIcon } from '../components/Icons';

const ADMIN_PASSWORD = 'admin2026';

const AdminPanel = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [buyers, setBuyers] = useState([]);
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('buyers');
    const [verifying, setVerifying] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            setAuthenticated(true);
        } else {
            setPasswordError('Incorrect password');
        }
    };

    useEffect(() => {
        if (!authenticated) return;
        const fetchData = async () => {
            try {
                const buyersRes = await getAllBuyers();
                setBuyers(buyersRes.data);
                const listingsRes = await getAllListings();
                setListings(listingsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [authenticated]);

    const handleVerifyBuyer = async (buyerId) => {
        setVerifying(buyerId);
        try {
            await verifyBuyer(buyerId);
            setBuyers(buyers.map(b =>
                b.id === buyerId ? { ...b, verified: true } : b
            ));
        } catch (err) {
            console.error(err);
        } finally {
            setVerifying(null);
        }
    };

    const handleVerifySatellite = async (listingId) => {
        setVerifying(listingId);
        try {
            await verifySatellite(listingId);
            setListings(listings.map(l =>
                l.id === listingId ? { ...l, satellite_verified: true } : l
            ));
        } catch (err) {
            console.error(err);
        } finally {
            setVerifying(null);
        }
    };

    // Login Screen
    if (!authenticated) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mx-auto mb-3">
                            <span className="text-white font-bold text-lg">F2F</span>
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                        <p className="text-sm text-gray-500">Field to Factory — Restricted Access</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Admin Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                                placeholder="Enter admin password"
                                className="input-field"
                                required
                            />
                            {passwordError && (
                                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                            )}
                        </div>
                        <button type="submit" className="btn-primary w-full text-center">
                            Login to Admin Panel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const pendingBuyers = buyers.filter(b => !b.verified);
    const verifiedBuyers = buyers.filter(b => b.verified);
    const unverifiedListings = listings.filter(l => !l.satellite_verified);

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Top Bar */}
            <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-sm">F2F</span>
                    </div>
                    <div>
                        <h1 className="font-bold">Admin Panel</h1>
                        <p className="text-xs text-gray-400">Field to Factory — Platform Management</p>
                    </div>
                </div>
                <button
                    onClick={() => setAuthenticated(false)}
                    className="text-gray-400 hover:text-white text-sm"
                >
                    Logout
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-primary-600">{buyers.length}</div>
                        <div className="text-xs text-gray-500">Total Buyers</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-yellow-500">{pendingBuyers.length}</div>
                        <div className="text-xs text-gray-500">Pending KYC</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-green-600">{verifiedBuyers.length}</div>
                        <div className="text-xs text-gray-500">Verified Buyers</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-2xl font-bold text-blue-600">{listings.length}</div>
                        <div className="text-xs text-gray-500">Total Listings</div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('buyers')}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'buyers'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                            }`}
                    >
                        Buyer KYC
                        {pendingBuyers.length > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {pendingBuyers.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('listings')}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'listings'
                                ? 'bg-primary-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                            }`}
                    >
                        Satellite Verification
                        {unverifiedListings.length > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {unverifiedListings.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Buyer KYC Tab */}
                {activeTab === 'buyers' && (
                    <div className="space-y-4">
                        {buyers.length === 0 ? (
                            <div className="card text-center py-12 text-gray-500">
                                No buyers registered yet
                            </div>
                        ) : (
                            buyers.map(buyer => (
                                <div key={buyer.id} className="card flex justify-between items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-gray-800">
                                                {buyer.company_name}
                                            </h3>
                                            {buyer.verified ? (
                                                <span className="badge-verified flex items-center gap-1">
                                                    <VerifiedIcon /> Verified
                                                </span>
                                            ) : (
                                                <span className="badge-pending flex items-center gap-1">
                                                    <PendingIcon /> Pending KYC
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 space-y-0.5">
                                            <p>Contact: {buyer.contact_name} · {buyer.phone}</p>
                                            <p>GST: {buyer.gst_number}</p>
                                            <p>Industry: {buyer.industry_type}</p>
                                        </div>
                                    </div>
                                    {!buyer.verified && (
                                        <button
                                            onClick={() => handleVerifyBuyer(buyer.id)}
                                            disabled={verifying === buyer.id}
                                            className="btn-primary text-sm py-2 px-4 ml-4"
                                        >
                                            {verifying === buyer.id ? 'Verifying...' : 'Verify KYC'}
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* Satellite Verification Tab */}
                {activeTab === 'listings' && (
                    <div className="space-y-4">
                        {listings.length === 0 ? (
                            <div className="card text-center py-12 text-gray-500">
                                No listings yet
                            </div>
                        ) : (
                            listings.map(listing => (
                                <div key={listing.id} className="card flex justify-between items-center">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="font-semibold text-gray-800 capitalize">
                                                {listing.crop_type} Residue
                                            </h3>
                                            {listing.satellite_verified ? (
                                                <span className="badge-verified">Satellite Verified</span>
                                            ) : (
                                                <span className="badge-pending">Unverified</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 space-y-0.5">
                                            <p>Quantity: {listing.quantity} tonnes</p>
                                            <p>Price: Rs.{listing.ai_price_min} — Rs.{listing.ai_price_max} per tonne</p>
                                            <p>Status: {listing.status}</p>
                                            <p>Location: {listing.lat}, {listing.lng}</p>
                                        </div>
                                    </div>
                                    {!listing.satellite_verified && (
                                        <button
                                            onClick={() => handleVerifySatellite(listing.id)}
                                            disabled={verifying === listing.id}
                                            className="btn-primary text-sm py-2 px-4 ml-4"
                                        >
                                            {verifying === listing.id ? 'Verifying...' : 'Verify Satellite'}
                                        </button>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminPanel;