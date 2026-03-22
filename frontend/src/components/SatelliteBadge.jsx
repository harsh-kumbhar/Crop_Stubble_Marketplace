import React from 'react';
import { SatelliteIcon, VerifiedIcon, PendingIcon } from './Icons';

const SatelliteBadge = ({ verified = false, quantity = null }) => {
    if (!verified) {
        return (
            <span className="inline-flex items-center gap-1 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full">
                <PendingIcon className="text-yellow-500" />
                Verification Pending
            </span>
        );
    }

    return (
        <div className="flex flex-col gap-1">
            <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                <SatelliteIcon className="text-green-600" />
                Satellite Verified
                <VerifiedIcon className="text-green-600" />
            </span>
            {quantity && (
                <span className="text-xs text-gray-500 pl-1">
                    GEE Analysis — {quantity} tonnes confirmed
                </span>
            )}
        </div>
    );
};

export default SatelliteBadge;