import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoIosPricetag } from "react-icons/io";
import en from "../../../../locales/en";
import ar from "../../../../locales/ar";
import tr from "../../../../locales/tr";

export default function ItemPage() {
    const router = useRouter();
    const { restaurantId, categoryId, itemId } = router.query;
    const { locale } = router;
    const t = locale === "en" ? en : locale === "ar" ? ar : tr;

    const [item, setItem] = useState(null);
    const [categories, setCategories] = useState(null);



    const GetRestaurantCategories = async (restaurantId) => {
        axios.get(`http://menoozi.com.tr/api/categories/${restaurantId}`).then(data => {
            setCategories(data.data)
        }).catch(error => console.log(error));
    }

    const GetItem = async (restaurantId, categoryId) => {
        axios.get(`http://menoozi.com.tr/api/items/${restaurantId}/${categoryId}/${itemId}`).then(data => {
            setItem(data.data[0])
        }).catch(error => console.log(error));
    }

    useEffect(() => {
        if (restaurantId != undefined && categoryId != undefined) {
            GetItem(restaurantId, categoryId);
            GetRestaurantCategories(restaurantId);
        }
    }, [router.query]);


    if (!item) {
        return <div>Yükleniyor...</div>
    }

    const ReturnCategoryText = (category) => {
        if(locale === "tr") return category.name_tr
        if(locale === "en") return category.name_en
        if(locale === "ar") return category.name_ar
    }

    return (
        <div>
            <div>
                <h4 className="text-center text-black text-lg font-bold dark:text-white">{ReturnCategoryText(item)}</h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2 flex flex-col gap-2">
                    <img className="border shadow-md w-full rounded-lg" src={item.image == undefined ? '/images/noimage.jpg' : item.image} />
                    <div className="flex items-center justify-center gap-2">
                        <IoIosPricetag className="w-7 h-7 text-black dark:text-white" />
                        <h6 className="text-black text-2xl dark:text-white font-bold">{item.price} ₺</h6>
                    </div>
                    <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-3 flex flex-col gap-2">
                        <p className="text-black text-lg dark:text-white break-all">
                            {item.description}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-4 mt-8">
                <h4 className="text-center text-black text-lg font-bold dark:text-white"> {t.categories} </h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                    <div className="flex flex-wrap gap-2.5">
                        {categories?.map((category, index) => (
                            <a
                                href={`/${locale}/${restaurantId}/${category.id}`}
                                key={index}
                                className="flex flex-col items-center"
                                style={{ width: `calc((100% / ${category.column_size === 1 ? '2' : '1'}) - 5px)` }}
                            >
                                <div className="relative w-full h-[150px] rounded-lg">
                                    <img src={category.image == undefined ? '/images/noimage.jpg' : category.image} alt={category.name} className="border w-full h-full object-cover opacity-80 rounded-lg" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className={`text-lg font-bold text-center px-2 py-1 break-all ${category.image == undefined ? "text-slate-700" : "text-white"}`}>
                                            {ReturnCategoryText(category)}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}