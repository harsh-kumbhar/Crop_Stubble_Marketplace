import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en', label: 'EN' },
    { code: 'hi', label: 'हि' },
    { code: 'mr', label: 'म' },
];

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
    };

    return (
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`px-3 py-1 rounded-md text-sm font-semibold transition-all duration-200 ${i18n.language === lang.code
                            ? 'bg-primary-600 text-white shadow-sm'
                            : 'text-gray-600 hover:text-primary-600'
                        }`}
                >
                    {lang.label}
                </button>
            ))}
        </div>
    );
};

export default LanguageSwitcher;