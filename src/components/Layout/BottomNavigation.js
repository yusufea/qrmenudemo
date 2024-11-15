import { useRouter } from "next/router";
import { IoIosInformationCircle, IoMdHome, IoMdCart } from "react-icons/io";
import en from "../../../locales/en";
import ar from "../../../locales/ar";
import tr from "../../../locales/tr";
import { useState, useEffect } from "react";
import { IoRemove } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { FaRegTrashAlt } from "react-icons/fa";

export default function BottomNavigation() {
    const router = useRouter();
    const { locale } = router;
    const t = locale === "tr" ? tr : locale === "en" ? en : ar;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (isDrawerOpen) {
            const cartData = JSON.parse(sessionStorage.getItem("cart")) || [];
            setCartItems(cartData);
        }
    }, [isDrawerOpen]);

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

    return (
        <div>
            <div className="fixed bottom-0 left-0 z-3 w-full h-16 bg-white border-t border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <div className="grid h-full max-w-xl grid-cols-3 mx-auto font-medium items-center">
                    <a href={`/${locale}/menu`} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <IoMdHome className="w-6 h-6 text-black dark:text-white" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t.home}</span>
                    </a>
                    <a href={`/${locale}/bilgi`} className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group">
                        <IoIosInformationCircle className="w-6 h-6 text-black dark:text-white" />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{t.information}</span>
                    </a>
                    <div className="flex flex-col text-center items-center justify-center">
                        <IoMdCart className="w-6 h-6 text-black dark:text-white" />
                        <button onClick={() => setIsDrawerOpen(true)} className="text-sm text-gray-500 dark:text-gray-400">
                            Sepet
                        </button>
                    </div>
                </div>
            </div>

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
                        <h4 className="font-semibold text-md">Toplam Tutar: <span className="font-bold text-red-400">{totalPrice.toFixed(2)} TL</span></h4>
                        <button
                            onClick={handleClearCart}
                            type="button"
                            className="flex py-3 justify-center gap-2 items-center text-[17px] text-center text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-md text-sm px-5 py-[10px] me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                        >
                            Sepeti Boşalt
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
