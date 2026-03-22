import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { getListingById, getFarmer } from '../api/api';
import SatelliteBadge from '../components/SatelliteBadge';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ListingDetail = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();

    const [listing, setListing] = useState(null);
    const [farmer, setFarmer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requested, setRequested] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const listingRes = await getListingById(id);
                setListing(listingRes.data);
                const farmerRes = await getFarmer(listingRes.data.farmer_id);
                setFarmer(farmerRes.data);
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
                <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Listing not found
            </div>
        );
    }

    const matchScore = Math.floor(75 + Math.random() * 20);
    const carbonCredits = (listing.quantity * 1.46).toFixed(1);
    const totalValue = (listing.ai_price_min * listing.quantity).toFixed(0);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="text-sm text-gray-500 hover:text-primary-600 mb-4 flex items-center gap-1"
                >
                    Back to Listings
                </button>

                {/* Header Card */}
                <div className="card mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 capitalize mb-1">
                                {listing.crop_type} Residue
                            </h1>
                            <p className="text-gray-500 text-sm">
                                Listed by {farmer?.name} · {farmer?.village}, {farmer?.state}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-primary-600">{matchScore}%</div>
                            <div className="text-xs text-gray-500">{t('buyer.match_score')}</div>
                        </div>
                    </div>

                    {/* Key Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-gray-800">{listing.quantity}</div>
                            <div className="text-xs text-gray-500">Tonnes</div>
                        </div>
                        <div className="bg-primary-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-primary-600">
                                Rs.{listing.ai_price_min}
                            </div>
                            <div className="text-xs text-gray-500">Min/tonne</div>
                        </div>
                        <div className="bg-primary-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-primary-700">
                                Rs.{listing.ai_price_max}
                            </div>
                            <div className="text-xs text-gray-500">Max/tonne</div>
                        </div>
                        <div className="bg-green-50 rounded-xl p-3 text-center">
                            <div className="text-xl font-bold text-green-600">
                                Rs.{parseInt(totalValue).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">Total Value</div>
                        </div>
                    </div>

                    {/* Satellite Badge */}
                    <SatelliteBadge
                        verified={listing.satellite_verified}
                        quantity={listing.quantity}
                    />
                </div>

                {/* Map */}
                <div className="card mb-6">
                    <h2 className="font-bold text-gray-800 mb-3">Field Location</h2>
                    <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '260px' }}>
                        <MapContainer
                            center={[listing.lat, listing.lng]}
                            zoom={10}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution="OpenStreetMap"
                            />
                            <Marker position={[listing.lat, listing.lng]} />
                        </MapContainer>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Coordinates: {listing.lat.toFixed(4)}, {listing.lng.toFixed(4)}
                    </p>
                </div>

                {/* Carbon Credits */}
                <div className="card mb-6 bg-green-50 border border-green-200">
                    <h2 className="font-bold text-green-800 mb-2">Carbon Credit Estimate</h2>
                    <div className="flex justify-between">
                        <div>
                            <div className="text-2xl font-bold text-green-700">{carbonCredits}</div>
                            <div className="text-xs text-green-600">Carbon Credits (Verra VM0042)</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-700">
                                Rs.{(carbonCredits * 145).toFixed(0)}
                            </div>
                            <div className="text-xs text-green-600">Estimated Value</div>
                        </div>
                    </div>
                </div>

                {/* Action Button — only show for buyers */}
                {!window.location.search.includes('userType=farmer') && (
                    requested ? (
                        <div className="card bg-green-50 border border-green-200 text-center py-6">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-green-800 mb-1">Purchase Request Sent!</h3>
                            <p className="text-green-600 text-sm">
                                The farmer will be notified and will contact you shortly.
                            </p>
                        </div>
                    ) : (
                        <button
                            onClick={() => setRequested(true)}
                            className="btn-primary w-full text-center py-4 text-base"
                        >
                            {t('buyer.send_request')}
                        </button>
                    )
                )}

                {/* Farmer view — show manage options instead */}
                {window.location.search.includes('userType=farmer') && (
                    <div className="card bg-primary-50 border border-primary-200 text-center py-4">
                        <p className="text-primary-700 font-semibold text-sm">
                            This is your listing · Manage it from your dashboard
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-primary mt-3 text-sm py-2 px-6"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default ListingDetail;