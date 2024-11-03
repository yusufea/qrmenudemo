import { useRouter } from "next/router";
import { IoIosInformationCircle, IoMdHome } from "react-icons/io";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import tr from "../../../locales/tr";



export default function BottomNavigation() {
    const router = useRouter();
    const { restaurantId } = router.query;
    const { locale } = router;

    const t = locale === "en" ? en : locale === "ar" ? ar : tr;
    return (
        <div class="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            <div class="grid h-full max-w-xl grid-cols-2 mx-auto font-medium">
                <a href={`/${locale}`} type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                    <IoMdHome className="w-6 h-6 text-black dark:text-white" />
                    <span class="text-sm text-gray-500 dark:text-gray-400">{t.home}</span>
                </a>
                <a href={`/${locale}/bilgi`} type="button" class="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                    <IoIosInformationCircle className="w-6 h-6 text-black dark:text-white" />
                    <span class="text-sm text-gray-500 dark:text-gray-400">{t.profile}</span>
                </a>
            </div>
        </div>
    )
}