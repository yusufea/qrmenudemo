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
        <div className="px-2">
            <ToastContainer />
            <div>
                {
                    item ?
                        <h4 className="text-center text-black text-lg font-bold dark:text-white py-3">{ReturnItemText(item)}</h4>
                        :
                        <div className="flex justify-center w-full">
                            <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-600 w-64 text-center my-3"></div>
                        </div>
                }
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2 flex flex-col">
                    <div className="relative">
                        {
                            item ?
                                <img className="border shadow-md w-full rounded-lg" src={item?.image} />
                                :
                                <div class="flex items-center justify-center h-64 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                    <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                    </svg>
                                </div>
                        }
                        {item?.chef_choise_flag == 1 ? (
                            <div className="absolute top-2 right-2 bg-slate-800 rounded-full p-2">
                                <LuChefHat className="text-[24px] text-white" />
                            </div>
                        ) : null}
                    </div>
                    <div className="flex gap-1">
                        {item?.chef_choise_flag == 1 ? (
                            <div className="flex">
                                <span className="flex bg-blue-100 text-blue-800 gap-1 text-xs font-medium items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                    <LuChefHat className="text-[20px]" />
                                    {t.chiefchoice}
                                </span>
                            </div>
                        ) : null}
                        {item?.allergens && item?.allergens.trim() !== "" ? (
                            <div className="flex">
                                <span className="flex bg-blue-100 text-blue-800 gap-1 text-xs font-medium items-center px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-blue-400 border border-blue-400">
                                    <PiSealWarningLight className="text-[20px]" />
                                    {t.allergen}
                                </span>
                            </div>
                        ) : null}
                    </div>
                    <div className="py-4">
                        {
                            item ?
                                <div className="flex items-center justify-center gap-2">
                                    <IoIosPricetag className="w-7 h-7 text-black dark:text-white" />
                                    <h6 className="text-black text-2xl dark:text-white font-bold">{item?.price} ₺</h6>
                                </div>
                                :
                                <div className="flex justify-center w-full">
                                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-600 w-32 text-center my-3"></div>
                                </div>
                        }
                    </div>
                    {
                        item ?
                            <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-3 flex flex-col gap-2">
                                <h6 className="text-center text-lg font-bold dark:text-white">
                                    Açıklama
                                </h6>
                                <p className="text-black text-lg dark:text-white break-all">
                                    {ReturnDescriptionText(item)}
                                </p>
                            </div>
                            :
                            <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-3 flex flex-col gap-2">
                                <div className="flex justify-center w-full">
                                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-600 w-32 text-center my-3"></div>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-600 w-full text-center my-3"></div>
                                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-600 w-full text-center my-3"></div>
                                    <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-600 w-32 text-center my-3"></div>
                                </div>
                            </div>
                    }
                    {item?.allergens && item?.allergens.trim() !== "" ? (
                        <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-3 flex flex-col gap-2">
                            <h6 className="text-center text-lg font-bold dark:text-white">
                                {t.allergen}
                            </h6>
                            <p className="text-black text-lg dark:text-white break-all">
                                {item?.allergens}
                            </p>
                        </div>
                    ) : null}
                    <div className="py-4">
                        {
                            item ?
                                <div className="flex justify-center items-center">
                                    <button onClick={(e) => handleClick(e, item)} className="border rounded-lg text-md w-1/2 py-2.5 dark:text-white font-medium flex items-center gap-2 justify-center w-full dark:border-gray-600">
                                        {t.addtobasket}
                                        <IoMdCart className="w-4 h-4 text-black dark:text-white" />
                                    </button>
                                </div>
                                :
                                <div className="flex justify-center items-center">
                                    <div className="flex justify-center w-full border rounded-lg text-md w-1/2 py-1 dark:text-white font-medium flex items-center gap-2 justify-center w-full dark:border-gray-600">
                                        <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-600 w-32 text-center my-3 "></div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <h4 className="text-center text-black text-lg font-bold dark:text-white">{t.categories}</h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                    <main className="container flex flex-col gap-4 py-2">
                        <section id="categories">
                            {categories ?
                                <div className="horizontalProductList border-slate-500 shadow border flex flex-wrap justify-evenly items-center gap-1">
                                    {categories?.map((item) => (
                                        <a
                                            key={item.id} // Eklenmesi gereken benzersiz bir anahtar
                                            className="homePageCategory flex-grow p-4 py-5 text-center shadow flex items-center justify-center relative overflow-hidden"
                                            style={{
                                                backgroundImage: `url(${item.image})`,
                                                minHeight: '120px', // Kapsayıcının en az yüksekliği
                                                backgroundSize: 'cover', // Arka planı kapsayıcıya sığdır
                                                backgroundPosition: 'center', // Arka planı ortala
                                            }}
                                            href={`/${locale}/${item.id}`}
                                        >
                                            <span className="absolute inset-0 bg-black opacity-50" /> {/* Siyah opak katman */}
                                            <span className="relative text-white z-10">{ReturnCategoryText(item)}</span> {/* Beyaz yazı */}
                                        </a>
                                    ))}
                                </div>
                                :
                                <div className="flex flex-col">
                                    <div className="flex gap-2 justify-center">
                                        <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-28 mb-2.5"></div>
                                        </div>
                                        <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-28 mb-2.5"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                        <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-28 mb-2.5"></div>
                                        </div>
                                        <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-28 mb-2.5"></div>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-center h-28 w-full mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                        <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-48 mb-2.5"></div>
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                        <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-28 mb-2.5"></div>
                                        </div>
                                        <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-28 mb-2.5"></div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 justify-center">
                                        <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-28 mb-2.5"></div>
                                        </div>
                                        <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-600 w-28 mb-2.5"></div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </section>
                    </main>
                </div>
            </div>
        </div>
    )
}
