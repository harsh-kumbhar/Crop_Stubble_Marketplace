import {
    FaLeaf, FaIndustry, FaLandmark, FaShieldAlt,
    FaMobileAlt, FaDesktop, FaCog, FaSatellite,
    FaDatabase, FaBrain, FaPlug, FaCheckCircle,
    FaTimesCircle, FaArrowLeft, FaPlus, FaSearch,
    FaFilter, FaSeedling, FaFire, FaMoneyBillWave,
    FaChartBar, FaTractor, FaRecycle, FaBolt,
    FaFileAlt, FaMapMarkerAlt, FaPhone, FaBuilding,
    FaIdCard, FaUserCheck, FaSpinner, FaStar
} from 'react-icons/fa';

import {
    MdVerified, MdPendingActions, MdSatelliteAlt,
    MdAgriculture, MdFactory, MdDashboard,
    MdAddCircle, MdFilterList, MdLocationOn,
    MdAttachMoney, MdEco, MdWarning
} from 'react-icons/md';

import {
    GiWheat, GiCottonFlower, GiCorn,
    GiSugarCane, GiGrass
} from 'react-icons/gi';

// ── USER TYPE ICONS ──────────────────────────────
export const FarmerIcon = (props) => <FaLeaf {...props} />;
export const BuyerIcon = (props) => <FaIndustry {...props} />;
export const GovtIcon = (props) => <FaLandmark {...props} />;
export const AdminIcon = (props) => <FaShieldAlt {...props} />;

// ── CROP ICONS ───────────────────────────────────
export const CropIcons = {
    paddy: (props) => <GiWheat {...props} />,
    wheat: (props) => <GiWheat {...props} />,
    maize: (props) => <GiCorn {...props} />,
    cotton: (props) => <GiCottonFlower {...props} />,
    sugarcane: (props) => <GiSugarCane {...props} />,
    mustard: (props) => <GiGrass {...props} />,
    soybean: (props) => <FaSeedling {...props} />,
    groundnut: (props) => <FaSeedling {...props} />,
    default: (props) => <FaLeaf {...props} />
};

// ── STATUS ICONS ─────────────────────────────────
export const VerifiedIcon = (props) => <MdVerified {...props} />;
export const PendingIcon = (props) => <MdPendingActions {...props} />;
export const ActiveIcon = (props) => <FaCheckCircle {...props} />;
export const SoldIcon = (props) => <FaTimesCircle {...props} />;

// ── FEATURE ICONS ────────────────────────────────
export const SatelliteIcon = (props) => <MdSatelliteAlt {...props} />;
export const AIIcon = (props) => <FaBrain {...props} />;
export const CarbonIcon = (props) => <MdEco {...props} />;
export const MoneyIcon = (props) => <FaMoneyBillWave {...props} />;
export const LocationIcon = (props) => <MdLocationOn {...props} />;
export const FireIcon = (props) => <FaFire {...props} />;
export const RecycleIcon = (props) => <FaRecycle {...props} />;
export const ChartIcon = (props) => <FaChartBar {...props} />;

// ── UI ICONS ─────────────────────────────────────
export const BackIcon = (props) => <FaArrowLeft {...props} />;
export const PlusIcon = (props) => <FaPlus {...props} />;
export const SearchIcon = (props) => <FaSearch {...props} />;
export const FilterIcon = (props) => <FaFilter {...props} />;
export const SpinnerIcon = (props) => <FaSpinner {...props} />;
export const StarIcon = (props) => <FaStar {...props} />;
export const WarningIcon = (props) => <MdWarning {...props} />;
export const BoltIcon = (props) => <FaBolt {...props} />;
export const FileIcon = (props) => <FaFileAlt {...props} />;
export const PhoneIcon = (props) => <FaPhone {...props} />;
export const BuildingIcon = (props) => <FaBuilding {...props} />;
export const IdCardIcon = (props) => <FaIdCard {...props} />;
export const UserCheckIcon = (props) => <FaUserCheck {...props} />;
export const DashboardIcon = (props) => <MdDashboard {...props} />;
export const AgricultureIcon = (props) => <MdAgriculture {...props} />;
export const FactoryIcon = (props) => <MdFactory {...props} />;