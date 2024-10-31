import axios from "axios";
import ThemeSwitcher from "@/components/switch/ThemeSwitcher";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import en from "../../../../locales/en";
import tr from "../../../../locales/tr";
import ar from "../../../../locales/ar";

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
    const t = locale === "en" ? en : locale === "ar" ? ar : tr;
    console.log(t)
    const { restaurantId, categoryId } = router.query;
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        if (restaurantId) {
            GetRestaurantCategories(restaurantId);
        }
    }, [router.query]);

    const GetRestaurantCategories = async (restaurantId) => {
        axios.get(`http://menoozi.com.tr/api/categories/${restaurantId}`).then(data => {
            setCategories(data.data)
        }).catch(error => console.log(error));
    }


    const ReturnCategoryText = (category) => {
        if(locale === "tr") return category.name_tr
        if(locale === "en") return category.name_en
        if(locale === "ar") return category.name_ar
    }
    return (
        <div>
            <div className="container mx-auto px-2.5 my-auto py-2.5 dark:bg-slate-900">
                <div className="flex justify-between h-full">
                    <a href={`/${locale}/${restaurantId}`}>
                        <img className="w-20 h-auto rounded-full" src="/images/logo/icon.png" />
                    </a>
                    <div className="flex gap-4 items-center">
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
                <nav
                    ref={scrollRefNavbarCategories}
                    className="flex overflow-x-scroll whitespace-nowrap py-2 scrollbar-hide mx-8"
                >
                    {categories?.map((category, index) => (
                        <a href={`/${locale}/${restaurantId}/${category.id}`} key={index} className="px-2 py-1 font-semibold text-base text-gray-700 cursor-pointer hover:text-blue-500 dark:text-white">
                            {ReturnCategoryText(category)}
                        </a>
                    ))}
                </nav>

                {/* Sağ Kaydırma Oku */}
                <button
                    onClick={() => scrollRight(scrollRefNavbarCategories)}
                    className="absolute right-4 z-10 rounded-full hover:bg-gray-300"
                    style={{ transform: 'translateX(50%)' }}
                >
                    <FaChevronRight className="dark:text-slate-400" />
                </button>
            </div>
        </div>
    )
}