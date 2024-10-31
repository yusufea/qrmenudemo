import { useRouter } from "next/router";
import { FaWifi } from "react-icons/fa";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import tr from "../../../locales/tr";

export default function Info() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === "en" ? en : locale === "ar" ? ar : tr;

    return (
        <div className="flex flex-col gap-3 ">
            <h4 className="text-center text-black text-lg font-bold dark:text-white">{t.information}</h4>
            <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                        <FaWifi className="w-6 h-6" />
                        <h4 className="text-black dark:text-white text-lg">{t.wifipassword}:</h4>
                    </div>
                    <h4 className="text-black dark:text-white text-lg">bigmamas2023</h4>
                </div>
            </div>
        </div>
    )
}