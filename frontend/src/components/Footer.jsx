import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-400 py-10 mt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">F2F</span>
                            </div>
                            <span className="font-bold text-white text-lg">
                                Field to Factory
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed">
                            Turning crop stubble from an agricultural liability into a
                            tradeable commodity. Pune Agri Hackathon 2026.
                        </p>
                    </div>

                    {/* Stats */}
                    <div>
                        <h4 className="text-white font-semibold mb-3">Impact Numbers</h4>
                        <ul className="text-sm space-y-2">
                            <li>🌾 500 MT residue generated annually</li>
                            <li>🔥 92–135 MT burned every year</li>
                            <li>💰 ₹2.5 lakh crore economic loss</li>
                            <li>🌱 ₹40,000 crore market opportunity</li>
                        </ul>
                    </div>

                    {/* Industrial Buyers */}
                    <div>
                        <h4 className="text-white font-semibold mb-3">Industrial Buyers</h4>
                        <ul className="text-sm space-y-2">
                            <li>⚡ NTPC — Biomass co-firing</li>
                            <li>🔋 SAEL Industries — Biomass power</li>
                            <li>🌿 Verbio AG — BioCNG</li>
                            <li>📄 Satia Industries — Eco paper</li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs">
                    <p>© 2026 Field to Factory — Pune Agriculture Hackathon | Theme 5: Renewable Energy & Farm Waste</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;