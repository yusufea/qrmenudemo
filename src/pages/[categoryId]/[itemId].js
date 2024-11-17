import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { IoIosPricetag } from "react-icons/io";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import tr from "../../../locales/tr";
import { IoMdCart } from "react-icons/io";
import { LuChefHat } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { PiSealWarningLight } from "react-icons/pi";

export default function ItemPage() {
    const router = useRouter();
    const { categoryId, itemId } = router.query;
    const { locale } = router;
    const t = locale === "tr" ? tr : locale === "en" ? en : ar;

    const [item, setItem] = useState(null);
    const [categories, setCategories] = useState(null);
    const [restaurantId, setRestaurantId] = useState();

    const GetRestaurantCategories = async (restaurantId) => {
        axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/categories/${restaurantId}`).then(data => {
            setCategories(data.data)
        }).catch(error => console.log(error));
    }

    const GetItem = async (restaurantId, categoryId) => {
        axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/items/${restaurantId}/${categoryId}/${itemId}`).then(data => {
            setItem(data.data)
        }).catch(error => console.log(error));
    }

    useEffect(() => {
        const restaurantId = window.location.hostname.split('.')[0];
        setRestaurantId(restaurantId)
        if (restaurantId != undefined && categoryId != undefined) {
            GetItem(restaurantId, categoryId);
            GetRestaurantCategories(restaurantId);
        }
    }, [router.query]);

    if (!item) {
        return <div>Yükleniyor...</div>
    }

    const ReturnItemText = (category) => {
        if (!category) return "";
        if (locale === "tr") return category.name_tr;
        if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
        if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr
        return "";
    }

    const ReturnDescriptionText = (item) => {
        if (!item) return "";
        if (locale === "tr") return item.description;
        if (locale === "en") return item.description_en ? item.description_en : item.description;
        if (locale === "ar") return item.description_ar ? item.description_ar : item.description_en ? item.description_en : item.description
        return "";
    }

    const ReturnCategoryText = (category) => {
        if (!category) return "";
        if (locale === "tr") return category.name_tr;
        if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
        if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr
        return "";
    }

    const handleClick = (event, item) => {
        event.preventDefault();
        addToCart(item);
    };

    const addToCart = (item) => {
        const currentCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex >= 0) {
            currentCart[existingItemIndex].amount += 1;
        } else {
            item.amount = 1;
            currentCart.push(item);
        }

        sessionStorage.setItem('cart', JSON.stringify(currentCart));

        // Toast bildirimini göster
        toast.success(t.productaddtocard, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    return (
        <div>
            <ToastContainer />
            <div>
                <h4 className="text-center text-black text-lg font-bold dark:text-white py-3">{ReturnItemText(item)}</h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2 flex flex-col gap-2">
                    <div className="relative">
                        <img className="border shadow-md w-full rounded-lg" src={item.image == undefined ? '/images/noimage.jpg' : item.image} />
                        {item.chef_choise_flag == 1 ? (
                            <div className="absolute top-2 right-2 bg-slate-800 rounded-full p-2">
                                <LuChefHat className="text-[24px] text-white" />
                            </div>
                        ) : null}
                    </div>
                    <div className="flex gap-1">
                        {item.chef_choise_flag == 1 ? (
                            <div className="flex">
                                <span className="flex bg-blue-100 text-blue-800 gap-1 text-xs font-medium items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                    <LuChefHat className="text-[20px]" />
                                    {t.chiefchoice}
                                </span>
                            </div>
                        ) : null}
                        {item.allergens && item.allergens.trim() !== "" ? (
                            <div className="flex">
                                <span className="flex bg-blue-100 text-blue-800 gap-1 text-xs font-medium items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                    <PiSealWarningLight className="text-[20px]" />
                                    {t.allergen}
                                </span>
                            </div>
                        ) : null}
                    </div>
                    <div className="flex items-center justify-center gap-2">
                        <IoIosPricetag className="w-7 h-7 text-black dark:text-white" />
                        <h6 className="text-black text-2xl dark:text-white font-bold">{item.price} ₺</h6>
                    </div>
                    <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-3 flex flex-col gap-2">
                        <h6 className="text-center text-lg font-bold dark:text-white">
                            Açıklama
                        </h6>
                        <p className="text-black text-lg dark:text-white break-all">
                            {ReturnDescriptionText(item)}
                        </p>
                    </div>
                    {item.allergens && item.allergens.trim() !== "" ? (
                        <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-3 flex flex-col gap-2">
                            <h6 className="text-center text-lg font-bold dark:text-white">
                                {t.allergen}
                            </h6>
                            <p className="text-black text-lg dark:text-white break-all">
                                {item.allergens}
                            </p>
                        </div>
                    ) : null}
                    <div className="flex justify-center items-center">
                        <button onClick={(e) => handleClick(e, item)} className="border rounded-lg text-md w-1/2 py-1 dark:text-white font-medium flex items-center gap-2 justify-center w-full mt-2">
                            {t.addtobasket}
                            <IoMdCart className="w-4 h-4 text-black dark:text-white" />
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <h4 className="text-center text-black text-lg font-bold dark:text-white">{t.categories}</h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                    <main className="container flex flex-col gap-4 py-2">
                        <section id="categories">
                            <div className="horizontalProductList border-slate-500 shadow border flex flex-wrap justify-evenly items-center gap-1">
                                {categories?.map((item) => (
                                    <a
                                        key={item.id}
                                        className="homePageCategory flex-grow p-4 py-5 text-center shadow flex items-center justify-center relative overflow-hidden"
                                        style={{
                                            backgroundImage: `url(${item.image})`,
                                            minHeight: '120px',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                        href={`/${locale}/${item.id}`}
                                    >
                                        <span className="absolute inset-0 bg-black opacity-50" />
                                        <span className="relative text-white z-10">{ReturnCategoryText(item)}</span>
                                    </a>
                                ))}
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    )
}
