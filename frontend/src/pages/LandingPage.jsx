import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FireIcon, MoneyIcon, RecycleIcon, ChartIcon, FarmerIcon, BuyerIcon, BoltIcon, FileIcon, CarbonIcon } from '../components/Icons';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

// Animated counter hook
const useCountUp = (target, duration = 2000, start = false) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setCount(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [start, target, duration]);
    return count;
};

// Burning trend data
const burningTrendData = [
    { year: '2018', burned: 62, diverted: 5 },
    { year: '2019', burned: 70, diverted: 8 },
    { year: '2020', burned: 75, diverted: 12 },
    { year: '2021', burned: 80, diverted: 18 },
    { year: '2022', burned: 85, diverted: 25 },
    { year: '2023', burned: 92, diverted: 35 },
    { year: '2026*', burned: 60, diverted: 70 },
];

// State wise data
const stateData = [
    { state: 'UP', residue: 60 },
    { state: 'Punjab', residue: 51 },
    { state: 'Maharashtra', residue: 46 },
    { state: 'Haryana', residue: 28 },
    { state: 'MP', residue: 22 },
];
const buyers = [
    { name: 'NTPC', type: 'Biomass Co-firing', color: 'bg-blue-50 border-blue-200', textColor: 'text-blue-700' },
    { name: 'SAEL Industries', type: 'Biomass Power Generation', color: 'bg-green-50 border-green-200', textColor: 'text-green-700' },
    { name: 'Verbio AG', type: 'Compressed Biogas (BioCNG)', color: 'bg-teal-50 border-teal-200', textColor: 'text-teal-700' },
    { name: 'Satia Industries', type: 'Eco-friendly Paper', color: 'bg-yellow-50 border-yellow-200', textColor: 'text-yellow-700' },
];
const steps = [
    { number: '01', titleKey: 'landing.step1_title', descKey: 'landing.step1_desc', bg: 'bg-green-600' },
    { number: '02', titleKey: 'landing.step2_title', descKey: 'landing.step2_desc', bg: 'bg-purple-600' },
    { number: '03', titleKey: 'landing.step3_title', descKey: 'landing.step3_desc', bg: 'bg-orange-500' },
];

const LandingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

    // Intersection observer for triggering animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
            { threshold: 0.3 }
        );
        if (statsRef.current) observer.observe(statsRef.current);
        return () => observer.disconnect();
    }, []);

    const residueCount = useCountUp(500, 2000, statsVisible);
    const lossCount = useCountUp(30, 2000, statsVisible);
    const burnedCount = useCountUp(92, 2000, statsVisible);
    const opportunityCount = useCountUp(40000, 2000, statsVisible);

    return (
        <div>

            {/* HERO SECTION */}
            <section className="bg-gradient-to-br from-primary-50 via-white to-green-50 py-20 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                        Pune Agriculture Hackathon 2026 - Theme 5
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
                        {t('landing.hero_title')}
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        {t('landing.hero_subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/farmer/register')}
                            className="btn-primary text-base px-8 py-4 flex items-center justify-center gap-2"
                        >
                            <FarmerIcon /> {t('landing.farmer_btn')}
                        </button>
                        <button
                            onClick={() => navigate('/buyer/register')}
                            className="btn-secondary text-base px-8 py-4 flex items-center justify-center gap-2"
                        >
                            <BuyerIcon /> {t('landing.buyer_btn')}
                        </button>
                    </div>
                </div>
            </section>

            {/* ANIMATED STATS */}
            <section ref={statsRef} className="bg-white py-14 px-4 border-y border-gray-100">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-center text-gray-500 text-sm font-semibold uppercase tracking-widest mb-8">
                        The Scale of the Crisis
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-red-50 rounded-2xl p-5 text-center border border-red-100">
                            <div className="text-4xl font-bold text-red-500 mb-1">
                                {residueCount}<span className="text-2xl"> MT</span>
                            </div>
                            <div className="text-xs text-gray-500 leading-tight">
                                {t('landing.stats_residue')}
                            </div>
                        </div>
                        <div className="bg-orange-50 rounded-2xl p-5 text-center border border-orange-100">
                            <div className="text-4xl font-bold text-orange-500 mb-1">
                                ${lossCount}<span className="text-2xl">B</span>
                            </div>
                            <div className="text-xs text-gray-500 leading-tight">
                                {t('landing.stats_loss')}
                            </div>
                        </div>
                        <div className="bg-red-50 rounded-2xl p-5 text-center border border-red-100">
                            <div className="text-4xl font-bold text-red-600 mb-1">
                                {burnedCount}<span className="text-2xl"> MT</span>
                            </div>
                            <div className="text-xs text-gray-500 leading-tight">
                                Residue Burned Annually
                            </div>
                        </div>
                        <div className="bg-green-50 rounded-2xl p-5 text-center border border-green-100">
                            <div className="text-4xl font-bold text-green-600 mb-1">
                                <span className="text-2xl">Rs.</span>{opportunityCount}
                                <span className="text-2xl">Cr</span>
                            </div>
                            <div className="text-xs text-gray-500 leading-tight">
                                {t('landing.stats_opportunity')}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BURNING TREND CHART */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        Residue Burned vs Diverted (Million Tonnes)
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-8">
                        * 2026 projection with From Field to Factory platform adoption
                    </p>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <ResponsiveContainer width="100%" height={280}>
                            <AreaChart data={burningTrendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                />
                                <Legend />
                                <Area
                                    type="monotone"
                                    dataKey="burned"
                                    name="Burned (MT)"
                                    stroke="#ef4444"
                                    fill="#fee2e2"
                                    strokeWidth={2}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="diverted"
                                    name="Diverted to Industry (MT)"
                                    stroke="#16a34a"
                                    fill="#dcfce7"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* STATE WISE BAR CHART */}
            <section className="py-8 px-4 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                        State-wise Crop Residue Generation (MT)
                    </h2>
                    <p className="text-center text-gray-500 text-sm mb-8">
                        Top 5 residue generating states in India
                    </p>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={stateData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="state" tick={{ fontSize: 13 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                                />
                                <Bar
                                    dataKey="residue"
                                    name="Residue (MT)"
                                    fill="#16a34a"
                                    radius={[6, 6, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        {t('landing.how_title')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <div key={i} className="card text-center relative pt-8">
                                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${step.bg} text-white text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center shadow`}>
                                    {step.number}
                                </div>
                                <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                                    {t(step.titleKey)}
                                </h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {t(step.descKey)}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* INDUSTRIAL BUYERS */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-3">
                        {t('landing.buyers_title')}
                    </h2>
                    <p className="text-center text-gray-500 mb-10">
                        {t('landing.buyers_subtitle')}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {buyers.map((buyer, i) => (
                            <div key={i} className={`border-2 rounded-2xl p-5 text-center ${buyer.color}`}>
                                <div className="w-12 h-12 bg-white rounded-full mx-auto mb-3 flex items-center justify-center shadow-sm">
                                    <span className={`text-sm font-bold ${buyer.textColor}`}>
                                        {buyer.name.slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                                <div className="font-bold text-gray-800 mb-1 text-sm">{buyer.name}</div>
                                <div className="text-xs text-gray-500">{buyer.type}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="bg-primary-600 py-16 px-4 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">
                    Ready to Turn Stubble into Income?
                </h2>
                <p className="mb-8 max-w-xl mx-auto text-primary-100">
                    Join farmers already earning from their crop residue instead of burning it.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/farmer/register')}
                        className="bg-white text-primary-600 font-semibold px-8 py-3 rounded-lg hover:bg-primary-50 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                        <FarmerIcon /> Register as Farmer
                    </button>
                    <button
                        onClick={() => navigate('/buyer/register')}
                        className="border-2 border-white text-white font-semibold px-8 py-3 rounded-lg hover:bg-primary-700 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                        <BuyerIcon /> Register as Buyer
                    </button>
                </div>
            </section>

        </div>
    );
};

export default LandingPage;