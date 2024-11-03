import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import tr from "../../../locales/tr";
export default function CategoryItems() {
    const router = useRouter();
    const { categoryId } = router.query;
    const { locale } = router;
    const t = locale === "en" ? en : locale === "ar" ? ar : tr;

    const [restaurantId, setRestaurantId] = useState();
    const [categoryItems, setCategoryItems] = useState(null);

    useEffect(() => {
        const restaurantId = window.location.hostname.split('.')[0]; // Subdomain alınır
        setRestaurantId(restaurantId)
        if (restaurantId != undefined && categoryId != undefined) {
            GetCategoryItems(restaurantId, categoryId);
        }
    }, [router.query]);

    const GetCategoryItems = async (restaurantId, categoryId) => {
        axios.get(`http://menoozi.com.tr/api/items/${restaurantId}/${categoryId}`).then(data => {
            setCategoryItems(data.data)
        }).catch(error => console.log(error));
    }

    const ReturnCategoryText = (category) => {
        if (category) {
            if (locale === "tr") return category.name_tr || category.name_en; // Eğer name_tr null ise name_en döner
            if (locale === "en") return category.name_en || category.name_en; // En kötü ihtimalle name_en döner
            if (locale === "ar") return category.name_ar || category.name_en; // Eğer name_ar null ise name_en döner
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-4">
                <h4 className="text-center text-black text-lg font-bold dark:text-white">{ReturnCategoryText()}</h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                    <div className="flex flex-wrap w-full gap-4">
                        {categoryItems?.items?.map((item, key) => (
                            <a href={`/${locale}/${categoryId}/${item.id}`} key={key} style={{ width: 'calc((100% / 2) - 8px)' }}>
                                <img src={item.image == undefined ? '/images/noimage.jpg' : item.image} className="rounded-lg border" />
                                <h5 className="text-sm text-gray-700 mt-2 dark:text-white text-center font-bold">{ReturnCategoryText(item)} {item.price} TL</h5>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}