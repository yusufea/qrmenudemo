import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { useState } from 'react';

const LanguageSwitcher = () => {
    const router = useRouter();
    const { locale } = router;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    console.log(locale)
    const changeLanguage = (selectedLocale) => {
        router.push(router.pathname, router.asPath, { locale: selectedLocale });
        setIsDropdownOpen(false); // Dropdown'u kapat
    };

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="text-black dark:text-white text-md font-semibold"
            >
                {locale.toUpperCase()} ▼
            </button>

            {isDropdownOpen && (
                <div className="z-10 absolute mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg">
                    <button
                        onClick={() => changeLanguage('tr')}
                        className={`block px-4 py-2 text-black dark:text-white text-md font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 ${locale === 'tr' ? 'bg-gray-200 dark:bg-gray-700' : ''
                            }`}
                    >
                        TR
                    </button>
                    <button
                        onClick={() => changeLanguage('en')}
                        className={`block px-4 py-2 text-black dark:text-white text-md font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 ${locale === 'en' ? 'bg-gray-200 dark:bg-gray-700' : ''
                            }`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => changeLanguage('ar')}
                        className={`block px-4 py-2 text-black dark:text-white text-md font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 ${locale === 'en' ? 'bg-gray-200 dark:bg-gray-700' : ''
                            }`}
                    >
                        AR
                    </button>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
