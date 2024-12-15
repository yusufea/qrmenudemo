import axios from "axios";
import ThemeSwitcher from "@/components/switch/ThemeSwitcher";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import en from "../../../../locales/en";
import tr from "../../../../locales/tr";
import ar from "../../../../locales/ar";
import { useTheme } from "next-themes";
import { IoMdCart } from "react-icons/io";
import { IoRemove } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";

export default function Header() {
    const scrollRefNavbarCategories = useRef(null);

    const scrollLeft = (scrollRef) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: -150, behavior: "smooth" });
        }
    };

    const scrollRight = (scrollRef) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 150, behavior: "smooth" });
        }
    };

    const router = useRouter();

    const { locale } = router;
    const { restaurantId } = router.query;
    const t = locale === "tr" ? tr : locale === "en" ? en : ar;
    const [categories, setCategories] = useState(null);
    const [customers, setCustomers] = useState();
    useEffect(() => {
        const restaurantId = window.location.hostname.split('.')[0]; // Subdomain alınır
        if (restaurantId) {
            GetRestaurantCategories(restaurantId);
            GetCustomers(restaurantId)
        }
    }, []);

    const GetRestaurantCategories = async (restaurantId) => {
        axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/categories/${restaurantId}`).then(data => {
            setCategories(data.data)
        }).catch(error => console.log(error));
    }

    const GetCustomers = async (restaurantId) => {
        axios.get(`${process.env.NEXT_PUBLIC_MENOOZI_API_URL}/customers/${restaurantId}`).then(data => {
            setCustomers(data.data)
        }).catch(error => console.log(error));
    }


    const ReturnCategoryText = (category) => {
        if (!category) return ""; // Eğer kategori yoksa boş bir string döner

        // Öncelik sırasına göre kategori adını döndür
        if (locale === "tr") return category.name_tr; // En son yoksa boş döner
        if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
        if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr

        return ""; // Eğer hiçbir locale tanımlı değilse boş bir string döner
    }

    const { theme, setTheme } = useTheme();

    console.log(customers)

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const total = cartItems.reduce(
            (sum, item) => sum + item.amount * parseFloat(item.price),
            0
        );
        setTotalPrice(total);
    }, [cartItems]);

    const handleClearCart = () => {
        sessionStorage.removeItem("cart");
        setCartItems([]);
        setTotalPrice(0);
    };

    const handleIncreaseAmount = (index) => {
        const updatedCart = [...cartItems];
        updatedCart[index].amount += 1;
        setCartItems(updatedCart);
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const handleDecreaseAmount = (index) => {
        const updatedCart = [...cartItems];
        if (updatedCart[index].amount > 1) {
            updatedCart[index].amount -= 1;
        } else {
            updatedCart.splice(index, 1);
        }
        setCartItems(updatedCart);
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const ReturnItemText = (category) => {
        if (!category) return "";
        if (locale === "tr") return category.name_tr;
        if (locale === "en") return category.name_en ? category.name_en : category.name_tr;
        if (locale === "ar") return category.name_ar ? category.name_ar : category.name_en ? category.name_en : category.name_tr;
        return "";
    };

    useEffect(() => {
        if (isDrawerOpen) {
            const cartData = JSON.parse(sessionStorage.getItem("cart")) || [];
            setCartItems(cartData);
        }
    }, [isDrawerOpen]);
    return (
        <div>
            <div className="container mx-auto px-2.5 my-auto py-2.5 dark:bg-slate-900">
                <div className="flex justify-between h-full">
                    <a href={`/${locale}`}>
                        {/* <img className="w-20 h-auto" src={theme === "light" ? "http://menoozi.com.tr/categories/labondy/logolabondy.jpg" : "http://menoozi.com.tr/categories/labondy/logolabondy.jpg"} /> */}
                        {
                            customers?.banner ?
                                <img className="w-20 h-auto" src={customers?.logo} /> :
                                <div class="flex items-center justify-center w-20 h-20 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                                    <svg class="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                    </svg>
                                </div>
                        }
                    </a>
                    <div className="flex gap-4 items-center">
                        <IoMdCart onClick={() => setIsDrawerOpen(true)} className="w-6 h-6 text-black dark:text-white" />
                        <LanguageSwitcher />
                        <div className="h-14">
                            <div className="h-full flex flex-col justify-center items-center">
                                <ThemeSwitcher />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-screen border-b border-gray-300 dark:border-gray-700"></div>
            {
                router.pathname === '/' || router.pathname === '/geribildirim' || router.pathname === '/carkcevir' ?
                    null
                    :
                    <div className="relative flex items-center border-b border-slate-600 dark:bg-slate-800">
                        {/* Sol Kaydırma Oku */}
                        <button
                            onClick={() => scrollLeft(scrollRefNavbarCategories)}
                            className="absolute left-3 z-10 rounded-full hover:bg-gray-300"
                            style={{ transform: 'translateX(-50%)' }}
                        >
                            <FaChevronLeft className="text-slate-600 dark:text-slate-400" />
                        </button>

                        {/* Kategori Listesi */}
                        {
                            categories ?
                                (
                                    <nav
                                        ref={scrollRefNavbarCategories}
                                        className="flex overflow-x-scroll whitespace-nowrap py-2 scrollbar-hide mx-8"
                                    >
                                        {categories?.map((category, index) => (
                                            <a href={`/${locale}/${category.id}`} key={index} className="px-2 py-1 font-semibold text-base text-gray-700 cursor-pointer hover:text-blue-500 dark:text-white">
                                                {ReturnCategoryText(category)}
                                            </a>
                                        ))}
                                    </nav>
                                )
                                :
                                <div class="flex items-center w-full max-w-[400px] overflow-x-scroll whitespace-nowrap py-4 scrollbar-hide mx-8">
                                    <div class="h-3 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                                    <div class="h-3 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                                    <div class="h-3 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                                </div>
                        }
                        {/* Sağ Kaydırma Oku */}
                        <button
                            onClick={() => scrollRight(scrollRefNavbarCategories)}
                            className="absolute right-4 z-10 rounded-full hover:bg-gray-300"
                            style={{ transform: 'translateX(50%)' }}
                        >
                            <FaChevronRight className="dark:text-slate-400" />
                        </button>
                    </div>
            }

            {isDrawerOpen && (
                <div
                    onClick={() => setIsDrawerOpen(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                />
            )}

            <div
                id="drawer-navigation"
                className={`fixed top-0 right-0 z-50 w-64 h-screen p-4 overflow-y-auto transition-transform ${isDrawerOpen ? "translate-x-0" : "translate-x-full"} bg-white dark:bg-gray-800`}
                tabIndex="-1"
                aria-labelledby="drawer-navigation-label"
            >
                <h5 id="drawer-navigation-label" className="text-base font-semibold text-gray-500 uppercase dark:text-white">
                    {t.basket}
                </h5>
                <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg
                        aria-hidden="true"
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414 1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                    <span className="sr-only">Close menu</span>
                </button>
                <div className="py-4 overflow-y-auto">
                    <ul className="space-y-2 font-medium">
                        {cartItems.length > 0 ? (
                            cartItems.map((item, index) => (
                                <li key={index} className="border-b pb-2">
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-0.5">
                                            <h4 className="text-[13px] font-semibold">{ReturnItemText(item)}</h4>
                                            <h5 className="text-[13px] font-normal">{item.amount} x {item.price} TL</h5>
                                            <h6 className="text-[13px] font-normal">
                                                Toplam: {item.amount * parseFloat(item.price)} TL
                                            </h6>
                                            <div className="flex gap-2">
                                                <FaPlus className="text-[20px] p-1 border border-2 rounded-full" onClick={() => handleIncreaseAmount(index)} />
                                                {item.amount > 1 ? (
                                                    <IoRemove className="text-[20px] p-1 border border-2 rounded-full" onClick={() => handleDecreaseAmount(index)} />
                                                ) : (
                                                    <FaRegTrashAlt className="text-[20px] p-1 border border-2 rounded-full" onClick={() => handleDecreaseAmount(index)} />
                                                )}
                                            </div>
                                        </div>
                                        <img
                                            className="w-20 h-full rounded-lg"
                                            src={item.image ? item.image : '/images/noimage.jpg'}
                                        />
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="text-center text-gray-500">{t.emptyBasket}</li>
                        )}
                    </ul>
                    <div className="flex flex-col justify-end items-end gap-2 mt-2">
                        <h4 className="font-semibold text-md dark:text-white text-black">Toplam Tutar: <span className="font-bold text-red-400">{totalPrice.toFixed(2)} TL</span></h4>
                        <button
                            onClick={handleClearCart}
                            type="button"
                            className="flex py-3 justify-center gap-2 items-center text-[17px] text-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-[10px] me-2 mb-2 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            Sepeti Boşalt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}