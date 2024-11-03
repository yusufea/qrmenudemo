import { useRouter } from "next/router";
import { FaWifi } from "react-icons/fa";
import en from "../../locales/en";
import ar from "../../locales/ar";
import tr from "../../locales/tr";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Info() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === "en" ? en : locale === "ar" ? ar : tr;

    const [restaurantId, setRestaurantId] = useState();
    const [menuInfos, setMenuInfos] = useState(null);

    useEffect(() => {
        const restaurantId = window.location.hostname.split('.')[0]; // Subdomain alınır
        setRestaurantId(restaurantId)
        if (restaurantId) {
            GetMenuInfos(restaurantId);
        }
    }, []);

    const GetMenuInfos = async (restaurantId) => {
        axios.get(`http://menoozi.com.tr/api/menuInfo/${restaurantId}/`).then(data => {
            setMenuInfos(data.data[0])
        }).catch(error => console.log(error));
    }

    const ReturnCategoryText = (menuItem) => {
        if (menuItem) {
            if (locale === "tr") return menuItem.name_tr
            if (locale === "en") return menuItem.name_en
            if (locale === "ar") return menuItem.name_ar
        }
    }
    return (
        <div className="flex flex-col gap-3 ">
            <h4 className="text-center text-black text-lg font-bold dark:text-white">{t.information}</h4>
            <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                <div className="flex gap-2">
                    <div className="flex items-center gap-2">
                        <FaWifi className="w-6 h-6" />
                        <h4 className="text-black dark:text-white text-lg">{ReturnCategoryText(menuInfos)}:</h4>
                    </div>
                    <h4 className="text-black dark:text-white text-lg">{menuInfos?.value}</h4>
                </div>
            </div>
        </div>
    )
}