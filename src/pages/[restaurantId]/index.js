import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function RestaurantPage() {
    const router = useRouter();
    const { restaurantId } = router.query;

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
    console.log(categories)
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 mt-1">
                <h4 className="text-center text-black text-lg font-bold dark:text-white">Çok Satan Ürünler</h4>
                <div className="relative flex items-center border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg">
                    {/* Sol Kaydırma Oku */}
                    <button
                        onClick={() => scrollLeft(scrollRefMostSeller)}
                        className="absolute left-2 z-10 rounded-full p-2"
                    >
                        <FaChevronLeft fontSize={18} className="text-slate-600 dark:text-slate-300" />
                    </button>

                    {/* Kategori Listesi */}
                    <div
                        ref={scrollRefMostSeller}
                        className="flex overflow-x-scroll whitespace-nowrap py-4 scrollbar-hide w-full px-0"
                    >
                        {[
                            { image: "/images/products/prod1.webp", text: "Ürün 1", href: "churros" },
                            { image: "/images/products/prod2.webp", text: "Ürün 2", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 3", href: "sansebastian" },
                            { image: "/images/products/prod2.webp", text: "Ürün 4", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 5", href: "nargile" },
                            { image: "/images/products/prod1.webp", text: "Ürün 6", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 5", href: "nargile" },
                            { image: "/images/products/prod1.webp", text: "Ürün 3", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 3", href: "nargile" },
                            { image: "/images/products/prod3.webp", text: "Ürün 3", href: "nargile" },
                            { image: "/images/products/prod1.webp", text: "Ürün 6", href: "nargile" },
                            { image: "/images/products/prod2.webp", text: "Ürün 8", href: "nargile" },
                        ].map((item, index) => (
                            <a href={`/urun/${item.href}`} key={index} className="flex flex-col items-center px-2" style={{ minWidth: 'calc(100% / 3)' }}>
                                <img src={item.image} alt={item.text} className="w-full h-full rounded-lg" />
                                <span className="text-sm text-gray-700 mt-2 dark:text-white">{item.text}</span>
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
            </div>
            <div className="flex flex-col gap-2">
                <h4 className="text-center text-black text-lg font-bold dark:text-white">Kategoriler</h4>
                <div className="border dark:border-slate-600 shadow-md dark:bg-slate-800 rounded-lg p-2">
                    <div className="flex flex-wrap gap-2.5">
                        {categories?.map((category, index) => (
                            <a
                                href={`/${restaurantId}/${category.id}`}
                                key={index}
                                className="flex flex-col items-center"
                                style={{ width: `calc((100% / ${category.column_size === 1 ? '2' : '1'}) - 5px)` }}
                            >
                                <div className="relative w-full h-[150px] rounded-lg">
                                    <img src={category.image == undefined ? '/images/noimage.jpg' : category.image} alt={category.name} className="border w-full h-full object-cover opacity-80 rounded-lg" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="text-lg font-bold text-white text-center px-2 py-1 break-all">
                                            {category.name_tr}
                                        </span>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                    {/* {organizedCategories.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex w-full gap-2 mb-2.5">
                            {row.items.map((category, index) => (
                                <a
                                    href="#"
                                    key={index}
                                    className="flex flex-col items-center"
                                    style={{ width: `${(category.columns / 12) * 100}%` }}
                                >
                                    <div className="relative w-full h-[120px]">
                                        <img src={category.image} alt={category.name} className="w-full h-full object-cover rounded-lg opacity-80" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-lg font-bold text-white text-center px-2 py-1">
                                                {category.name}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ))} */}
                </div>
            </div>

        </div>
    );
}
