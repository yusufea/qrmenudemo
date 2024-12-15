import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import tr from "../../../locales/tr";
import { IoMdCart } from "react-icons/io";
import { LuChefHat } from "react-icons/lu";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function CategoryItems() {
    const router = useRouter();
    const { categoryId } = router.query;
    const { locale } = router;
    const t = locale === "tr" ? tr : locale === "en" ? en : ar;

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

    const ReturnItemText = (category) => {
        if (!category) return ""; // Eğer kategori yoksa boş bir string döner

        // Öncelik sırasına göre kategori adını döndür
        if (locale === "tr") return category.name_tr; // En son yoksa boş döner
        if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
        if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr

        return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
    }

    const ReturnCategoryText = (category) => {
        if (!category) return ""; // Eğer kategori yoksa boş bir string döner

        // Öncelik sırasına göre kategori adını döndür
        if (locale === "tr") return category.category_name_tr; // En son yoksa boş döner
        if (locale === "en") return category.category_name_en ? category.category_name_en : category.category_name_tr;
        if (locale === "ar") return category.category_name_ar ? category.category_name_ar : category.category_name_en ? category.category_name_en : category.category_name_tr

        return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
    }

    const handleClick = (event, item) => {
        event.preventDefault(); // a etiketinin varsayılan davranışını engelle
        addToCart(item); // Sepete ürün ekle
    };

    const addToCart = (item) => {
        // Mevcut sepeti al veya boş bir dizi oluştur
        const currentCart = JSON.parse(sessionStorage.getItem('cart')) || [];

        // Ürün zaten sepette mi kontrol et
        const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);

        if (existingItemIndex >= 0) {
            // Ürün zaten varsa amountu 1 artır
            currentCart[existingItemIndex].amount += 1;
        } else {
            // Ürün yoksa amountu 1 olarak ayarla ve sepete ekle
            item.amount = 1;
            currentCart.push(item);
        }

        // Güncellenmiş sepeti sessionStorage'e kaydet
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
            <div className="flex flex-col">
                {
                    categoryItems ?
                        <h4 className="text-center text-black text-lg font-bold dark:text-white my-3">
                            {ReturnCategoryText(categoryItems)}
                        </h4>
                        :
                        <div className="flex justify-center w-full">
                            <div class="h-4 bg-gray-200 rounded-full dark:bg-gray-600 w-44 text-center my-3"></div>
                        </div>
                }
                <div className="p-2">
                    <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                        {
                            categoryItems ?
                                <div className="flex flex-wrap w-full gap-4">
                                    {categoryItems?.items?.map((item, key) => (
                                        <a
                                            href={`/${locale}/${categoryId}/${item.id}`}
                                            className="flex flex-col justify-between"
                                            key={key}
                                            style={{ width: 'calc((100% / 2) - 8px)' }}
                                        >
                                            <div className="relative">
                                                {
                                                    item.image ?
                                                        <img
                                                            src={item.image == undefined ? '/images/noimage.jpg' : item.image}
                                                            className="rounded-lg border h-32 w-full"
                                                        />
                                                        :
                                                        <div class="flex items-center justify-center h-32 w-full mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                                            <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                                            </svg>
                                                        </div>
                                                }
                                                {item.chef_choise_flag == 1 ?
                                                    <div className="absolute top-2 right-2 bg-slate-800 rounded-full p-1.5">
                                                        <LuChefHat className="text-[20px] text-white" />
                                                    </div> : null
                                                }
                                            </div>
                                            <h5 className="text-sm text-gray-700 mt-2 dark:text-white text-center font-bold">
                                                {ReturnItemText(item)} {item.price} TL
                                            </h5>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation(); // a etiketine tıklamayı durdurur
                                                    addToCart(item);
                                                }}
                                                className="text-[14px] dark:text-white font-medium flex items-center gap-2 justify-center w-full mt-2"
                                            >
                                                {t.addtobasket}
                                                <IoMdCart className="w-4 h-4 text-black dark:text-white" />
                                            </button>
                                        </a>
                                    ))}
                                </div>
                                :
                                <div className="flex flex-col">
                                    <div className="flex justify-center">
                                        <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                            <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                                </svg>
                                            </div>
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                            <div className="flex justify-center">
                                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
                                            </div>
                                        </div>
                                        <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                            <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                                </svg>
                                            </div>
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                            <div className="flex justify-center">
                                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                            <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                                </svg>
                                            </div>
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                            <div className="flex justify-center">
                                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
                                            </div>
                                        </div>
                                        <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                            <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                                </svg>
                                            </div>
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                            <div className="flex justify-center">
                                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                            <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                                </svg>
                                            </div>
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                            <div className="flex justify-center">
                                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
                                            </div>
                                        </div>
                                        <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                            <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                                </svg>
                                            </div>
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                            <div className="flex justify-center">
                                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-center">
                                        <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                            <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                                </svg>
                                            </div>
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                            <div className="flex justify-center">
                                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
                                            </div>
                                        </div>
                                        <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                            <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                                <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                                    <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                                </svg>
                                            </div>
                                            <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                            <div className="flex justify-center">
                                                <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-4"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}