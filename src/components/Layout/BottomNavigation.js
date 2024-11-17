import { useRouter } from "next/router";
import { IoIosInformationCircle, IoMdHome, IoMdCart } from "react-icons/io";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import tr from "../../../locales/tr";
import { MdMenuBook } from "react-icons/md";

export default function BottomNavigation() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === "tr" ? tr : locale === "en" ? en : ar;

    return (
        <div>
            <div className="fixed bottom-0 left-0 z-3 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <div className="grid h-full max-w-xl grid-cols-3 mx-auto font-medium items-center">
                    <a href={`/${locale}/`} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <IoMdHome className="w-6 h-6 text-black dark:text-white" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t.home}</span>
                    </a>
                    <a href={`/${locale}/bilgi`} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <IoIosInformationCircle className="w-6 h-6 text-black dark:text-white" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t.information}</span>
                    </a>
                    <a href={`/${locale}/menu`} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <MdMenuBook className="w-6 h-6 text-black dark:text-white" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t.menukck}</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
