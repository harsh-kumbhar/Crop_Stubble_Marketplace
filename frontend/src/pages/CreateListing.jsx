import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { createListing, getPriceSuggestion, getFarmer } from '../api/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet marker icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const cropTypes = [
    'paddy', 'wheat', 'maize', 'cotton',
    'sugarcane', 'mustard', 'soybean', 'groundnut'
];

const seasons = ['kharif', 'rabi'];

// Map click handler component
const MapClickHandler = ({ onLocationSelect }) => {
    useMapEvents({
        click(e) {
            onLocationSelect(e.latlng.lat, e.latlng.lng);
        }
    });
    return null;
};

const CreateListing = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { farmerId } = useParams();

    const [farmer, setFarmer] = useState(null);
    const [form, setForm] = useState({
        crop_type: '',
        quantity: 5,
        season: 'kharif',
        photo_url: ''
    });
    const [location, setLocation] = useState({ lat: 19.7515, lng: 75.7139 }); // Maharashtra center
    const [pinDropped, setPinDropped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [step, setStep] = useState(1);

    useEffect(() => {
        const fetchFarmer = async () => {
            try {
                const res = await getFarmer(farmerId);
                setFarmer(res.data);
                // Pre-select crop type from farmer profile
                setForm(f => ({ ...f, crop_type: res.data.crop_type }));
            } catch (err) {
                console.error(err);
            }
        };
        fetchFarmer();
    }, [farmerId]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError('');
    };

    const handleLocationSelect = (lat, lng) => {
        setLocation({ lat, lng });
        setPinDropped(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!pinDropped) {
            setError('Please drop a pin on your field location on the map');
            return;
        }
        if (!form.crop_type) {
            setError('Please select a crop type');
            return;
        }

        setLoading(true);
        setError('');
        try {
            // Get AI price first
            const priceRes = await getPriceSuggestion({
                crop_type: form.crop_type.toLowerCase(),
                quantity: parseFloat(form.quantity),
                state: (farmer?.state || 'Maharashtra').toLowerCase(),
                season: form.season.toLowerCase()
            });

            const priceData = priceRes.data;

            // Validate price data before using
            if (!priceData.price_min || !priceData.price_max) {
                setError('Could not get AI price. Please try again.');
                return;
            }

            // Create listing with AI price
            const listingRes = await createListing({
                farmer_id: parseInt(farmerId),
                crop_type: form.crop_type,
                quantity: parseFloat(form.quantity),
                lat: location.lat,
                lng: location.lng,
                photo_url: form.photo_url || null,
                ai_price_min: priceData.price_min,
                ai_price_max: priceData.price_max,
            });

            navigate('/price-result', {
                state: {
                    listing: listingRes.data,
                    price: priceData,
                    farmer: farmer,
                    location: location
                }
            });

        } catch (err) {
            console.error('Full error:', err.response?.data);
            setError(
                typeof err.response?.data?.detail === 'string'
                    ? err.response.data.detail
                    : 'Failed to create listing. Please try again.'
            );
        }
        
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(`/farmer/dashboard/${farmerId}`)}
                        className="text-sm text-gray-500 hover:text-primary-600 mb-3 flex items-center gap-1"
                    >
                        Back to Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">
                        {t('farmer.create_listing')}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Fill in the details — our AI will suggest the best price instantly
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center gap-2 mb-6">
                    {[1, 2, 3].map((s) => (
                        <React.Fragment key={s}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${step >= s
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }`}>
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={`flex-1 h-1 rounded transition-all ${step > s ? 'bg-primary-600' : 'bg-gray-200'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <form onSubmit={handleSubmit}>

                    {/* STEP 1 — Crop Details */}
                    {step === 1 && (
                        <div className="card space-y-4">
                            <h2 className="font-semibold text-gray-700 text-lg border-b pb-2">
                                Step 1 — Crop Details
                            </h2>

                            {/* Crop Type */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {t('listing.crop_type')} *
                                </label>
                                <select
                                    name="crop_type"
                                    value={form.crop_type}
                                    onChange={handleChange}
                                    className="input-field"
                                    required
                                >
                                    <option value="">Select crop type</option>
                                    {cropTypes.map(c => (
                                        <option key={c} value={c} className="capitalize">{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {t('listing.quantity')} *
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        name="quantity"
                                        min="1"
                                        max="100"
                                        value={form.quantity}
                                        onChange={handleChange}
                                        className="flex-1 accent-primary-600"
                                    />
                                    <div className="bg-primary-50 border border-primary-200 rounded-lg px-4 py-2 text-center min-w-20">
                                        <div className="text-xl font-bold text-primary-600">{form.quantity}</div>
                                        <div className="text-xs text-gray-500">Tonnes</div>
                                    </div>
                                </div>
                            </div>

                            {/* Season */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Season *
                                </label>
                                <div className="flex gap-3">
                                    {seasons.map(s => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setForm({ ...form, season: s })}
                                            className={`flex-1 py-2 rounded-lg text-sm font-semibold border-2 transition-all capitalize ${form.season === s
                                                    ? 'border-primary-600 bg-primary-50 text-primary-700'
                                                    : 'border-gray-200 text-gray-500 hover:border-primary-300'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!form.crop_type}
                                className="btn-primary w-full text-center"
                            >
                                Next — Set Location
                            </button>
                        </div>
                    )}

                    {/* STEP 2 — Location */}
                    {step === 2 && (
                        <div className="card space-y-4">
                            <h2 className="font-semibold text-gray-700 text-lg border-b pb-2">
                                Step 2 — Field Location
                            </h2>

                            <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 text-sm text-primary-700">
                                {t('listing.pin_instruction')}
                            </div>

                            {/* Map */}
                            <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: '320px' }}>
                                <MapContainer
                                    center={[location.lat, location.lng]}
                                    zoom={7}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution="OpenStreetMap"
                                    />
                                    <MapClickHandler onLocationSelect={handleLocationSelect} />
                                    {pinDropped && (
                                        <Marker position={[location.lat, location.lng]} />
                                    )}
                                </MapContainer>
                            </div>

                            {/* Location Status */}
                            {pinDropped ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
                                    Pin dropped at: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                                </div>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                                    No pin dropped yet — click on the map to mark your field
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="btn-secondary flex-1 text-center"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep(3)}
                                    disabled={!pinDropped}
                                    className="btn-primary flex-1 text-center"
                                >
                                    Next — Add Photo
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 3 — Photo & Submit */}
                    {step === 3 && (
                        <div className="card space-y-4">
                            <h2 className="font-semibold text-gray-700 text-lg border-b pb-2">
                                Step 3 — Field Photo
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    {t('listing.photo')} (Optional)
                                </label>
                                <input
                                    type="url"
                                    name="photo_url"
                                    value={form.photo_url}
                                    onChange={handleChange}
                                    placeholder="Paste image URL or leave blank"
                                    className="input-field"
                                />
                                <p className="text-xs text-gray-400 mt-1">
                                    Paste a URL to your field photo. Listings with photos get 3x more buyer interest.
                                </p>
                            </div>

                            {/* Summary */}
                            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                                <h3 className="font-semibold text-gray-700 mb-2">Listing Summary</h3>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Crop Type</span>
                                    <span className="font-semibold capitalize">{form.crop_type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Quantity</span>
                                    <span className="font-semibold">{form.quantity} tonnes</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Season</span>
                                    <span className="font-semibold capitalize">{form.season}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Location</span>
                                    <span className="font-semibold">{location.lat.toFixed(3)}, {location.lng.toFixed(3)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">State</span>
                                    <span className="font-semibold">{farmer?.state}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="btn-secondary flex-1 text-center"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-primary flex-1 text-center"
                                >
                                    {loading ? 'Getting AI Price...' : 'Submit & Get AI Price'}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default CreateListing;