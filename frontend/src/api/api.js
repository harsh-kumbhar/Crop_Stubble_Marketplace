import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── FARMER APIs ──────────────────────────────────────────────
export const registerFarmer = (data) =>
    api.post('/farmer/register', data);

export const getFarmer = (id) =>
    api.get(`/farmer/${id}`);

export const getAllFarmers = () =>
    api.get('/farmer/');

// ─── BUYER APIs ───────────────────────────────────────────────
export const registerBuyer = (data) =>
    api.post('/buyer/register', data);

export const getBuyer = (id) =>
    api.get(`/buyer/${id}`);

export const getAllBuyers = () =>
    api.get('/buyer/all');

export const verifyBuyer = (id) =>
    api.patch(`/buyer/${id}/verify`);

// ─── LISTING APIs ─────────────────────────────────────────────
export const createListing = (data) =>
    api.post('/listings/create', data);

export const getAllListings = () =>
    api.get('/listings/');

export const getListingById = (id) =>
    api.get(`/listings/${id}`);

export const filterByCrop = (crop_type) =>
    api.get(`/listings/filter/crop?crop_type=${crop_type}`);

export const filterByState = (state) =>
    api.get(`/listings/filter/state?state=${state}`);

export const markSold = (id) =>
    api.patch(`/listings/${id}/sold`);

export const verifySatellite = (id) =>
    api.patch(`/listings/${id}/verify-satellite`);

// ─── AI PRICE API ─────────────────────────────────────────────
export const getPriceSuggestion = (data) =>
    api.post('/ai/price', data);

export default api;