import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

const LanguageSwitcher = () => {
    const router = useRouter();
    const { locale } = router;
    const changeLanguage = (e) => {
        const locale = e;
        router.push(router.pathname, router.asPath, { locale });
    }

    return (
        <div>
            {locale === 'tr' && <button className='text-black dark:text-white text-md font-semibold' onClick={() => changeLanguage('en')}>EN</button>}
            {locale === 'en' && <button className='text-black dark:text-white text-md font-semibold' onClick={() => changeLanguage('tr')}>TR</button>}
        </div>
    );
};

export default LanguageSwitcher;
