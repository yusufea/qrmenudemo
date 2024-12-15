import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useTheme } from "next-themes";
import tr from "../../../locales/tr";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import { IoMdCart } from "react-icons/io";

export default function RestaurantPage() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === "tr" ? tr : locale === "en" ? en : ar;
    const [restaurantId, setRestaurantId] = useState();
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        const restaurantId = window.location.hostname.split('.')[0]; // Subdomain alınır
        setRestaurantId(restaurantId)
        if (restaurantId) {
            console.log(process.env.NEXT_PUBLIC_MENOOZI_API_URL, "2121")
            GetRestaurantCategories(restaurantId);
            GetMostSellerProducts(restaurantId);
        }
    }, []);

    const GetRestaurantCategories = async (restaurantId) => {
        axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/categories/${restaurantId}`).then(data => {
            setCategories(data.data)
        }).catch(error => console.log(error));
    }

    const scrollRefMostSeller = useRef(null);

    const scrollLeft = (scrollRef) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const scrollRight = (scrollRef) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            scrollRight(scrollRefMostSeller);
        }, 3000);

        return () => clearInterval(interval);
    }, []);



    const ReturnCategoryText = (category) => {
        if (!category) return ""; // Eğer kategori yoksa boş bir string döner

        // Öncelik sırasına göre kategori adını döndür
        if (locale === "tr") return category.name_tr; // En son yoksa boş döner
        if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
        if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr

        return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
    }

    const [mostSellerProducts, setMostSellerProducts] = useState();
    const GetMostSellerProducts = async (restaurantId) => {
        axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/mostsellers/${restaurantId}`).then(data => {
            setMostSellerProducts(data.data.items)
        }).catch(error => console.log(error));
    }

    const { theme, setTheme } = useTheme();


    return (
        <div className="container mx-auto px-2.5 my-auto py-2.5 ">
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 mt-1">
                    <h4 className="text-center text-black text-lg font-bold dark:text-white">{t.mostseller}</h4>
                    {
                        categories ?
                            <div className="relative flex items-center border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg">
                                {/* Sol Kaydırma Oku */}
                                <button
                                    onClick={() => scrollLeft(scrollRefMostSeller)}
                                    className="absolute left-2 z-10 rounded-full p-2"
                                >
                                    <FaChevronLeft fontSize={18} className="text-slate-600 dark:text-slate-300" />
                                </button>
                                <div
                                    ref={scrollRefMostSeller}
                                    className="flex overflow-x-scroll whitespace-nowrap py-4 scrollbar-hide w-full px-0"
                                >
                                    {mostSellerProducts?.map((item, index) => (
                                        <a href={`/${item.category_id}/${item.id}`} key={index} className="flex flex-col items-center px-2" style={{ minWidth: 'calc(100% / 2)' }}>
                                            <img src={`${item.image === null ? '/images/noimage.jpg' : item.image}`} alt={ReturnCategoryText(item)} className="w-full h-full rounded-lg" />
                                            <span
                                                className="text-sm text-gray-700 mt-2 dark:text-white truncate"
                                                style={{
                                                    maxWidth: '100%', // Genişlik belirleyin (örneğin: '100px' ya da % değer)
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {ReturnCategoryText(item)}
                                            </span>
                                            {/* <button onClick={() => console.log("test")} className="text-[14px] dark:text-white flex items-center gap-2 justify-center w-full mt-2">
                                        {t.addtobasket}
                                        <IoMdCart className="w-4 h-4 text-black dark:text-white" />
                                    </button> */}
                                        </a>
                                    ))}
                                </div>
                                {/* Sağ Kaydırma Oku */}
                                <button
                                    onClick={() => scrollRight(scrollRefMostSeller)}
                                    className="absolute right-2 z-10 rounded-full p-2"
                                >
                                    <FaChevronRight fontSize={18} className="text-slate-600 dark:text-slate-300" />
                                </button>
                            </div>
                            :
                            <div className="relative flex justify-center items-center border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg">
                                <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                    <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                        </svg>
                                    </div>
                                    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                </div>
                                <div role="status" class="max-w-sm p-2 rounded animate-pulse md:p-6">
                                    <div class="flex items-center justify-center h-28 w-44 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                                        <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                            <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                                            <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                                        </svg>
                                    </div>
                                    <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-44 mb-4"></div>
                                </div>
                            </div>
                    }
                </div>
                <div className="flex flex-col gap-2">
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
        </div>
    );
}
