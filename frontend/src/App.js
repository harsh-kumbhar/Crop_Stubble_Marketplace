import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import FarmerRegister from './pages/FarmerRegister';
import FarmerDashboard from './pages/FarmerDashboard';
import CreateListing from './pages/CreateListing';
import PriceResult from './pages/PriceResult';
import BuyerRegister from './pages/BuyerRegister';
import BuyerDashboard from './pages/BuyerDashboard';
import ListingDetail from './pages/ListingDetail';
import AdminPanel from './pages/AdminPanel';
function App() {
    return (
        <Router>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/farmer/register" element={<FarmerRegister />} />
                        <Route path="/farmer/dashboard/:id" element={<FarmerDashboard />} />
                        <Route path="/farmer/create-listing/:farmerId" element={<CreateListing />} />
                        <Route path="/price-result" element={<PriceResult />} />
                        <Route path="/buyer/register" element={<BuyerRegister />} />
                        <Route path="/buyer/dashboard/:id" element={<BuyerDashboard />} />
                        <Route path="/listing/:id" element={<ListingDetail />} />
                        <Route path="/admin" element={<AdminPanel />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
